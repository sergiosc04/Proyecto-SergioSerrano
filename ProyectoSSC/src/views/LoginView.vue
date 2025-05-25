<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase'
import { useSessionStore } from '../stores/session'
import { useRouter } from 'vue-router'
import Modal from '@/components/Modal.vue'

import mail from '../assets/img/login/mail.png'
import candado from '../assets/img/login/candado.png'
import SpinnerCarga from '@/components/SpinnerCarga.vue'

const router = useRouter()

const cargando = ref(false)         // Estado de carga durante login
const email = ref('')               // Email del usuario
const password = ref('')            // Contraseña del usuario

// Estado del modal para mostrar mensajes
const mostrarModal = ref(false)
const mensajeModal = ref('')

const sessionStore = useSessionStore()

// Función que maneja el proceso de inicio de sesión
const manejarLogin = async () => {
    try {
        cargando.value = true

        // Intenta autenticar con email y password
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        })

        if (error) throw error

        if (data?.session) {
            // Guarda la sesión en el store tras login exitoso
            sessionStore.setSession(data.session)
            mensajeModal.value = "Sesión iniciada correctamente."
            mostrarModal.value = true
            router.push('/cuenta') // Redirige a la página de cuenta
        } else {
            mensajeModal.value = "Error al recuperar la sesión"
            mostrarModal.value = true
        }
    } catch (error) {
        // Verifica si el error tiene la propiedad 'code' y si es 'invalid_credentials'
        if (error?.code === 'invalid_credentials') {
            mensajeModal.value = "Email o contraseña incorrectos"
            mostrarModal.value = true
        } else if (error instanceof Error) {
            mensajeModal.value = error.message
            mostrarModal.value = true
        } else {
            // Fallback para otros tipos de error
            mensajeModal.value = "Error desconocido al iniciar sesión"
            mostrarModal.value = true
        }
    } finally {
        cargando.value = false
    }
}

// Navega a la página de registro
const cambiarARegistro = () => {
    router.push('/registro')
}

// Si ya hay sesión activa, redirige automáticamente a /cuenta
onMounted(() => {
    if (sessionStore.session) {
        console.log("Sesión activa")
        router.push('/cuenta')
    }
})
</script>

<template>
    <div class="contenedorInicioSesion">

        <div class="barraLateral"></div>

        <div class="contenidoInicioSesion">

            <div class="contenedorFormularioInicioSesion">

                <div class="cabeceraFormulario">
                    <h2 class="tituloInicioSesion">Iniciar sesión</h2>
                    <p class="subtituloInicioSesion">Bienvenido de vuelta</p>
                </div>

                <!-- Formulario de login -->
                <div v-if="!cargando" class="formularioInicioSesion">
                    <div class="grupoEntrada">
                        <label class="etiquetaEntrada">Correo electrónico</label>
                        <div class="contenedorInput">
                            <img :src="mail" alt="Email" class="iconoInput" />
                            <input required type="email" placeholder="ejemplo@correo.com" v-model="email"
                                class="entradaInicioSesion" />
                        </div>
                    </div>

                    <div class="grupoEntrada">
                        <label class="etiquetaEntrada">Contraseña</label>
                        <div class="contenedorInput">
                            <img :src="candado" alt="Password" class="iconoInput" />
                            <input required type="password" placeholder="Ingresa tu contraseña" v-model="password"
                                class="entradaInicioSesion" />
                        </div>
                    </div>

                    <div class="accionesInicioSesion">
                        <button type="button" class="botonInicioSesion" @click="manejarLogin">
                            <span class="textoBoton">Iniciar Sesión</span>
                        </button>

                        <div class="separadorOr">
                            <span class="lineaSeparador"></span>
                            <span class="textoSeparador">o</span>
                            <span class="lineaSeparador"></span>
                        </div>

                        <div class="enlaceRegistro">
                            <span>¿No tienes cuenta?</span>
                            <button type="button" class="botonRegistro" @click="cambiarARegistro()">
                                Regístrate.
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Spinner mientras se procesa el login -->
                <div v-else class="cargando">
                    <SpinnerCarga />
                    <p>Iniciando sesión...</p>
                </div>

            </div>
        </div>
    </div>

    <!-- Modal para mostrar mensajes y errores -->
    <Modal v-model:mostrar="mostrarModal" tipo="alerta" titulo="Aviso" :mensaje="mensajeModal"
        @cerrar="mostrarModal = false" />
</template>

<style scoped>
.contenedorInicioSesion {
    display: flex;
    height: 100vh;
    width: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: var(--color-fondo);
}

.barraLateral {
    flex: 1;
    background-image: url('../assets/img/login/barraregistro.gif');
    max-width: 33%;
    width: 100%;
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
}

.barraLateral::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--gradiente-terciario);
    opacity: 0.4;
}

.contenidoInicioSesion {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: var(--color-fondo);
}

.contenedorFormularioInicioSesion {
    width: 100%;
    max-width: 400px;
    background-color: var(--color-primario);
    border-radius: 12px;
    padding: 28px;
    border: 2px solid transparent;
    background-clip: padding-box;
    position: relative;
}

.contenedorFormularioInicioSesion::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: var(--gradiente-primario);
    border-radius: 14px;
    z-index: -1;
}

.cabeceraFormulario {
    margin-bottom: 25px;
    text-align: center;
}

.tituloInicioSesion {
    margin: 0;
    color: var(--color-texto);
    font-size: 26px;
    font-weight: 600;
}

.subtituloInicioSesion {
    color: var(--color-texto-secundario);
    margin-top: 6px;
    font-size: 15px;
}

.formularioInicioSesion {
    display: flex;
    flex-direction: column;
}

.grupoEntrada {
    margin-bottom: 18px;
}

.etiquetaEntrada {
    display: block;
    margin-bottom: 6px;
    font-size: 14px;
    color: var(--color-texto-secundario);
    font-weight: 500;
}

.contenedorInput {
    position: relative;
    display: flex;
    align-items: center;
}

.iconoInput {
    position: absolute;
    left: 12px;
    width: 20px;
    height: 20px;
    opacity: 0.7;
}

.entradaInicioSesion {
    width: 100%;
    padding: 12px 12px 12px 40px;
    border: 1px solid var(--color-borde);
    border-radius: 6px;
    font-size: 15px;
    transition: border-color 0.2s ease;
    background-color: var(--color-fondo);
    color: var(--color-texto);
}

.entradaInicioSesion::placeholder {
    color: var(--color-texto-terciario);
}

.entradaInicioSesion:focus {
    outline: none;
    border-color: var(--color-acento-secundario);
}

.accionesInicioSesion {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-top: 8px;
}

.botonInicioSesion {
    width: 100%;
    padding: 12px;
    background: var(--gradiente-primario);
    color: var(--color-texto);
    border: none;
    border-radius: 6px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
}

.botonInicioSesion:hover {
    opacity: 0.9;
}

.separadorOr {
    display: flex;
    align-items: center;
    margin: 8px 0;
}

.lineaSeparador {
    flex: 1;
    height: 1px;
    background-color: var(--color-borde);
}

.textoSeparador {
    padding: 0 15px;
    color: var(--color-texto-secundario);
    font-size: 14px;
}

.enlaceRegistro {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    color: var(--color-texto-secundario);
}

.botonRegistro {
    background: none;
    border: none;
    color: var(--color-acento-secundario);
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    padding: 0;
    font-size: 14px;
    transition: color 0.2s ease;
}

.botonRegistro:hover {
    color: var(--color-acento-primario);
}

.cargando {
    text-align: center;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    color: var(--color-texto-secundario);
}

/* Media queries */
@media (max-width: 768px) {
    .barraLateral {
        display: none;
    }

    .contenidoInicioSesion {
        padding: 16px;
    }

    .contenedorFormularioInicioSesion {
        padding: 20px;
    }

    .tituloInicioSesion {
        font-size: 22px;
    }

    .subtituloInicioSesion {
        font-size: 14px;
    }

    .entradaInicioSesion {
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    .contenedorFormularioInicioSesion {
        padding: 16px;
    }

    .botonInicioSesion {
        padding: 10px;
        font-size: 14px;
    }
}
</style>
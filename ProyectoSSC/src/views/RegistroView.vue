<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue';
import { useSessionStore } from '../stores/session';
import Modal from '@/components/Modal.vue'

import mail from '../assets/img/login/mail.png'
import candado from '../assets/img/login/candado.png'

// Estado para indicar carga (loading)
const cargando = ref(false);
// Campos binded a inputs para email y password
const email = ref('');
const password = ref('');
const router = useRouter();

// Estados para mostrar modal y mensaje
const mostrarModal = ref(false);
const mensajeModal = ref('');

// Store para manejar sesión de usuario
const sessionStore = useSessionStore();

// Función para manejar el registro de usuario
const manejarRegistro = async () => {
    try {
        cargando.value = true;

        // Verificar si el usuario ya existe en tabla 'usuarios' por email
        const { data: usuarioExistente } = await supabase
            .from('usuarios')
            .select('idusuario')
            .eq('email', email.value)
            .single();

        // Si existe, mostrar mensaje y detener registro
        if (usuarioExistente) {
            mensajeModal.value = 'Esta cuenta ya existe, inicia sesión';
            mostrarModal.value = true;
            cargando.value = false;
            return;
        }

        // Registrar usuario en Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
        });

        // Manejo de error específico si usuario ya registrado en Auth
        if (error) {
            if (error.message.includes('User already registered')) {
                mensajeModal.value = 'Esta cuenta ya existe, inicia sesión';
                mostrarModal.value = true;
                return;
            }
            throw error;
        }

        // Obtener idauth del usuario registrado
        const user = data.user;
        const idauth = user?.id;
        if (!idauth) throw new Error('No se pudo obtener el idauth del usuario');

        try {
            // Verificar si usuario ya existe en tabla 'usuarios' por idauth
            const { data: usuario, error: errorUsuario } = await supabase
                .from('usuarios')
                .select('idusuario')
                .eq('idauth', idauth)
                .single();

            if (usuario) {
                mensajeModal.value = 'Esta cuenta ya existe, inicia sesión';
                mostrarModal.value = true;
                return;
            }

            // Crear una nueva entrada en tabla 'coleccion' vacía
            const { data: coleccion, error: errorColeccion } = await supabase
                .from('coleccion')
                .insert({})
                .select('idcoleccion')
                .single();

            if (errorColeccion) throw errorColeccion;

            const idcoleccion = coleccion.idcoleccion;

            // Insertar nuevo usuario en tabla 'usuarios' con idauth e idcoleccion
            const { data: nuevoUsuario, error: errorNuevoUsuario } = await supabase
                .from('usuarios')
                .insert({ idauth, idcoleccion })
                .select('idusuario')
                .single();

            if (errorNuevoUsuario) throw errorNuevoUsuario;

            const idusuario = nuevoUsuario.idusuario;

            // Actualizar la tabla 'coleccion' para relacionar el idusuario creado
            const { error: errorActualizarColeccion } = await supabase
                .from('coleccion')
                .update({ idusuario })
                .eq('idcoleccion', idcoleccion);

            if (errorActualizarColeccion) throw errorActualizarColeccion;

        } catch (dbError) {
            // Manejo de errores de duplicados para evitar registro repetido
            if (dbError.code === '409' || dbError.message.includes('duplicate')) {
                mensajeModal.value = 'Esta cuenta ya existe, inicia sesión';
                mostrarModal.value = true;
                alert("Esta cuenta ya existe, inicia sesión")
                return;
            }
            throw dbError;
        }

        // Mostrar mensaje éxito de registro
        mensajeModal.value = '¡Registrado correctamente! Comprueba tu correo electrónico para verificar la cuenta.';
        mostrarModal.value = true;

    } catch (error) {
        // Mensaje genérico en caso de error durante el registro
        mensajeModal.value = 'Ya existe una cuenta con este correo, por favor, inicia sesión.';
        mostrarModal.value = true;
        console.error('Error durante el registro:', error);
    } finally {
        // Finalizar estado de carga
        cargando.value = false;
    }
}

// Función para cambiar a página de login
const cambiarALogin = () => {
    router.push('/login');
}

// Al montar el componente, si hay sesión activa redirigir a cuenta
onMounted(() => {
    if (sessionStore.session) {
        console.log("Sesión activa");
        router.push('/cuenta');
        return;
    }
})

</script>

<template>
    <div class="contenedorInicioSesion">
        <div class="barraLateral"></div>
        <div class="contenidoInicioSesion">
            <div class="contenedorFormularioInicioSesion">
                <div class="cabeceraFormulario">
                    <h2 class="tituloInicioSesion">Crear cuenta</h2>
                    <p class="subtituloInicioSesion">Introduce tus datos</p>
                </div>

                <!-- Formulario solo visible si no está cargando -->
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
                        <button type="button" class="botonInicioSesion" @click="manejarRegistro()">
                            <span class="textoBoton">Registrarse</span>
                        </button>

                        <div class="separadorOr">
                            <span class="lineaSeparador"></span>
                            <span class="textoSeparador">o</span>
                            <span class="lineaSeparador"></span>
                        </div>

                        <div class="enlaceRegistro">
                            <span>¿No tienes cuenta?</span>
                            <button type="button" class="botonRegistro" @click="cambiarALogin()">
                                Inicia sesión.
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Indicador de carga mientras se registra -->
                <div v-else class="cargando">
                    <div class="spinnerCarga"></div>
                    <p>Iniciando sesión...</p>
                </div>
            </div>
        </div>

        <!-- Modal para mostrar mensajes de alerta -->
        <Modal v-model:mostrar="mostrarModal" tipo="alerta" titulo="Aviso" :mensaje="mensajeModal"
            @cerrar="mostrarModal = false" />
    </div>
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
    background: linear-gradient(135deg, rgba(81, 45, 168, 0.3), rgba(41, 53, 125, 0.4));
}

.contenidoInicioSesion {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    background-color: #1a1c2e;
}

.contenedorFormularioInicioSesion {
    width: 100%;
    max-width: 400px;
    background-color: #1f2136;
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
    color: var(--color-texto-secundario);
}

.entradaInicioSesion:focus {
    outline: none;
    border-color: var(--color-acento-secundario);
}

.olvidoPassword {
    text-align: right;
    margin-top: 6px;
}

.enlaceOlvido {
    color: #00d9ff;
    font-size: 13px;
    text-decoration: none;
    transition: color 0.2s ease;
}

.enlaceOlvido:hover {
    color: #d000ff;
    text-decoration: underline;
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

.textoBoton {
    flex: 1;
    text-align: center;
}

.iconoBoton {
    font-size: 18px;
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
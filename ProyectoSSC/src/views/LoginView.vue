<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useSessionStore } from '../stores/session'
import { useRouter } from 'vue-router'

import { onMounted } from 'vue'

import mail from '../assets/img/login/mail.png'
import candado from '../assets/img/login/candado.png'
import SpinnerCarga from '@/components/SpinnerCarga.vue'


const router = useRouter();

const cargando = ref(false);
const email = ref('');
const password = ref('');

const sessionStore = useSessionStore();

const manejarLogin = async () => {
    try {
        cargando.value = true

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        })

        if (error) throw error;

        if (data?.session) {
            // Después del login, se guarda la sesión en el store
            sessionStore.setSession(data.session)
            alert("Sesión iniciada correctamente.");
            router.push('/cuenta');
        } else {
            alert("Error al recuperar la sesión");
        }
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message)
        }
    } finally {
        cargando.value = false;
    }
}

const cambiarARegistro = () => {
    router.push('/registro');
}

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
                    <h2 class="tituloInicioSesion">Bienvenido</h2>
                    <p class="subtituloInicioSesion">Ingresa a tu cuenta</p>
                </div>

                <div v-if="!cargando" class="formularioInicioSesion">
                    <div class="grupoEntrada">
                        <label class="etiquetaEntrada">Correo electrónico</label>
                        <div class="contenedorInput">
                            <img :src="mail" alt="Email" class="iconoInput"/>
                            <input required type="email" placeholder="ejemplo@correo.com" v-model="email"
                                class="entradaInicioSesion" />
                        </div>
                    </div>

                    <div class="grupoEntrada">
                        <label class="etiquetaEntrada">Contraseña</label>
                        <div class="contenedorInput">
                            <img :src="candado" alt="Password" class="iconoInput"/>
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
                
                <div v-else class="cargando">
                    <SpinnerCarga/>
                    <p>Iniciando sesión...</p>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
.iconoInput {
    position: absolute;
    left: 12px;
    width: 20px;
    height: 20px;
    opacity: 0.7;
}


.contenedorInicioSesion {
    display: flex;
    height: 100vh;
    width: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #1a1c2e;
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
    background: linear-gradient(45deg, #d000ff, #00d9ff);
    border-radius: 14px;
    z-index: -1;
}

.cabeceraFormulario {
    margin-bottom: 25px;
    text-align: center;
}

.tituloInicioSesion {
    margin: 0;
    color: #ffffff;
    font-size: 26px;
    font-weight: 600;
}

.subtituloInicioSesion {
    color: #a4a8e0;
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
    color: #c3c7f7;
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
    color: #8a8ebd;
    font-size: 16px;
}

.entradaInicioSesion {
    width: 100%;
    padding: 12px 12px 12px 40px;
    border: 1px solid #333654;
    border-radius: 6px;
    font-size: 15px;
    transition: border-color 0.2s ease;
    background-color: #1a1c2e;
    color: #ffffff;
}

.entradaInicioSesion::placeholder {
    color: #6a6f9c;
}

.entradaInicioSesion:focus {
    outline: none;
    border-color: #00d9ff;
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
    background: linear-gradient(90deg, #d000ff, #00d9ff);
    color: white;
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
    background-color: #333654;
}

.textoSeparador {
    padding: 0 15px;
    color: #9d9fc3;
    font-size: 14px;
}

.enlaceRegistro {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    font-size: 14px;
    color: #9d9fc3;
}

.botonRegistro {
    background: none;
    border: none;
    color: #00d9ff;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    padding: 0;
    font-size: 14px;
    transition: color 0.2s ease;
}

.botonRegistro:hover {
    color: #d000ff;
}

.cargando {
    text-align: center;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    color: #a4a8e0;
}
</style>
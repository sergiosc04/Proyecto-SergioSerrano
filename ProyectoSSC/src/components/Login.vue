<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'
import { useSessionStore } from '../stores/session'

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
            //despues del login , se guarda la sesión en el store
            sessionStore.setSession(data.session)
            alert("Sesión iniciada correctamente.");
            location.reload();
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


const emit = defineEmits(['cambiarARegistro']);

const cambiarARegistro = () => {
    emit('cambiarARegistro');
}
</script>

<template>
    <div class="contenedorInicioSesion">
        <div class="barraLateral"></div>
        <div class="contenidoInicioSesion">
            <div class="contenedorFormularioInicioSesion">
                <h2 class="tituloInicioSesion">Iniciar Sesión</h2>

                <div v-if="!cargando" class="formularioInicioSesion">
                    <div class="grupoEntrada">
                        <input required type="email" placeholder="Correo electrónico" v-model="email"
                            class="entradaInicioSesion" />
                    </div>
                    <div class="grupoEntrada">
                        <input required type="password" placeholder="Contraseña" v-model="password"
                            class="entradaInicioSesion" />
                    </div>

                    <div class="accionesInicioSesion">
                        <button type="button" class="botonInicioSesion" @click="manejarLogin">
                            Iniciar Sesión
                        </button>

                        <div class="enlaceRegistro">
                            <span>No tienes cuenta?</span>
                            <button type="button" class="botonRegistro" @click="cambiarARegistro">
                                Regístrate
                            </button>
                        </div>
                    </div>
                </div>
                <div v-else class="cargando">
                    <p>Cargando...</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.contenedorInicioSesion {
    display: flex;
    height: 100vh;
    width: 100%;
}

.barraLateral {
    flex: 1;
    background-color: #f0f0f0;
    max-width: 40%;
}

.contenidoInicioSesion {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.contenedorFormularioInicioSesion {
    width: 100%;
    max-width: 400px;
}

.tituloInicioSesion {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

.formularioInicioSesion {
    display: flex;
    flex-direction: column;
}

.grupoEntrada {
    margin-bottom: 15px;
}

.entradaInicioSesion {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
}

.accionesInicioSesion {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.botonInicioSesion {
    width: 100%;
    padding: 12px;
    background-color: #333;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.botonInicioSesion:hover {
    background-color: #555;
}

.enlaceRegistro {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
}

.botonRegistro {
    background: none;
    border: none;
    color: #333;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
}

.cargando {
    text-align: center;
}
</style>
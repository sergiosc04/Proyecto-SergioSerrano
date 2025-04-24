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
    <div class="header">
        <h1>Inicio de sesión</h1>
        <p>Inicia sesión con tu email y contraseña.</p>
    </div>

    <div class="container">
        <div v-if="!cargando" class="form">

            <form @submit.prevent="manejarLogin">
                <div class="inputForm">
                    <input required type="email" placeholder="Email:" v-model="email" />
                    <input required type="password" placeholder="Contraseña:" v-model="password" />
                </div>

                <div class="botonesForm">
                    <button type="submit">Iniciar sesión</button>
                    <button type="button" class="button secondary" @click="cambiarARegistro">
                        ¿No tienes una cuenta? Regístrate.
                    </button>
                </div>

            </form>
        </div>
        <div v-else>
            <p>Cargando...</p>
        </div>
    </div>
</template>

<style></style>
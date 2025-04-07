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

        // Asegúrate de que `data` esté correctamente definido
        if (data?.session) {
            // Al hacer login exitoso, guardamos la sesión en el store
            sessionStore.setSession(data.session)  // Guardamos la sesión
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
    <form @submit.prevent="manejarLogin">
        <div>
            <h1 class="header">Inicio de sesión</h1>
            <p class="description">Inicia sesión con tu email y contraseña.</p>
            <div>
                <input class="inputField" required type="email" placeholder="Email:" v-model="email" />
            </div>
            <div>
                <input class="inputField" required type="password" placeholder="Contraseña:" v-model="password" />
            </div>
            <div>
                <input type="submit" class="button block" :value="cargando ? 'Cargando' : 'Iniciar sesión'"
                    :disabled="cargando" />
            </div>
            <div><br>
                <button type="button" class="button secondary" @click="cambiarARegistro">
                    ¿No tienes una cuenta? Regístrate.
                </button>
            </div>
        </div>
    </form>
</template>
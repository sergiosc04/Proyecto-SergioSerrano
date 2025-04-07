<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const cargando = ref(false);
const email = ref('');

const manejarLogin = async () => {
    try {
        cargando.value = true;
        const { error } = await supabase.auth.signInWithOtp({
            email: email.value,
        })
        if (error) throw error
        alert('Enlace enviado! Revisa tu correo para iniciar sesión.');
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message);
        }
    } finally {
        cargando.value = false;
    }
}
</script>

<template>
    <form @submit.prevent="manejarLogin">
        <div>
            <h1 class="header">Inicio de sesión</h1>
            <p class="description">Escribe tu email para iniciar sesión, o registrarte si aún no tienes una cuenta.
                <br>Si es la primera vez, tienes que confirmar el registro a través del correo
            </p>
            <div>
                <input class="inputField" required type="email" placeholder="Email:" v-model="email" />
            </div>
            <div>
                <input type="submit" class="button block" :value="cargando ? 'Cargando' : 'Enviar enlace'"
                    :disabled="cargando" />
            </div>
        </div>
    </form>
</template>
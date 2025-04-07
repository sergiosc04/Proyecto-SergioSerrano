<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const cargando = ref(false);
const email = ref('');
const password = ref('');

const manejarRegistro = async () => {
    try {
        cargando.value = true;
        const { error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
        });

        if (error) throw error;
        alert('¡Registrado correctamente! Verifica tu correo electrónico para confirmar tu cuenta.');
    } catch (error) {
        if (error instanceof Error) {
            alert(error.message);
        }
    } finally {
        cargando.value = false;
    }
}

const emit = defineEmits(['cambiarALogin']);

const cambiarALogin = () => {
    emit('cambiarALogin');
}
</script>

<template>
    <form @submit.prevent="manejarRegistro">
        <div>
            <h1 class="header">Registro</h1>
            <p class="description">Crea una nueva cuenta.</p>
            <div>
                <input class="inputField" required type="email" placeholder="Email:" v-model="email" />
            </div>
            <div>
                <input class="inputField" required type="password" placeholder="Contraseña:" v-model="password" />
            </div>
            <div>
                <input type="submit" class="button block" :value="cargando ? 'Cargando' : 'Registrarse'"
                    :disabled="cargando" />
            </div><br>
            <div>
                <button type="button" class="button secondary" @click="cambiarALogin">
                    ¿Ya tienes una cuenta? Inicia sesión.
                </button>
            </div>
        </div>
    </form>
</template>
<script setup>
import { onMounted, ref } from 'vue';
import cuenta from '../components/cuenta.vue';
import auth from '../components/auth.vue';
import { supabase } from '../supabase';

// Se declara una variable reactiva para almacenar los datos de la sesión del usuario
const session = ref()

onMounted(() => {
    // Al montar el componente, se obtiene la sesión actual desde Supabase
    supabase.auth.getSession().then(({ data }) => {
        session.value = data.session;
    })

    // Se establece un listener para detectar cambios en la sesión (login, logout)
    supabase.auth.onAuthStateChange((_, _session) => {
        session.value = _session;
    })

})
</script>

<template>
    <div class="container">
        <!-- Si hay una sesión activa, se muestra el componente Account -->
        <cuenta v-if="session" :session="session" />

        <!-- Si no hay sesión, se muestra el componente de autenticación -->
        <auth v-else />
    </div>
</template>

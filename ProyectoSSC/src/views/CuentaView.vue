<script setup>
import { onMounted } from 'vue';
import { useSessionStore } from '../stores/session';  // Importa el store de la sesión
import auth from '../components/auth.vue';  // Importa el componente de login
import { supabase } from '../supabase';  // Importa la instancia de Supabase

const sessionStore = useSessionStore();  // Instancia del store de la sesión

const cerrarSesion = async () => {
    // Llama al método de Supabase para cerrar la sesión
    await supabase.auth.signOut();
    // Limpia los datos de la sesión en el store
    sessionStore.logout();
    alert('Sesión cerrada correctamente');  // Mensaje de confirmación
    // Redirige al usuario a la página de inicio

    router.push('/');  // Cambia la URL según tu configuración de rutas
}

onMounted(async () => {
    // Comprobamos si ya hay una sesión activa al montar el componente
    const { data, error } = await supabase.auth.getSession();
    if (data?.session) {
        sessionStore.setSession(data.session);
        console.log(sessionStore.user); // Si hay sesión, guardamos los datos en el store
    } else if (error) {
        console.error('Error al obtener la sesión:', error.message);  // Manejo de errores
    }
});
</script>

<template>
    <div class="container">
        <!-- Si hay sesión activa, mostramos los detalles de la cuenta -->
        <div v-if="sessionStore.session">
            <!-- Botón para cerrar la sesión -->

            <h1>Bienvenido, {{ sessionStore.user.email }}</h1>
            <p><strong>Correo Electrónico:</strong> {{ sessionStore.user.email }}</p>
            <p><strong>Estado del Correo:</strong> {{ sessionStore.user.email_verified ? 'Verificado' : 'No Verificado'
                }}</p>

            <!-- Muestra la fecha del último acceso del usuario -->
            <!--
                 - `sessionStore.session.user.last_sign_in_at`: Fecha en que el usuario inició sesión por última vez (en formato ISO).
                 - `new Date()`: Convierte la fecha en un objeto Date para manipularla.
                 - `toLocaleString()`: Formatea la fecha a un formato legible según la configuración regional del navegador.
                 - Si `last_sign_in_at` no está disponible (usuario nunca ha iniciado sesión), muestra "Nunca".
            -->

            <p><strong>Último acceso:</strong> {{ sessionStore.session.user.last_sign_in_at ? new
                Date(sessionStore.session.user.last_sign_in_at).toLocaleString() : 'Nunca' }}</p>
            <p><strong>Rol:</strong> {{ sessionStore.session.user.role }}</p>

            <!-- Agregar más detalles de la cuenta -->
            <div v-if="sessionStore.session.user.app_metadata">
                <h3>Metadatos de la cuenta</h3>
                <p><strong>Provedor:</strong> {{ sessionStore.session.user.app_metadata.provider }}</p>
                <p><strong>Confirmado:</strong> {{ sessionStore.session.user.app_metadata.confirmed_at ? 'Sí' : 'No' }}
                </p>
            </div>
            <button @click="cerrarSesion">Cerrar Sesión</button>
            <!-- Puedes mostrar más detalles aquí si es necesario -->
        </div>

        <!-- Si no hay sesión activa, mostramos el formulario de login -->
        <div v-else>
            <auth /> <!-- Aquí se carga el componente de login -->
        </div>
    </div>
</template>

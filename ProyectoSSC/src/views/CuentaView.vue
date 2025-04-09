<script>
import { ref, onMounted, inject } from 'vue';
import { useSessionStore } from '../stores/session';
import auth from '../components/auth.vue';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';
export default {
    components: {
        auth
    },
    setup() {
        const sessionStore = useSessionStore();  // Instancia del store de la sesión
        const router = useRouter();

        let avatar = inject('avatar');
        console.log("Avatar inyectado: " + avatar.value); // Verifica que el avatar esté disponible

        const idAuth = ref(null);
        const error = ref(null);

        const cerrarSesion = async () => {
            // Llama al método de Supabase para cerrar la sesión
            await supabase.auth.signOut();

            // Limpia los datos de la sesión en el store
            sessionStore.logout();
            alert('Sesión cerrada correctamente');
            location.reload();
            // Redirige al usuario a la página de inicio tras recargar la pagina

            router.push('/');
        }

        const getUID = async () => {
            // Llama al método de Supabase para obtener la sesión actual
            const { data, error } = await supabase.auth.getSession();

            if (data?.session) {
                sessionStore.setSession(data.session);
            } else if (error) {
                console.error('Error al obtener la sesión:', error.message);
            }
            console.log("UID de la sesion: " + sessionStore.session.user.id);
            idAuth.value = sessionStore.session.user.id; // Asigna el id de usuario
            console.log("idAuth recogido de getSession: " + idAuth.value); // Verifica que el id esté disponible
        }

        const getAvatar = async () => {
            if (!idAuth.value) {
                console.warn("idAuth no está disponible aún");
                return null;
            }

            let { data: usuario, error } = await supabase
                .from('usuarios')
                .select('avatar_url')
                .eq('idauth', idAuth.value).single();

            if (error) {
                console.error("error al conseguir el avatar: " + error.message);
            }

            const avatarUrl = usuario ? usuario.avatar_url : null;
            return avatarUrl;
        }

        onMounted(async () => {
            await getUID();
            const url = await getAvatar();
            avatar.value = url;
            console.log("Avatar URL:", url.value);
        });

        return {
            avatar,
            error,
            cerrarSesion,
            getUID,
            sessionStore,
        };
    }
};

</script>

<template>
    <div class="container" :key="forzarActualizacion">

        <div v-if="sessionStore.session">
            <h2>Bienvenido, {{ sessionStore.user.email }} <button @click="cerrarSesion">Cerrar Sesión</button></h2>

            <div v-if="avatar">
                <strong>Avatar:</strong><br>
                <img :src="avatar" alt="Avatar" style="height:100px" />
                <p><strong>Enlace avatar:</strong> {{ avatar }}</p>
            </div>
            <p><strong>UID del usuario:</strong> {{ sessionStore.session.user.id }}</p>
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
            <p><strong>Último acceso:</strong> {{ sessionStore.session.user.last_sign_in_at ?
                new Date(sessionStore.session.user.last_sign_in_at).toLocaleString() : 'Nunca' }}</p>

            <p><strong>Rol:</strong> {{ sessionStore.session.user.role }}</p>


            <!-- Puedes mostrar más detalles aquí si es necesario -->
        </div>

        <!-- Si no hay sesión activa,se muestra el formulario de login -->
        <div v-else>
            <auth />
        </div>
    </div>
</template>

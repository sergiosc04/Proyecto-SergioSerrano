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

        if (avatar.value = null) console.log("Avatar inyectado: " + avatar.value);

        // Verifica que el avatar esté disponible

        const idAuth = ref(null);
        const error = ref(null);

        //Función para cerrar sesión --------

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

        //Función para obtener el UID -----------

        const getUID = async () => {
            // Llama al método de Supabase para obtener la sesión actual
            const { data, error } = await supabase.auth.getSession();

            if (data?.session) {
                sessionStore.setSession(data.session);
            } else if (error) {
                console.error('Error al obtener la sesión:', error.message);
            }

            //Comprobamos si la sesión existe y si el usuario está autenticado
            if (sessionStore.session && sessionStore.session.user) {
                console.log("UID de la sesion: " + sessionStore.session.user.id);
                idAuth.value = sessionStore.session.user.id; // Asigna el id de usuario

                console.log("idAuth recogido de getSession: " + idAuth.value);
            } else {
                console.warn("La sesión del usuario no está disponible, prueba a iniciar sesion");
            }
        }

        //funcion para obtener el avatar del usuario -----------

        const getAvatar = async () => {

            //si idauth no existe muestra error
            if (!idAuth.value) {
                console.warn("idAuth no está disponible aún, prueba a iniciar sesion");
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

        //Funcion para subir el avatar al bucket avatars de supabase ----------

        const subirAvatar = async (evento) => {
            //1. Obtener el archivo seleccionado por el usuario
            const archivo = evento.target.files[0];

            //2. Verificar si no se ha seleccionado un archivo
            if (!archivo) {
                error.value = "No se ha seleccionado ningún archivo."; // Mostrar mensaje de error
                return; // Detener la ejecución si no hay archivo
            }

            //3. Generar un nombre único para el archivo basado en el ID del usuario y el nombre original del archivo
            const nombreArchivo = `${idAuth.value}_${archivo.name}`;

            //-. definir la ruta donde se almacenara el archivo en el bucket  
            const rutaArchivo = `avatars/${nombreArchivo}`;

            // 4. Subir el archivo al bucket "avatars" en Supabase
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(rutaArchivo, archivo, {
                    cacheControl: '3600', // Control de caché (1 hora)
                    upsert: true //sobrescribe el archivo si ya existe
                });

            //5. Control de errores
            if (uploadError) {
                console.error("Error al subir avatar:", uploadError.message);
                error.value = uploadError.message;
                return; // Detener la ejecución en caso de error
            }

            // 6. Obtener la URL pública del archivo subido
            const { data } = supabase.storage
                .from('avatars')
                .getPublicUrl(rutaArchivo);

            const avatarUrl = data.publicUrl; //obtiene la URL pública del archivo

            //7. Asignar la URL pública del avatar al valor de la variable `avatar`
            avatar.value = avatarUrl;

            //8. Actualizar la base de datos con la URL del avatar
            const { error: dbError } = await supabase
                .from('usuarios')
                .update({ avatar_url: avatarUrl }) // Actualizar el campo `avatar_url` con la nueva URL
                .eq('idauth', idAuth.value); // Asegurarse de que solo se actualice el avatar del usuario correcto

            //9. Control de errores
            if (dbError) {
                console.error("Error al actualizar avatar_url:", dbError.message);
                error.value = dbError.message;
                return;
            }

            //Muestra un mensaje si todo fue bien
            alert("¡Avatar subido y guardado correctamente!");
        };


        onMounted(async () => {
            await getUID();
            const url = await getAvatar();
            avatar.value = url;
        });

        return {
            avatar,
            error,
            cerrarSesion,
            getUID,
            sessionStore,
            subirAvatar,
        };
    }
};

</script>

<template>
    <div class="container">

        <div v-if="sessionStore.session">
            <h2>Bienvenido, {{ sessionStore.user.email }} <button @click="cerrarSesion">Cerrar Sesión</button></h2>

            <div v-if="avatar">
                <strong>Avatar:</strong><br>
                <img :src="avatar" alt="Avatar" style="height:100px" />
            </div>

            <p><strong>Enlace avatar:</strong> {{ avatar }}</p>

            <label for="cambioAvatar"><strong>Actualizar avatar:</strong></label><br>
            <input class="cambioAvatar" type="file" accept="image/*" @change="subirAvatar">

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


            <p><strong>Acceso BBDD:</strong> {{ sessionStore.session.user.role }}</p>


            <!-- Puedes mostrar más detalles aquí si es necesario -->
        </div>

        <!-- Si no hay sesión activa,se muestra el formulario de login -->
        <div v-else>
            <auth />
        </div>
    </div>
</template>

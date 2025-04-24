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

        let username = ref("");
        let usernameEditado = ref("");

        let avatar = inject('avatar');

        if (avatar.value === null) console.log("Avatar inyectado: " + avatar.value);

        // Verifica que el avatar esté disponible
        const idAuth = ref(null);
        const error = ref(null);

        //Función para cerrar sesión --------

        const cerrarSesion = async () => {
            let confirmacion = "";
            if (confirmacion !== confirm("¿Estás seguro de que quieres cerrar sesión?")) {
                // Llama al método de Supabase para cerrar la sesión
                await supabase.auth.signOut();

                // Limpia los datos de la sesión en el store
                sessionStore.logout();
                alert('Sesión cerrada correctamente');
                location.reload();

                // Redirige al usuario a la página de inicio tras recargar la pagina
                router.push('/');
            }
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

        //Funcion para obtener el nombre de usuario----------
        const getNombre = async () => {
            let { data: usuario, error } = await supabase
                .from('usuarios')
                .select('username')
                .eq('idauth', idAuth.value).single();

            if (error) {
                console.error("error al conseguir el nombre: " + error.message);
            }

            username.value = usuario.username; //Variable que contiene el nombre de usuario
            usernameEditado.value = usuario.username; // Asigna el nombre de usuario a la variable de edición
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

        //funcion para obtener el avatar del usuario -----------

        const actualizarUsername = async () => {
            let { data: usuario, error } = await supabase
                .from('usuarios')
                .update({
                    username: usernameEditado.value
                })
                .eq('idauth', idAuth.value).single();

            alert("¡Nombre de usuario actualizado correctamente a " + usernameEditado.value + "!");

            username.value = usernameEditado.value; // Actualiza el nombre de usuario en la variable
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
            await getNombre();
            const url = await getAvatar();
            avatar.value = url;
            console.log(usernameEditado.value)
        });

        return {
            avatar,
            error,
            cerrarSesion,
            getUID,
            sessionStore,
            subirAvatar,
            username,
            usernameEditado,
            actualizarUsername,
            getNombre,
        };
    }
};
</script>

<template>
    <h1 v-if="username" align="center">Bienvenido, {{ username }} </h1>
    <div class="container">

        <div v-if="sessionStore.session">
            <form class="formulario">

                <!-- Avatar -->
                <div class="container-foto">
                    <div class="grupo-foto">

                        <div class="grupo-formulario" v-if="avatar">
                            <img :src="avatar" alt="Avatar" style="height:100px;" />
                        </div>
                        <div>
                            <label for="cambioAvatar">Actualizar Avatar:</label><br>
                            <input id="cambioAvatar" type="file" accept="image/*" @change="subirAvatar" />
                        </div>
                    </div>
                </div>

                <!-- Nombre de usuario -->
                <div class="grupo-formulario">
                    <label for="username">Nombre de Usuario:</label><br>
                    <input id="username" type="text" v-model="usernameEditado" />
                    <button type="button" @click="actualizarUsername()">Guardar cambios</button>
                </div><br>


                <!-- Email -->
                <div class="grupo-formulario">
                    <label for="email">Correo Electrónico:</label><br>
                    <input id="email" type="email" v-model="sessionStore.user.email" disabled />
                </div>


                <!-- Email verificado -->
                <div class="grupo-formulariop">
                    <label for="emailVerified">Estado del Correo:</label><br>
                    <input id="emailVerified" type="text"
                        :value="sessionStore.user.email_verified ? 'Verificado' : 'No Verificado'" disabled />
                </div>


                <!-- UID -->
                <div class="grupo-formulario">
                    <label for="uid">UID del Usuario:</label><br>
                    <input id="uid" type="text" v-model="sessionStore.session.user.id" disabled />
                </div>


                <!-- Último acceso -->
                <div class="grupo-formulario">
                    <label for="lastSignIn">Último Acceso:</label><br>
                    <input id="lastSignIn" type="text" :value="sessionStore.session.user.last_sign_in_at
                        ? new Date(sessionStore.session.user.last_sign_in_at).toLocaleString()
                        : 'Nunca'" disabled />
                </div>


                <!-- Rol en BBDD -->
                <div class="grupo-formulario">
                    <label for="role">Acceso BBDD:</label><br>
                    <input id="role" type="text" v-model="sessionStore.session.user.role" disabled />
                </div>


                <!-- Avatar -->
                <div class="grupo-formulario">
                    <label for="avatarUrl">Enlace Avatar:</label><br>
                    <input id="avatarUrl" type="text" v-model="avatar" disabled />
                </div>


                <!-- Cerrar sesión -->
                <div class="grupo-formulario">
                    <button type="button" @click="cerrarSesion()">
                        Cerrar Sesión
                    </button>
                </div>
            </form>
        </div>

        <div v-else>
            <auth />
        </div>
    </div>
</template>

<style>
button {
    cursor: pointer;
}

input {
    margin-bottom: 10px;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #ccc;
    width: 100%;
}

.grupo-foto {
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
    gap: 5px
}

.container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.botonesForm {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    gap: 10px;
}

.botonesForm :hover {
    cursor: pointer;
}

.header {
    text-align: center;
}
</style>
<script setup>
import { ref, onMounted } from 'vue';
import { useSessionStore } from '../stores/session';
import auth from '../components/auth.vue';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';

const sessionStore = useSessionStore();
const router = useRouter();
const username = ref("");
const usernameEditado = ref("");
const idAuth = ref(null);
const error = ref(null);

// Función para cerrar sesión
const cerrarSesion = async () => {
    if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
        try {
            await supabase.auth.signOut();
            sessionStore.logout();
            alert('Sesión cerrada correctamente');
            router.push('/');
            location.reload();
        } catch (error) {
            console.error("Error al cerrar sesión:", error);
        }
    }
}

// Función para obtener el UID
const getUID = async () => {
    const sesionRecuperada = await sessionStore.recuperarSesion();

    if (sesionRecuperada && sessionStore.session?.user) {
        console.log("UID de la sesion: " + sessionStore.session.user.id);
        idAuth.value = sessionStore.session.user.id;
        console.log("idAuth recogido de getSession: " + idAuth.value);
    } else {
        console.warn("La sesión del usuario no está disponible, prueba a iniciar sesion");
    }
}

// Función para obtener el nombre de usuario
const getNombre = async () => {
    let { data: usuario, error: nombreError } = await supabase
        .from('usuarios')
        .select('username')
        .eq('idauth', idAuth.value)
        .single();

    if (nombreError) {
        console.error("error al conseguir el nombre: " + nombreError.message);
        return;
    }

    username.value = usuario.username;
    usernameEditado.value = usuario.username;
}

// Función para subir avatar
const subirAvatar = async (evento) => {
    const archivo = evento.target.files[0];

    if (!archivo) {
        error.value = "No se ha seleccionado ningún archivo.";
        return;
    }

    const nombreArchivo = `${idAuth.value}_${archivo.name}`;
    const rutaArchivo = nombreArchivo;

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(rutaArchivo, archivo, {
            upsert: true
        });

    if (uploadError) {
        console.error("Error al subir avatar:", uploadError.message);
        error.value = uploadError.message;
        return;
    }

    const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(rutaArchivo);

    const avatarUrl = data.publicUrl;
    sessionStore.avatarUrl = avatarUrl;

    const { error: dbError } = await supabase
        .from('usuarios')
        .update({ avatar_url: avatarUrl })
        .eq('idauth', idAuth.value);

    if (dbError) {
        console.error("Error al actualizar avatar_url:", dbError.message);
        error.value = dbError.message;
        return;
    }

    alert("Avatar subido y guardado correctamente");
}

// Función para actualizar username
const actualizarUsername = async () => {
    if (!idAuth.value) {
        error.value = "No hay usuario autenticado";
        return;
    }

    const { error: dbError } = await supabase
        .from('usuarios')
        .update({ username: usernameEditado.value })
        .eq('idauth', idAuth.value);

    if (dbError) {
        console.error("Error al actualizar el nombre de usuario:", dbError.message);
        error.value = dbError.message;
        return;
    }

    username.value = usernameEditado.value;
    alert("Nombre de usuario actualizado correctamente");
}

// Mounted hook
onMounted(async () => {
    await getUID();
    if (idAuth.value) {
        await getNombre();
    }
});
</script>

<template>
    <h1 v-if="username" align="center">Perfil de {{ username }} </h1>
    <div class="container">

        <div v-if="sessionStore.session">
            <form class="formulario">

                <!-- Avatar -->
                <div class="container-foto">
                    <div class="grupo-foto">

                        <div class="grupo-formulario" v-if="sessionStore.avatarUrl">
                            <img :src="sessionStore.avatarUrl" alt="Avatar" style="height:100px;" />
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
                    <label for="role">Nivel acceso BBDD:</label><br>
                    <input id="role" type="text" v-model="sessionStore.session.user.role" disabled />
                </div>


                <!-- Avatar -->
                <div class="grupo-formulario">
                    <label for="avatarUrl">Enlace Avatar:</label><br>
                    <input id="avatarUrl" type="text" v-model="sessionStore.avatarUrl" disabled />
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
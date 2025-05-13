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

const biografia = ref("");
const biografiaEditada = ref("");

const idioma = ref("");
const idiomaEditado = ref("");

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
const getDatos = async () => {
    let { data: usuario, error: datosError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('idauth', idAuth.value)
        .single();

    if (datosError) {
        console.error("error al conseguir el nombre: " + datosError.message);
        return;
    }

    //Corregir, mostrar en el template
    console.log("Usuario encontrado: ");
    console.log(usuario);

    console.log("biografia: " + usuario.biografia);

    username.value = usuario.username;
    usernameEditado.value = usuario.username;

    biografia.value = usuario.biografia;
    biografiaEditada.value = usuario.biografia;

    idioma.value = usuario.idioma;
    idiomaEditado.value = usuario.idioma;
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
    location.reload();
}

// Función para actualizar username
const actualizarDatos = async () => {
    if (!idAuth.value) {
        error.value = "No hay usuario autenticado";
        return;
    }

    const { error: dbError } = await supabase
        .from('usuarios')
        .update({ username: usernameEditado.value, biografia: biografiaEditada.value, idioma: idiomaEditado.value })
        .eq('idauth', idAuth.value);

    if (dbError) {
        console.error("Error al guardar los cambios:", dbError.message);
        error.value = dbError.message;
        return;
    }
    username.value = usernameEditado.value;
    alert("Se han guardado los cambios correctamente");
}

onMounted(async () => {

    if (!sessionStore.session) {
        console.log("No hay sesión activa");
        router.push('/login');
        return;
    }

    await getUID();
    if (idAuth.value) {
        await getDatos();
    }
});
</script>

<template>
    <div class="perfilUsuario">
        <h1 v-if="username" class="tituloPerfilCentrado">Perfil de {{ username }}</h1>

        <div class="contenedorPrincipal">
            <div v-if="sessionStore.session" class="tarjetaPerfil">
                <form class="formularioPerfil">
                    <!-- Sección de Avatar -->
                    <div class="seccionAvatar">
                        <div class="contenedorAvatar">
                            <div class="imagenAvatar" v-if="sessionStore.avatarUrl">
                                <img :src="sessionStore.avatarUrl" alt="Avatar" class="avatar" />
                            </div>
                            <div class="selectorAvatar">
                                <label for="cambioAvatar" class="etiquetaArchivo">Actualizar Avatar</label>
                                <input id="cambioAvatar" type="file" accept="image/*" @change="subirAvatar"
                                    class="entradaArchivo" />
                            </div>
                        </div>
                    </div>

                    <!-- Datos Personales -->
                    <div class="seccionDatos">
                        <h2 class="subtituloPerfil">Datos de la cuenta</h2>

                        <div class="grupoFormulario">
                            <label for="username" class="etiquetaCampo">Nombre de Usuario:</label>
                            <input id="username" type="text" v-model="usernameEditado" class="campoDatos" />
                        </div>

                        <div class="grupoFormulario">
                            <label for="biografia" class="etiquetaCampo">Biografía:</label>
                            <textarea id="biografia" v-model="biografiaEditada" class="campoTextarea"
                                rows="3"></textarea>
                        </div>

                        <div class="grupoFormulario">
                            <label for="idiomas" class="etiquetaCampo">Idiomas:</label>
                            <input id="idiomas" type="text" v-model="idiomaEditado" class="campoDatos" />
                        </div>

                        <button type="button" @click="actualizarDatos()" class="botonPrimario">Guardar cambios</button>
                    </div>

                    <!-- Email y Datos de Cuenta -->
                    <div class="seccionMetadatos">
                        <h2 class="subtituloPerfil">Metadatos de la cuenta</h2>

                        <div class="grupoFormulario">
                            <label for="email" class="etiquetaCampo">Correo Electrónico:</label>
                            <input id="email" type="email" v-model="sessionStore.user.email" disabled
                                class="campoDesactivado" />
                        </div>

                        <div class="grupoFormulario">
                            <label for="uid" class="etiquetaCampo">UID del Usuario:</label>
                            <input id="uid" type="text" v-model="sessionStore.session.user.id" disabled
                                class="campoDesactivado" />
                        </div>

                        <div class="grupoFormulario">
                            <label for="lastSignIn" class="etiquetaCampo">Último Acceso:</label>
                            <input id="lastSignIn" type="text" :value="sessionStore.session.user.last_sign_in_at
                                ? new Date(sessionStore.session.user.last_sign_in_at).toLocaleString()
                                : 'Nunca'" disabled class="campoDesactivado" />
                        </div>

                        <div class="grupoFormulario">
                            <label for="role" class="etiquetaCampo">Nivel acceso BBDD:</label>
                            <input id="role" type="text" v-model="sessionStore.session.user.role" disabled
                                class="campoDesactivado" />
                        </div>

                        <div class="grupoFormulario">
                            <label for="avatarUrl" class="etiquetaCampo">Enlace Avatar:</label>
                            <input id="avatarUrl" type="text" v-model="sessionStore.avatarUrl" disabled
                                class="campoDesactivado" />
                        </div>

                        <div class="grupoFormulario">
                            <button type="button" @click="cerrarSesion()" class="botonCerrarSesion">Cerrar
                                Sesión</button>
                        </div>
                    </div>
                </form>
            </div>

        </div>
    </div>

</template>


<style scoped>
.perfilUsuario {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
}

.tituloPerfilCentrado {
    text-align: center;
    color: #2c3e50;
    margin-bottom: 30px;
    font-size: 2rem;
}

.contenedorPrincipal {
    display: flex;
    justify-content: center;
}

.tarjetaPerfil {
    background-color: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    width: 100%;
    overflow: hidden;
}

.formularioPerfil {
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.seccionAvatar {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.contenedorAvatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.imagenAvatar {
    border-radius: 50%;
    overflow: hidden;
    width: 150px;
    height: 150px;
    border: 3px solid #e0e0e0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.selectorAvatar {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.etiquetaArchivo {
    background-color: #3498db;
    color: white;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 0.9rem;
}

.etiquetaArchivo:hover {
    background-color: #2980b9;
}

.entradaArchivo {
    margin-top: 10px;
}

.seccionDatos,
.seccionMetadatos {
    background-color: #f9f9f9;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.subtituloPerfil {
    font-size: 1.3rem;
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #3498db;
}

.grupoFormulario {
    margin-bottom: 16px;
}

.etiquetaCampo {
    display: block;
    font-weight: 600;
    margin-bottom: 6px;
    color: #555;
    font-size: 0.95rem;
}

.campoDatos,
.campoDesactivado,
.campoTextarea {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    margin-bottom: 5px;
    background-color: #fff;
}

.campoTextarea {
    resize: vertical;
    min-height: 80px;
}

.campoDesactivado {
    background-color: #f5f5f5;
    color: #888;
    cursor: not-allowed;
}

.botonPrimario {
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 12px 24px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 10px;
    font-weight: bold;
    width: 200px;
    align-self: center;
}

.botonPrimario:hover {
    background-color: #388E3C;
}

.botonCerrarSesion {
    background-color: #e74c3c;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 12px 24px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s;
    margin-top: 10px;
    width: 100%;
}

.botonCerrarSesion:hover {
    background-color: #c0392b;
}

/* Responsive */
@media (max-width: 768px) {
    .formularioPerfil {
        padding: 20px;
    }

    .seccionDatos,
    .seccionMetadatos {
        padding: 15px;
    }

    .botonPrimario {
        width: 100%;
    }
}
</style>
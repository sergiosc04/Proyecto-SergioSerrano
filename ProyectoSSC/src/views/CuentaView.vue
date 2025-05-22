<script setup>
import { ref, onMounted } from 'vue';
import { useSessionStore } from '../stores/session';
import { supabase } from '../supabase';
import { useRouter } from 'vue-router';
import Modal from '@/components/Modal.vue';

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

const claveRecargar = ref("0");

const recargarComponente = () => {
    componentKey.value += 1
}

// Referencias para los modals
const mostrarModalCerrarSesion = ref(false);
const mostrarModalExito = ref(false);
const mostrarModalAvatar = ref(false);
const mensajeModal = ref('');
const mensajeExito = ref('');

// Función para cerrar sesión
const cerrarSesion = async () => {
    try {
        await supabase.auth.signOut();
        sessionStore.logout();
        router.push('/');
    } catch (error) {
        console.error("Error al cerrar sesión:", error);
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
        mensajeModal.value = "No se ha seleccionado ningún archivo.";
        mostrarModalAvatar.value = true;
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
        mensajeModal.value = "Error: No se pueden subir imágenes repetidas.";
        mostrarModalAvatar.value = true;
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
        mensajeModal.value = "Error al guardar el avatar: error en la base de datos";
        mostrarModalAvatar.value = true;
        return;
    } else {

        mensajeModal.value = "Avatar subido y guardado correctamente";
        mostrarModalAvatar.value = true;
    }
}

// Modificar la función actualizarDatos
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
    mensajeExito.value = "Se han guardado los cambios correctamente";
    mostrarModalExito.value = true;
    recargarComponente();


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
    <div class="contenedorPrincipal">
        <!-- Cabecera del perfil similar a la cabecera del juego -->
        <header class="cabeceraJuego">
            <h1 class="tituloJuego" v-if="username">Perfil de {{ username }}</h1>
            <h1 class="tituloJuego" v-else>Perfil de Usuario</h1>
            <p class="subtituloJuego">Gestiona tu cuenta y personaliza tu perfil</p>
        </header>

        <div class="contenidoFlex" v-if="sessionStore.session">
            <!-- Panel izquierdo para avatar -->
            <aside class="panelIzquierdo">
                <div class="tarjetaInfo">

                    <h2 class="tituloSeccion">Avatar</h2>
                    <div class="seccionAvatar">
                        <div class="contenedorAvatar">
                            <div class="imagenAvatar" v-if="sessionStore.avatarUrl">
                                <img :src="sessionStore.avatarUrl" alt="Avatar" class="avatar" />
                            </div>

                            <div class="imagenAvatar" v-else>
                                <div class="placeholderAvatar">
                                    <span>Sin avatar</span>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div class="selectorAvatar">
                        <label for="cambioAvatar" class="botonPrimario">Actualizar Avatar</label>
                        <input id="cambioAvatar" type="file" accept="image/*" @change="subirAvatar"
                            class="entradaArchivo" />
                    </div>
                </div>

                <!-- Datos de la cuenta y estadísticas -->
                <!-- Metadatos técnicos -->
                <section class="seccionInfo">
                    <h2 class="tituloSeccion">Metadatos de la cuenta</h2>

                    <div class="gridInfoTecnica">
                        <div class="itemInfoTecnica">
                            <span class="etiquetaInfoTecnica">UID del Usuario</span>
                            <span class="valorInfoTecnica">{{ sessionStore.session?.user?.id || 'No disponible'
                            }}</span>
                        </div>

                        <div class="itemInfoTecnica">
                            <span class="etiquetaInfoTecnica">Nivel acceso BBDD</span>
                            <span class="valorInfoTecnica">{{ sessionStore.session?.user?.role || 'No disponible'
                            }}</span>
                        </div>

                        <div class="itemInfoTecnica">
                            <span class="etiquetaInfoTecnica">Enlace Avatar</span>
                            <span class="valorInfoTecnica">{{ sessionStore.avatarUrl || 'No disponible' }}</span>
                        </div>
                    </div>
                </section>


                <!-- Botón de cerrar sesión -->
                <div class="tarjetaInfo">
                    <button type="button" @click="mostrarModalCerrarSesion = true" class="botonRojo">Cerrar
                        Sesión</button>
                </div>
            </aside>

            <!-- Panel derecho para formulario y datos -->
            <main class="panelDerecho">
                <!-- Datos personales -->
                <section class="seccionInfo">
                    <h2 class="tituloSeccion">Datos personales</h2>

                    <form @submit.prevent="actualizarDatos" class="formularioDatos">
                        <div class="grupoFormulario">
                            <label for="username" class="etiquetaCampo">Nombre de Usuario:</label>
                            <input id="username" type="text" v-model="usernameEditado" class="campoDatos" required />
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

                        <button type="submit" class="botonPrimario">Guardar cambios</button>
                    </form>
                </section>


                <section class="tarjetaInfo">
                    <h2 class="tituloSeccion">Datos de cuenta</h2>

                    <ul class="listaEstadisticas">
                        <li class="itemEstadistica">
                            <span class="etiquetaEstadistica">Email</span>
                            <span class="valorEstadistica">{{ sessionStore.user?.email }}</span>

                        </li>
                        <li class="itemEstadistica">
                            <span class="etiquetaEstadistica">Fecha de registro</span>
                            <span class="valorEstadistica">{{ sessionStore.session?.user?.created_at ? new
                                Date(sessionStore.session.user.created_at).toLocaleString() : 'No disponible' }}</span>
                        </li>

                        <li class="itemEstadistica">
                            <span class="etiquetaEstadistica">Último acceso</span>
                            <span class="valorEstadistica">{{ sessionStore.session?.user?.last_sign_in_at ? new
                                Date(sessionStore.session.user.last_sign_in_at).toLocaleDateString() : 'Nunca' }}</span>
                        </li>
                    </ul>
                </section>
            </main>
        </div>

        <!-- Mensaje de error si no hay sesión -->
        <div v-else class="contenedorError">
            <div class="mensajeError">
                <h2>No has iniciado sesión</h2>
                <p>Por favor, inicia sesión para ver tu perfil</p>
            </div>
        </div>

        <!-- Modal de Cerrar Sesión -->
        <Modal v-model:mostrar="mostrarModalCerrarSesion" tipo="confirmar" titulo="Cerrar Sesión"
            mensaje="¿Estás seguro de que quieres cerrar sesión?" @confirmar="cerrarSesion()"
            @cancelar="mostrarModalCerrarSesion = false" />

        <!-- Modal de Éxito -->
        <Modal v-model:mostrar="mostrarModalExito" tipo="alerta" titulo="Éxito" :mensaje="mensajeExito"
            @cerrar="mostrarModalExito = false;" />

        <!-- Modal de Mensaje (para subir avatar) -->
        <Modal v-model:mostrar="mostrarModalAvatar" tipo="alerta" titulo="Avatar" :mensaje="mensajeModal"
            @cerrar="mostrarModalAvatar = false; if (mensajeModal.includes('correctamente'));" />
    </div>
</template>

<style scoped>
html,
body {
    margin: 0;
    padding: 0;
    background-color: #1a1c2e;
    min-height: 100vh;
    width: 100%;
}

/* Estilos principales */
.contenedorPrincipal {
    min-height: 100vh;
    width: 100%;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #1a1c2e;
    padding: 2rem;
}

.cabeceraJuego {
    text-align: center;
    margin: 0 auto 2rem auto;
    max-width: 1400px;
    background: linear-gradient(90deg, #1f2136, #252744, #1f2136);
    padding: 1.5rem;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    border: 1px solid #333654;
}

.cabeceraJuego::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff6b6b, #7b68ee);
}

.tituloJuego {
    color: #ffffff;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    text-shadow: 0 0 15px rgba(208, 0, 255, 0.3);
}

.subtituloJuego {
    color: #a4a8e0;
    margin-top: 0.5rem;
    font-size: 1rem;
}

.contenidoFlex {
    display: flex;
    gap: 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

/* Panel izquierdo (avatar y datos rápidos) */
.panelIzquierdo {
    flex: 1;
    max-width: 440px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.tarjetaInfo {
    background-color: #1f2136;
    border-radius: 12px;
    padding: 1.25rem;
    border: 1px solid #333654;
}

.seccionAvatar {
    display: flex;
    justify-content: center;
    margin: 1rem 0;
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
    border: 3px solid #333654;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
}

.placeholderAvatar {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #252744, #1f2136);
    color: #a4a8e0;
}

.avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.selectorAvatar {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
}

.entradaArchivo {
    display: none;
}

.botonControl {
    background: linear-gradient(90deg, #d000ff, #00d9ff);
    color: white;
    border: none;
    border-radius: 6px;
    padding: 8px 16px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
    font-size: 0.9rem;
    text-align: center;
    display: inline-block;
}

.botonControl:hover {
    opacity: 0.9;
    transform: scale(1.05);
}

.listaEstadisticas {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;
    padding: 0;
    list-style: none;
    margin: 0.5rem 0 0;
}

.itemEstadistica {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background: #1a1c2e;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid #333654;
}

.valorEstadistica {
    font-size: 1rem;
    font-weight: bold;
    color: #ffffff;
    text-align: left;
    word-break: break-word;
}

.etiquetaEstadistica {
    color: #a4a8e0;
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
    text-align: left;
    width: 100%;
    /* Añadido para asegurar que ocupa todo el ancho */
}

/* Panel derecho (información detallada) */
.panelDerecho {
    background-color: 1a1c2e;
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.seccionInfo {
    background-color: #1f2136;
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid #333654;
}

.tituloSeccion {
    color: #ffffff;
    font-size: 1.25rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #333654;
    position: relative;
}

.tituloSeccion::before {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 50px;
    height: 2px;
    background: linear-gradient(to right, #d000ff, #00d9ff);
}

.grupoFormulario {
    margin-bottom: 1rem;
}

.etiquetaCampo {
    display: block;
    font-weight: 500;
    margin-bottom: 8px;
    color: #a4a8e0;
    font-size: 0.95rem;
}

.campoDatos,
.campoTextarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #333654;
    border-radius: 6px;
    font-size: 1rem;
    background-color: #1a1c2e;
    color: #ffffff;
    margin-bottom: 5px;
    transition: border-color 0.3s, box-shadow 0.3s;
}

.campoDatos:focus,
.campoTextarea:focus {
    outline: none;
    border-color: #00d9ff;
    box-shadow: 0 0 5px rgba(0, 217, 255, 0.3);
}

.campoTextarea {
    resize: vertical;
    min-height: 100px;
}

.gridInfoTecnica {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
}

.itemInfoTecnica {
    display: flex;
    flex-direction: column;
    background: #1a1c2e;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid #333654;
}

.etiquetaInfoTecnica {
    color: #a4a8e0;
    font-size: 0.8rem;
    margin-bottom: 0.25rem;
}

.valorInfoTecnica {
    color: #ffffff;
    word-break: break-word;
}

/* Pantallas de carga y error */
.contenedorError {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
}

/* Modales */
.fondoModal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.contenedorModal {
    background: #1f2136;
    border-radius: 12px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
}

.tituloModal {
    color: #ffffff;
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
    position: relative;
}

.tituloModal::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: -4px;
    left: 0;
}

.contenidoModal {
    color: #a4a8e0;
    font-size: 1rem;
    margin-bottom: 1.5rem;
}

.botonesModal {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
}

.botonConfirmar {
    background: linear-gradient(90deg, #d000ff, #00d9ff);
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 20px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
    font-size: 1rem;
}

.botonConfirmar:hover {
    opacity: 0.9;
    transform: scale(1.05);
}

.botonCancelar {
    background: transparent;
    color: #a4a8e0;
    border: 1px solid #333654;
    border-radius: 6px;
    padding: 10px 20px;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s;
    font-size: 1rem;
}

.botonCancelar:hover {
    opacity: 0.9;
    transform: scale(1.05);
}

/* Responsive */
@media (max-width: 1100px) {
    .contenidoFlex {
        flex-direction: column;
    }

    .panelIzquierdo {
        max-width: 100%;
    }
}

@media (max-width: 600px) {
    .contenedorPrincipal {
        padding: 1rem;
    }

    .tituloJuego {
        font-size: 1.75rem;
    }

    .gridInfoTecnica {
        grid-template-columns: 1fr;
    }
}
</style>
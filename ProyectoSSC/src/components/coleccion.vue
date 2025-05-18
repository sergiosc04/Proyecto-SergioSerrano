<script setup>
import { ref, onMounted } from 'vue';
import tarjetaJuego from '../components/tarjetaJuego.vue';
import { supabase } from '../supabase'
import SpinnerCarga from './SpinnerCarga.vue';
import { useRouter } from 'vue-router';

//variables recibidas desde el coleccionView
const props = defineProps({
    nombre: {
        type: String,
        required: true
    },
    juegos: {
        type: Array,
        default: () => []
    },
    idcoleccion: {
        type: Number,
        default: null
    },
    idRecibido: {
        type: Number,
        default: null
    }
});

let juegos = ref([]);
let juegoUnico = ref(null);
let cargando = ref(true);
let coleccion = ref("");
let mostrarOpciones = ref(false);
let longColeccion = ref();

const router = useRouter();

//importamos la clave del .env
const claveAPI = import.meta.env.VITE_RAWG_API_KEY;

// Metodo para obtener información de in juego, para usar cuando haya idRecibido
const getJuegoUnico = async (id) => {
    try {
        const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${claveAPI}`);
        const data = await response.json();

        juegoUnico.value = data;

    } catch (error) {
        console.error(`Error al obtener el juego ${id}:`, error);
    }
    cargando.value = false;
};

// Metodo para obtener información de los juegos, se recorre el array con los ID de los juegos, se busca cada juego, y se mete al final del objeto con todos los datos de los juegos
const getJuegos = async () => {

    for (const id of props.juegos) {
        try {
            const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${claveAPI}`);
            const data = await response.json();

            juegos.value.push(data);

        } catch (error) {
            console.error(`Error al obtener el juego ${id}:`, error);
        }
    }
    cargando.value = false;
};

//Funcion para cambiar el nombre de la colección
async function cambiarNombre(idColeccionModificar) {

    let intro = false;
    let nuevoNombre = "";

    do {
        nuevoNombre = prompt("Introduce el nuevo nombre:");

        if (nuevoNombre) {

            const { error } = await supabase
                .from('coleccion')
                .upsert([
                    {
                        idcoleccion: idColeccionModificar,
                        nombreColeccion: nuevoNombre
                    }
                ]);

            if (error) {
                alert(`Introduce un nombre. Error: ${error}`);
            }
            else {
                alert("Nombre modificado correctamente a " + nuevoNombre);
                intro = true;

                router.replace({ name: 'coleccion' });
                setTimeout(() => {
                    location.reload();
                }, 500);
            }
        } else {
            console.log("Cambio de nombre cancelado");
            intro = true;
        }

    } while (intro == false);

}
//Función para eliminar una colección
async function eliminarColeccion(nombreColeccionEliminar, idColeccionEliminar) {

    if (confirm(`¿Eliminar colección ${nombreColeccionEliminar}?`)) {

        const { data, error } = await supabase
            .from('coleccion')
            .delete()
            .eq('idcoleccion', idColeccionEliminar)

        if (error) alert(error);

        router.replace({ name: 'coleccion' });
        setTimeout(() => {
            location.reload();
        }, 500);

    } else {
        console.log("Eliminado de coleccion " + nombreColeccionEliminar + " cancelado");
    }
}

async function getDatosColeccion(idColeccionIntro) {
    try {
        const { data, error } = await supabase
            .from('coleccion')
            .select('datosentrada, nombreColeccion, idcoleccion')
            .eq('idcoleccion', idColeccionIntro);

        if (error) throw error;

        coleccion = data;
        return coleccion;

    } catch (error) {
        console.error('Error al obtener las colecciones:', error);
    }
}
async function nuevoJuego(idColeccionBuscar, idJuego, idRecibido) {

    let idFinal = idRecibido || idJuego;

    // Si no hay ID, pedimos al usuario que introduzca una
    if (!idFinal) {
        do {
            const entrada = prompt("Introduce la ID de un juego a añadir:");
            if (entrada === null) {
                return;
            }
            idFinal = Number(entrada);
        } while (!Number.isInteger(idFinal) || idFinal <= 0);
    }

    console.log("ID de juego a añadir: " + idFinal);

    // Obtener datos de la colección
    let jsonDatos;
    try {
        jsonDatos = await getDatosColeccion(idColeccionBuscar);


    } catch (err) {
        console.error("Error al obtener datos de la colección:", err);
        return;
    }

    // Asegurar que el array de juegos existe
    let juegos = jsonDatos[0].datosentrada.juegos;
    if (!Array.isArray(juegos)) {
        juegos = [];
        jsonDatos[0].datosentrada.juegos = juegos;
    }

    // Comprobar si el juego ya está
    let yaExiste = false;
    for (let juego of juegos) {
        if (juego === idFinal) {
            yaExiste = true;
            break;
        }
    }

    if (yaExiste) {
        console.log("El juego ya está en la colección: " + idFinal);
        alert("El juego ya está en la colección.");
        return;
    }

    // Añadir el nuevo juego al principio
    juegos.unshift(idFinal);

    // Guardar en Supabase
    try {
        const { data, error } = await supabase
            .from('coleccion')
            .update({
                datosentrada: jsonDatos[0].datosentrada
            })
            .eq('idcoleccion', idColeccionBuscar);

        if (error) throw error;

        alert(`Juego ${idFinal} añadido correctamente.`);
        console.log("Redirigiendo a la página de colección...");


    } catch (err) {
        console.error("Error al añadir el juego:", err);
    }
    router.replace({ name: 'coleccion' });
    setTimeout(() => {
        location.reload();
    }, 500);
}

//Funcion para eliminar un juego mediante su id de coleccion y de juego
async function eliminarJuego(idColeccionBuscar, idJuego) {
    // Solicitar ID si no se proporciona
    if (!idJuego) {
        do {
            const entrada = prompt("Introduce la ID de un juego a eliminar:");
            if (entrada === null) return;
            idJuego = Number(entrada);
        } while (!Number.isInteger(idJuego) || idJuego <= 0);
    }
    console.log(`ID de juego seleccionada: ${idJuego}`);

    // Obtener datos de la colección
    let jsonDatos;
    try {
        jsonDatos = await getDatosColeccion(idColeccionBuscar);
    } catch (err) {
        console.error("Error al obtener datos:", err);
        alert("Error al cargar la colección");
        return;
    }

    if (!confirm(`¿Eliminar juego ${idJuego} de la colección?`)) return;

    // Verificar estructura de datos
    const juegos = jsonDatos[0].datosentrada.juegos;
    if (!Array.isArray(juegos)) {
        alert("La colección no contiene juegos");
        return;
    }

    // Buscar existencia del juego
    let existe = false;
    for (const juego of juegos) {
        if (juego === idJuego) {
            existe = true;
            break;
        }
    }

    if (!existe) {
        alert("Este juego no está en la colección");
        return;
    }

    // Eliminar el juego
    const indice = juegos.indexOf(idJuego);
    juegos.splice(indice, 1);

    // Actualizar en Supabase
    try {
        const { error } = await supabase
            .from('coleccion')
            .update({ datosentrada: jsonDatos[0].datosentrada })
            .eq('idcoleccion', idColeccionBuscar);

        if (error) throw error;

        alert(`Juego ${idJuego} eliminado correctamente`);
        location.reload();

    } catch (err) {
        console.error("Error en Supabase:", err);
        alert("Error al guardar cambios");
    }
}

const getLongColeccion = async () => {
    let jsonDatos;
    try {
        jsonDatos = await getDatosColeccion(props.idcoleccion);

        longColeccion.value = jsonDatos[0].datosentrada.juegos.length;
        console.log(jsonDatos[0].datosentrada.juegos)

        return longColeccion.value;

    } catch (err) {
        console.error("Error al obtener datos:", err);
        return;
    }

}

const toggleFunciones = () => {
    mostrarOpciones.value = !mostrarOpciones.value;
}

onMounted(async () => {
    if (props.juegos.length > 0) {
        await getJuegos();
    } else {
        cargando.value = false;
    }
    if (props.idRecibido) {
        await getJuegoUnico(props.idRecibido);
    }
    longColeccion.value = await getLongColeccion();
    console.log(longColeccion.value)
});

</script>

<template>
    <div class="listaColeccion">
        <div class="textoColeccion">
            <div class="titulo2">Colección <strong>{{ nombre }}</strong></div>
            <div class="subtitulo" v-if="longColeccion">{{ longColeccion }} juegos en la colección.</div>
        </div>

        <p v-if="longColeccion"></p>

        <span v-if="idRecibido">
            <button @click="nuevoJuego(idcoleccion, 0, idRecibido)" :disabled="cargando" class="botonPrincipal">
                {{ `Añadir ${juegoUnico?.name || "juego"} a esta colección` }}
            </button>
        </span>

        <div v-if="cargando">
            <SpinnerCarga /> Cargando colección...
        </div>

        <div v-else-if="juegos.length > 0" class="coleccionesJuegos">
            <div v-for="juego in juegos" :key="juego.id" class="tarjetaJuegoContainer">

                <button @click="eliminarJuego(idcoleccion, juego.id)" class="botonEliminar"><img
                        src="../assets/img/botones/basura.png" alt=""></button>

                <tarjetaJuego :juego="juego" />
            </div>
        </div>

        <div v-else>
            <p class="textoVacio">Esta colección no tiene juegos aún. <router-link to="/catalogo">Explorar
                    juegos.</router-link> </p>
        </div>

        <!-- Botón para mostrar opciones -->
        <button v-if="!mostrarOpciones" @click="toggleFunciones()" class="botonSecundario">
            <img class="botonesOpciones" src="../assets/img/botones/opciones.png" alt="Opciones">
            <span>Opciones de {{ nombre }}</span>
        </button>

        <!-- Botones de opciones -->
        <div v-if="mostrarOpciones" class="opciones">
            <!-- Botón para ocultar -->
            <button @click="toggleFunciones()" class="botonSecundario">
                <img class="botonesOpciones" src="../assets/img/botones/cerrar.png" alt="Cerrar">
                <span>&nbsp;Ocultar opciones</span>
            </button>

            <button @click="cambiarNombre(idcoleccion)" class="botonSecundario">
                <img class="botonesOpciones" src="../assets/img/botones/editar.png"><span>
                    &nbsp;Cambiar Nombre</span>
            </button>

            <button @click="eliminarColeccion(nombre, idcoleccion)" class="botonSecundario">
                <img class="botonesOpciones" src="../assets/img/botones/basura.png"><span>
                    &nbsp;Eliminar Colección</span>
            </button>

            <button @click="nuevoJuego(idcoleccion, 0)" :disabled="cargando" class="botonSecundario">
                <img class="botonesOpciones" src="../assets/img/botones/nuevoJuego.png"><span>
                    &nbsp;<strong>Añadir juego por ID</strong></span>
            </button>
        </div>


    </div>
</template>

<style scoped>
.textoColeccion {
    text-align: center;
}

.botonesOpciones {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    vertical-align: middle;
    filter: brightness(1.3) contrast(1.1);
    transition: transform 0.3s ease;
}

.textoVacio {
    background-color: #131520;
    color: #a1a1b5;
    padding: 1.2rem;
    text-align: center;
    border-radius: 12px;
    margin-top: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    font-size: 1.05rem;
    letter-spacing: 0.02em;
    line-height: 1.6;
}

.textoVacio a {
    color: #5d5fef;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s ease;
}

.textoVacio a:hover {
    color: #4b4aca;
    text-decoration: underline;
}

.listaColeccion {
    padding: 1.5rem;
    border-radius: 16px;
    background-color: #181b29;
    color: #e9e9ec;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(79, 70, 229, 0.15);
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
}

.listaColeccion::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #5d5fef, #9d4edd);
}

.listaColeccion h2 {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #ffffff;
    line-height: 1.3;
    letter-spacing: 0.02em;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
}

.coleccionesJuegos {
    display: flex;
    flex-direction: row;
    gap: 1.5rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 1rem;
    /* Personalización del scrollbar */
    scrollbar-width: thin;
    scrollbar-color: #5d5fef #2d3142;
}

.coleccionesJuegos::-webkit-scrollbar {
    height: 8px;
}

.coleccionesJuegos::-webkit-scrollbar-track {
    background: #2d3142;
    border-radius: 8px;
}

.coleccionesJuegos::-webkit-scrollbar-thumb {
    background-color: #5d5fef;
    border-radius: 8px;
}

.tarjetaJuegoContainer {
    scroll-snap-align: start;
    min-width: 250px;
    max-width: 300px;
    padding: 0.5rem;
    flex-shrink: 0;
    border-radius: 16px;
    text-align: center;
    position: relative;
    transition: transform 0.3s ease;
}

.botonPrincipal {
    background-color: #5d5fef;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(93, 95, 239, 0.3);
}

.botonPrincipal:hover {
    background-color: #4b4aca;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(93, 95, 239, 0.4);
}

.botonPrincipal:disabled {
    background-color: #3d4259;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.botonSecundario {
    background-color: #2d3142;
    color: #e9e9ec;
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 1rem; /* Añadido: espacio entre imagen y texto */
    padding-right: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(5px);
}

.botonSecundario:hover {
    background-color: #3d4259;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(93, 95, 239, 0.2);
}


.opciones {
    display: inline-flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-top: 10px;
}


.botonEliminar {
    position: absolute;
    top: 15px;
    left: 15px;
    width: 35px;
    height: 35px;
    border-radius: 8px;
    border: none;
    background-color: rgba(255, 59, 48, 0.8);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    transition: all 0.2s ease;
}

.botonEliminar img {
    height: 1.5rem;
    transition: transform 0.2s ease;
}

.botonEliminar:hover {
    background-color: rgba(255, 59, 48, 1);
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4);
}


@media (max-width: 768px) {
    .listaColeccion {
        padding: 1rem;
        margin: 0.5rem;
    }

    .textoColeccion {
        margin-bottom: 1rem;
    }

    .titulo2 {
        font-size: 1.2rem;
    }

    .subtitulo {
        font-size: 0.9rem;
    }

    .coleccionesJuegos {
        gap: 0.8rem;
        padding-bottom: 0.8rem;
    }

    .tarjetaJuegoContainer {
        min-width: 160px;
        max-width: 200px;
        padding: 0.3rem;
    }

    .botonPrincipal {
        padding: 0.6rem 1rem;
        font-size: 0.9rem;
        margin-top: 15px;
        margin-bottom: 15px;
        width: 100%;
    }

    .botonSecundario {
        padding: 0.5rem 0.8rem;
        font-size: 0.8rem;
        width: 100%;
        justify-content: center;
    }

    .botonesOpciones {
        width: 18px;
        height: 18px;
    }

    .opciones {
        flex-direction: column;
        gap: 8px;
        width: 100%;
    }

    .botonEliminar {
        width: 30px;
        height: 30px;
        top: 10px;
        left: 10px;
    }

    .botonEliminar img {
        height: 1.2rem;
    }
}

@media (max-width: 480px) {
    .tarjetaJuegoContainer {
        min-width: 140px;
        max-width: 180px;
    }

    .botonSecundario span {
        font-size: 0.75rem;
    }

    .listaColeccion::before {
        height: 3px;
    }
}
</style>
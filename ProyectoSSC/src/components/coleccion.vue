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
        <h2> Colección {{ nombre }} - {{ longColeccion }} juegos en la colección
            <button v-if="!mostrarOpciones" @click="toggleFunciones()" class="botonSecundario">
                <img class="botonesOpciones" src="../assets/img/botones/opciones.png"><span>
                    &nbsp;►</span>
            </button>

            <span v-if="mostrarOpciones" class="opciones">
                <button @click="toggleFunciones()" class="botonSecundario">
                    <img class="botonesOpciones" src="../assets/img/botones/opciones.png"><span> &nbsp;◄</span>
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
                        &nbsp;<strong> Añadir juego por ID</strong></span>
                </button>
            </span>
        </h2>

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
            <p class="textoVacio">Esta colección no tiene juegos aún. <router-link to="/buscar">Explorar
                    juegos.</router-link> </p>
        </div>


    </div>
</template>

<style>
.botonesOpciones {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    vertical-align: middle;
}

.textoVacio {
    background-color: #ebebeb;
    color: #666;
    padding: 0.5rem;
    text-align: center;
}

.listaColeccion {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #f9f9f9;
}

.coleccionesJuegos {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 1rem;
}

.tarjetaJuegoContainer {
    scroll-snap-align: start;
    min-width: 200px;
    padding: 0.5rem;
    flex-shrink: 0;

    border-radius: 8px;
    text-align: center;
    position: relative;
    /* Añadir esta línea */
}

.botonPrincipal:hover {
    background-color: #3f5972;
}

.botonPrincipal {
    background-color: #2c3e50;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
}

.botonPrincipal:disabled {
    background-color: #3f5972;
    cursor: not-allowed;
}

.botonSecundario {
    background-color: #e0e0e0;
    color: #333;
    border: none;
    padding: 0.4rem 0.8rem;
    margin: 0.3rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
}

.botonSecundario:hover {
    background-color: #d5d5d5;
}

.botonEliminar {
    position: absolute;
    top: 15px;
    left: 15px;
    width: 35px;
    height: 35px;
    border-radius: 3px;
    border: 1px solid black;
    background-color: rgba(255, 0, 0, 0.8);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    z-index: 10;
    transition: background-color, transform 0.2s;
}

.botonEliminar img {
    height: 1.5rem;
}

.botonEliminar:hover {
    background-color: rgba(255, 0, 0, 1);
    transform: translateY(-3px);
}
</style>
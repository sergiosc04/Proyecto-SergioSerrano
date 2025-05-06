<script setup>
import { ref, onMounted } from 'vue';
import tarjetaJuego from '../components/tarjetaJuego.vue';
import { supabase } from '../supabase'
import SpinnerCarga from './SpinnerCarga.vue';

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

const juegos = ref([]);
let juegoUnico = ref(null);
const cargando = ref(true);
let coleccion = ref("");
let mostrarOpciones = ref(false);


//importamos la clave del .env
const claveAPI = import.meta.env.VITE_RAWG_API_KEY;

// Metodo para obtener información de in juego, para usar cuando haya idRecibido
const getJuegoUnico = async (id) => {
    try {
        const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${claveAPI}`);
        const data = await response.json();

        juegoUnico.value = data;
        return juegoUnico.value;

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
    const cargando = ref(true);
    let coleccion = ref("");

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
                location.reload();
            }
        } else {
            alert("Cambio de nombre cancelado");
            intro = true;
        }

    } while (intro == false);

}
//Función para eliminar una colección
async function eliminarColeccion(nombreColeccionEliminar, idColeccionEliminar) {

    if (confirm(`¿Eliminar colección ${nombreColeccionEliminar}?`)) {

        console.log(nombreColeccionEliminar);

        const { data, error } = await supabase
            .from('coleccion')
            .delete()
            .eq('idcoleccion', idColeccionEliminar)

        if (error) alert(error);
        location.reload();

    } else {
        alert("Eliminado cancelado");
    }
}

async function getDatosColeccion(idColeccionIntro) {
    try {
        const { data, error } = await supabase
            .from('coleccion')
            .select('datosentrada, nombreColeccion, idcoleccion')
            .eq('idcoleccion', idColeccionIntro);

        console.log(`Datos de coleccion:`);
        console.log(data);

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
        console.log("jsonDatos obtenidos:");

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
        location.reload();
    } catch (err) {
        console.error("Error al añadir el juego:", err);
    }

    console.log("Datos entrada actualizados:");
    console.log(jsonDatos[0].datosentrada);
}


//Funcion para eliminar un juego mediante su id de coleccion y de juego
async function eliminarJuego(idColeccionBuscar, idJuego) {

    if (!idJuego) {
        do {
            const entrada = prompt("Introduce la ID de un juego a eliminar:");
            if (entrada === null) {
                return;
            }
            idJuego = Number(entrada);
        } while (!Number.isInteger(idJuego) || idJuego <= 0);
    }
    console.log(`ID de juego seleccionada: ${idJuego}`);

    //Obtenemos los datos de la colección
    let jsonDatos;
    try {
        jsonDatos = await getDatosColeccion(idColeccionBuscar);

    } catch (err) {
        console.error("Error al obtener datos de la colección:", err);
        return;
    }

    //Buscamos el juego en el array de la colección
    if (confirm("¿Eliminar " + idJuego + " de la colección?")) {


        //Comprueba los valores del array de juegos y compara con el idJuego
        for (let juego of jsonDatos[0].datosentrada.juegos) {
            if (juego === idJuego) {

                //Si los valores coinciden los asigna al valor de index
                console.log("juego coincide: " + idJuego);
                const coincide = jsonDatos[0].datosentrada.juegos.indexOf(juego);

                //Si coincide no es -1 (no lo ha encontrado) elimina el valor del array
                if (coincide !== -1) {
                    jsonDatos[0].datosentrada.juegos.splice(coincide, 1);
                    console.log(jsonDatos[0].datosentrada.juegos);

                    //Actializar en Supabase
                    try {
                        const { data, error } = await supabase
                            .from('coleccion')
                            .update({ datosentrada: jsonDatos[0].datosentrada })
                            .eq('idcoleccion', idColeccionBuscar);

                        if (error) {
                            throw error;
                        }

                        console.log("Respuesta Supabase:", data);
                        alert(`Juego ${idJuego} eliminado correctamente de la colección.`);

                        location.reload();

                    } catch (err) {
                        console.error("Error al actualizar en Supabase:", err);
                        alert("Error al guardar los cambios. Revisa la consola.");
                    }
                }
            }
        }
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
});
</script>

<template>
    <hr>
    <div class="listaColeccion">
        <h2> Colección {{ nombre }} <button v-if="!mostrarOpciones" @click="toggleFunciones()"
                class="botonSecundario">Opciones</button>
            <span v-if="mostrarOpciones" class="opciones">
                <button @click="toggleFunciones()" class="botonSecundario">Cerrar opciones</button>
                <button @click="cambiarNombre(idcoleccion)" class="botonSecundario">Cambiar Nombre</button>
                <button @click="eliminarColeccion(nombre, idcoleccion)" class="botonSecundario">Eliminar
                    Colección</button>
                <button @click="nuevoJuego(idcoleccion, 0, idRecibido)" :disabled="cargando" class="botonSecundario">
                    Añadir juego por ID
                </button>
            </span>
        </h2>
        <h4 v-if="idRecibido">
            Añadir {{ juegoUnico.value }} a la colección <br>
            <button @click="nuevoJuego(idcoleccion, 0, idRecibido)" :disabled="cargando" class="botonPrincipal">
                Añadir {{ juegoUnico?.name }} a la colección
            </button>
        </h4>





        <div v-if="cargando">
            <SpinnerCarga /> Cargando colección...
        </div>

        <div v-else-if="juegos.length > 0" class="coleccionesJuegos">
            <div v-for="juego in juegos" :key="juego.id" class="tarjetaJuegoContainer">
                <button @click="eliminarJuego(idcoleccion, juego.id)" class="botonSecundario">Eliminar
                    juego</button>
                <tarjetaJuego :juego="juego" />
            </div>
        </div>

        <div v-else>
            <p class="textoVacio">Esta colección no tiene juegos aún.</p>
        </div>
    </div>
</template>

<style>
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
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    text-align: center;
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
</style>
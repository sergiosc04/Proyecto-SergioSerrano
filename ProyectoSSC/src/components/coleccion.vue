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
    if (props.idRecibido) {
        console.log("idRecibido: " + props.idRecibido)


        //Si el valor no existe en la coleccion lo añade al principio de la colección
        let jsonDatos;
        try {
            jsonDatos = await getDatosColeccion(idColeccionBuscar);

        } catch (err) {
            console.error("Error al obtener datos de la colección:", err);
            return;
        }

        jsonDatos[0].datosentrada.juegos.unshift(props.idRecibido);

        try {
            const { data, error } = await supabase
                .from('coleccion')
                .update({
                    datosentrada: jsonDatos[0].datosentrada
                })
                .eq('idcoleccion', idColeccionBuscar);


        } catch (err) {
            console.error("error al añadir el juego:" + err)
        } finally {
            alert(`Juego ${props.idRecibido} añadido correctamente de props.idRecibido: ${props.idRecibido}.`);
            location.reload();
        }

        console.log("Datos entrada actualizados:");
        console.log(jsonDatos[0].datosentrada);

    } else {
        if (!idJuego) {
            do {
                const entrada = prompt("Introduce la ID de un juego a añadir:");
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

        for (let juego of jsonDatos[0].datosentrada.juegos) {
            if (juego === idJuego) {

                //Si los valores coinciden muestra aviso de que ya existe en la coleccion
                console.log("juego coincide: " + idJuego);
                alert("El juego ya está en la colección")
            } else {

                //Si el valor no existe en la coleccion lo añade al principio de la colección
                jsonDatos[0].datosentrada.juegos.unshift(idJuego);

                try {
                    const { data, error } = await supabase
                        .from('coleccion')
                        .update({
                            datosentrada: jsonDatos[0].datosentrada
                        })
                        .eq('idcoleccion', idColeccionBuscar);


                } catch (err) {
                    console.error("error al añadir el juego:" + err)
                } finally {
                    alert(`Juego ${idJuego} añadido correctamente de idJuego.`);
                    location.reload();
                }

                console.log("Datos entrada actualizados:");
                console.log(jsonDatos[0].datosentrada);

            }
        }
    }
}

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

onMounted(async () => {
    if (props.juegos.length > 0) {
        await getJuegos();
    } else {
        cargando.value = false;
    }
    if (props.idRecibido) {
        await getJuegoUnico(props.idRecibido);
        console.log('en la ref juegoUnico.value:', juegoUnico.value);
    }
});
</script>

<template>
    <hr>
    <div class="listaColeccion">
        <h2> Colección {{ nombre }}

            <button @click="cambiarNombre(idcoleccion)">Cambiar Nombre</button>
            <button @click="eliminarColeccion(nombre, idcoleccion)">Eliminar Colección</button>
        </h2>
        <h3>
            ID colección: {{ idcoleccion }}, idRecibido: {{ idRecibido }}, Nombre juego ID: {{ juegoUnico?.name }}

        </h3>

        <button @click="nuevoJuego(idcoleccion, 0, idRecibido)" :disabled="cargando">{{ idRecibido ? `Añadir
            ${juegoUnico?.name} a la colección ` :
            "Añadir juego nuevo por ID" }}</button>

        <div v-if="cargando">
            <SpinnerCarga />Cargando colección...
        </div>

        <div v-else-if="juegos.length > 0" class="coleccionesJuegos">
            <div v-for="juego in juegos" :key="juego.id">
                <br>
                <button @click="eliminarJuego(idcoleccion, juego.id,)" align="center">Eliminar juego</button>
                <tarjetaJuego :juego="juego" />

            </div>
        </div>

        <div v-else>
            <p>Esta colección no tiene juegos aún.</p>
        </div>
    </div>
</template>


<style scoped>
.coleccionesJuegos {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    overflow-x: auto;
    /* Permite el deslizamiento horizontal */
    scroll-snap-type: x mandatory;
    /* para crear un efecto de "snap" en el slider */
}

.contenedorJuegos>* {
    scroll-snap-align: start;

}

.contenedorJuegos {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}

ul {
    list-style-type: none;
    padding-left: 0;
    margin-top: 0.5rem;
}

li {
    padding: 0.25rem 0;
}

.juegos {
    margin-top: 1rem;
}

.juego {
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border: 1px solid #eee;
    border-radius: 4px;
}

.juego h5 {
    margin: 0 0 0.5rem 0;
}

.juego p {
    margin: 0.25rem 0;
}
</style>
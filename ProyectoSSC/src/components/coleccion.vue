<script setup>
import { ref, onMounted } from 'vue';
import tarjetaJuego from '../components/tarjetaJuego.vue';
import { supabase } from '../supabase'

//variables recibidas desde el coleccionView
const props = defineProps({
    nombre: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        default: () => []
    },
    idcoleccion: {
        type: Number,
        default: null
    }
});

//Array que recoge los juegos de las colecciones
const juegos = ref([]);

//Variable para almacenar los datos de cada coleccion
let coleccion = ref("");

//importamos la clave del .env
const claveAPI = import.meta.env.VITE_RAWG_API_KEY;

// Metodo para obtener información de los juegos, se recorre el array con los ID de los juegos, se busca cada juego, y se mete al final del objeto con todos los datos de los juegos
const getJuegos = async () => {

    for (const id of props.items) {
        try {
            const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${claveAPI}`);
            const data = await response.json();

            juegos.value.push(data);

        } catch (error) {
            console.error(`Error al obtener el juego ${id}:`, error);
        }
    }
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

async function nuevoJuego(idColeccionBuscar, idJuego) {

    if (idJuego == null || idJuego == 0) {
        alert("Escribe una ID válida")
        idJuego = Number(prompt("Introduce la ID de un juego"));
    } else {
        console.log(`Juego introducido: ${idJuego}`)
    }

    // Ejecutamo la función de obtener datos mediante una ID
    let jsonDatos = await getDatosColeccion(idColeccionBuscar);

    //metemos el valor del juego en el array de resultado
    jsonDatos[0].datosentrada.items.push(idJuego);

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
        alert(`Juego ${idJuego} añadido correctamente.`);
        location.reload();
    }

    console.log("Datos entrada actualizados:");
    console.log(jsonDatos[0].datosentrada);

} onMounted(() => {
    if (props.items.length > 0) {
        getJuegos(); 1
    }

});
</script>

<template>
    <hr>
    <div class="listaColeccion">
        <h3>Colección {{ nombre }}, id {{ idcoleccion }} <button @click="cambiarNombre(idcoleccion)">Cambiar
                Nombre</button><button @click="eliminarColeccion(nombre, idcoleccion)">Eliminar Colección</button></h3>

        <button @click="nuevoJuego(idcoleccion, 58764)">Añadir juegos</button>

        <div v-if="items.length > 0" class="listaItems">
            <!-- Pasar cada objeto juego al componente tarjetaJuego -->

            <div v-if="juegos.length > 0" class="coleccionesJuegos">

                <div v-for="juego in juegos" :key="juego.id">
                    <br>
                    <tarjetaJuego :juego="juego" />
                </div>

            </div>

            <div v-else>
                Cargando colección...
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
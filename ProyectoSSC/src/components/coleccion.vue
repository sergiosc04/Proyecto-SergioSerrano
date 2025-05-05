<script setup>
import { ref, onMounted } from 'vue';
import tarjetaJuego from '../components/tarjetaJuego.vue';

//variables compartidas
const props = defineProps({
    nombre: {
        type: String,
        required: true
    },
    items: {
        type: Array,
        default: () => []
    }
});

//Array que recoge los juegos de las colecciones
const juegos = ref([]);

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

onMounted(() => {
    if (props.items.length > 0) {
        getJuegos();
    }
});
</script>

<template>
    <div class="listaColeccion">
        <h3>Colección {{ nombre }}</h3>

        <div v-if="items.length > 0" class="listaItems">
            <!-- Pasar cada objeto juego al componente tarjetaJuego -->
            <div v-if="juegos.length > 0" class="coleccionesJuegos">

                <div v-for="juego in juegos" :key="juego.id">
                    <tarjetaJuego :juego="juego" />
                </div>
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
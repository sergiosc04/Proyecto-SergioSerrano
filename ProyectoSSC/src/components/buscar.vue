<!-- <script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
    name: 'buscar',

    setup() {
        //Var para cargar juegos
        let juegos = ref([]);
        let idBuscar = ref("");
        let juegosPagina = ref(20);

        //Var para cargar generos
        let generos = ref([]);

        //Var para cargar paginas
        let numPagina = ref(1);
        let cargando = ref(false);
        let previousPage = ref(null);
        let nextPage = ref(null);

        const buscarJuegos = async () => {
            try {
                const endpoint = `https://api.rawg.io/api/games?key=9c8533b1b08441e680f0d26ed85dc61b&search=${idBuscar.value}&page_size=${juegosPagina.value}&page=${numPagina.value}`;
                const response = await axios.get(endpoint);
                juegos.value = response.data.results;
                previousPage.value = response.data.previous;
                nextPage.value = response.data.next;
            } catch (error) {
                console.error("Error al obtener los juegos:", error);
            }
        };


        //Funcion para buscar Generos
        const getGeneros = async () => {
            try {
                const endpoint = `https://api.rawg.io/api/genres?key=9c8533b1b08441e680f0d26ed85dc61b`;
                const response = await axios.get(endpoint);
                generos.value = response.data.results;

                console.log(generos.value);

            } catch (error) {
                console.error("Error al obtener los juegos:", error);
            }
        };

        onMounted(() => {
            getGeneros();
        });

        return {
            //Variables de juegos
            juegos,
            idBuscar,
            juegosPagina,

            //Variables de pagina
            numPagina,
            previousPage,
            nextPage,
            cargando,

            //Variables de generos
            generos,

            //Métodos de Juegos
            buscarJuegos,

            //Métodos de Paginas


            //Metodos de generos
            getGeneros,
        };
    }

}
</script>

<template>
    <div class='buscador'>
        <span>
            <input type="text" placeholder="Busca un juego" v-model="idBuscar">
            <input type="text" placeholder="Juegos por página" v-model="juegosPagina">
            <input type="text" placeholder="Nº de página" v-model="numPagina">

            <select name="selectGenero" id="selectGenero">
                <option value="">opcion1</option>
                <option value="">opcion2</option>
                <option value="">opcion3</option>
            </select>

            <button type="submit" @click="buscarJuegos()">Buscar</button>
        </span>
    </div>
</template>

<style></style> -->
<script></script>
<template></template>
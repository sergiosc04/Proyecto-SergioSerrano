<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import tarjetaJuego from '@/components/tarjetaJuego.vue';
import paginacion from '../compostables/paginacion';

export default {
  name: 'buscar',

  components: {
    tarjetaJuego,
  },
  setup() {

    const endpointGeneros = `https://api.rawg.io/api/genres?key=9c8533b1b08441e680f0d26ed85dc61b`;

    //Variable para mostrar busqueda avanzada de juegos
    let busquedaAvanzada = ref(false);

    //Var para cargar juegos
    let juegos = ref([]);
    let idBuscar = ref("");
    let juegosPagina = ref(20);

    //Variable para confirmar que se ha buscado
    let buscado = ref(false);

    //Var para cargar generos
    let generos = ref([]);
    let generoSelect = ref("");

    //Var para cargar paginas
    let numPagina = ref(1);
    let cargando = ref(false);
    let paginaAnterior = ref(null);
    let paginaSiguiente = ref(null);

    //Funcion para buscar juegos
    const buscarJuegos = async () => {
      try {
        cargando.value = true;
        const params = new URLSearchParams({
          key: '9c8533b1b08441e680f0d26ed85dc61b',
          search: idBuscar.value || '',
          page_size: juegosPagina.value,
          page: numPagina.value,
        });

        if (generoSelect.value) {
          params.append('genres', generoSelect.value);
        }

        const endpoint = `https://api.rawg.io/api/games?${params.toString()}`;

        //Version anterior de busqueda: 
        //const endpoint = `https://api.rawg.io/api/games?key=9c8533b1b08441e680f0d26ed85dc61b&search=${idBuscar.value}&page_size=${juegosPagina.value}&page=${numPagina.value}&genres=${generoSelect.value}`;

        const response = await axios.get(endpoint);

        juegos.value = response.data.results;
        paginaAnterior.value = response.data.previous;
        paginaSiguiente.value = response.data.next;
        cargando.value = false;

      } catch (error) {
        console.error("Error al obtener los juegos:", error);
      }
    };

    const vistaAvanzada = () => {
      busquedaAvanzada.value = !busquedaAvanzada.value;
    };

    //Funcion para buscar Generos
    const getGeneros = async () => {
      try {
        const response = await axios.get(endpointGeneros);
        generos.value = response.data.results;

        console.log(generos.value);

      } catch (error) {
        console.error("Error al obtener los juegos:", error);
      }
    };

    onMounted(() => {
      getGeneros();
      buscarJuegos();
    });

    //Compostable para cambiar la pagina
    const { cambiarPagina } = paginacion(numPagina, cargando, paginaAnterior, paginaSiguiente, buscarJuegos);

    return {
      //Variables de juegos
      juegos,
      idBuscar,
      juegosPagina,

      //Variables de pagina
      numPagina,
      paginaAnterior,
      paginaSiguiente,
      cargando,
      buscado,

      //Variables de generos
      generos,
      generoSelect,

      //Métodos de Juegos
      buscarJuegos,

      //Métodos de Paginas
      cambiarPagina,

      //Metodos de generos
      getGeneros,

      //Variable de busqueda avanzada
      busquedaAvanzada,
      vistaAvanzada,
    };
  }
}

</script>

<template>
  <main>
    <h1 align="center">Buscar juegos</h1>
    <div class="buscador_container" align="center">
      <div class="barra_busqueda">
        <!-- Columna 1: Buscar juego -->

        <div class="buscador-col">
          <input type="text" placeholder="Busca un juego..." v-model="idBuscar" />
        </div>

      </div>

      <div v-if="busquedaAvanzada" class="buscador_avanzado">
        <h4 align="center">Opciones Avanzadas</h4>
        <div class="buscador_genero">
          <label>
            Género:<br>
            <select id="selectGenero" v-model="generoSelect">
              <option value=""></option>
              <option v-for="genero in generos" :key="genero.id" :value="genero.slug">
                {{ genero.name }} ({{ genero.games_count }} juegos)
              </option>
            </select>
          </label>
          <br>
        </div>


        <!-- Columna 2: Nº página y juegos/página -->
        <div class="buscador_pagina">
          <label>
            Juegos por página:<br>
            <input type="text" placeholder="Juegos por página" v-model="juegosPagina" />
          </label>
          <br>
          <label>
            Nº página:<br>
            <input type="text" placeholder="Nº de página" v-model="numPagina" />
          </label>
        </div>

        <!-- Columna 3: Género y botón -->

      </div>

      <div class="botones_busqueda">
        <button class="boton-buscar" @click="buscarJuegos()">Buscar</button>
        <button class="boton-buscar" v-if="busquedaAvanzada" @click="vistaAvanzada()">Ocultar opciones
          avanzadas</button>
        <button class="boton-buscar" v-else @click="vistaAvanzada()">Ver opciones avanzadas</button>
      </div>

    </div>

    <!-- contenedor info pagina -->
    <div class="contenedorJuegos">
      <h3 v-if="buscado">Resultados de la búsqueda {{ idBuscar }}:</h3>
      <div class="contenedorPagina">

        <!-- Botón de página anterior solo si existe y no está en estado "cargando" -->
        <img v-if="paginaAnterior" src="../assets/img/botones/back.png" @click="cambiarPagina('anterior')"
          :disabled="cargando">

        <strong>Página {{ numPagina }}</strong>

        <!-- Botón de página siguiente solo si existe y no está en estado "cargando" -->
        <img v-if="paginaSiguiente" src="../assets/img/botones/next.png" @click="cambiarPagina('siguiente')"
          :disabled="cargando">


      </div><br>

      <div class="listadoJuegos" v-if="!cargando">

        <!-- Se pasan los datos del juego a la tarjeta -->
        <span v-for="juego in juegos" :key="juego.id" class="listadoJuegos">
          <tarjetaJuego :juego="juego"></tarjetaJuego>
        </span>
      </div>

      <p v-else align="center">
        Cargando...
      </p>

    </div>
  </main>
</template>


<style scoped>
.buscador_container {
  display: flex;
  flex-direction: column;
  margin-left: 20%;
  margin-right: 20%;
}

/* Input de búsqueda ocupa todo el ancho */
.barra_busqueda input {
  width: 80%;
  padding: 10px;
  border-radius: 3px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
}

/* Inputs de juegos/página y número de página se alinean */
.buscador_pagina {
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-bottom: 10px;
}


.buscador_pagina input {
  padding: 10px;
  border-radius: 3px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

/* Select de género */
.buscador_genero select {
  width: 50%;
  padding: 10px;
  border-radius: 3px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  ;
}

.boton-buscar {
  background-color: #2d2d44;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.boton-buscar:hover {
  background-color: #4f4f6e;
  transform: translateY(-2px);
}

/* caja de paginas */
.contenedorPagina {
  position: fixed;
  bottom: 10px;
  left: 10px;
  background-color: rgba(255, 255, 255, 0.9);
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  align-items: center;
}

/* para las flechas de las paginas */
.contenedorPagina img {
  width: 20px;
  height: 20px;
  margin: 0 5px;
  cursor: pointer;
}
</style>
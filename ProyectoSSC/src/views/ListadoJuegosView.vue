<script>
import tarjetaJuego from '../components/tarjetaJuego.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  components: {
    tarjetaJuego,
  },

  setup() {
    //Se hace un array, que recoge distintos juegos
    //Mostrar el componente tarjetaJuego con los datos dependiendo de la ID que tenga cada juego, tantas veces como
    //instancias del objeto de juego haya en la API


    // Se define juegos como una referencia reactiva
    let juegos = ref([]);
    let endpoint = ref("https://api.rawg.io/api/games?key=9c8533b1b08441e680f0d26ed85dc61b&page_size=10");

    // Variable para evitar el spam en los botones
    let cargando = ref(false);

    // Variables de página anterior/siguiente
    let previousPage = ref(null);
    let nextPage = ref(null);

    //Función que obtiene los juegos
    const getJuegos = async () => {
      try {
        const response = await axios.get(endpoint.value);
        juegos.value = response.data.results;

        //se asignan los valores correspondientes a la página
        previousPage.value = response.data.previous;
        nextPage.value = response.data.next;

      } catch (error) {
        console.error("Error al obtener los juegos:", error);
      }
    };

    //Función para cambiar el endpoint
    const cambiarEndpoint = (nuevo) => {
      endpoint.value = nuevo;
    };

    //Función para cambiar de página
    const cambiarPagina = (nuevoEndpoint) => {

      // Bloquea los botones mientras se ejecuta la petición
      cargando.value = true;

      // Espera 0.5 segundos antes de ejecutar el cambio de página, asi se evita q la API se sature
      setTimeout(() => {
        cambiarEndpoint(nuevoEndpoint);
        getJuegos();
        console.log(juegos.value);
        cargando.value = false;
      }, 500);
    }

    onMounted(() => {
      getJuegos();
    });

    return {
      // Variables
      juegos,
      previousPage,
      nextPage,
      cargando,

      // Métodos
      getJuegos,
      cambiarPagina,
    };

  }
};
</script>

<template>
  <main class="listadoJuegos">
    <h1>Página de listado de juegos</h1>

    <div class="botonesPaginas">

      <!-- Botón de página anterior solo si existe y no está en estado "cargando" -->
      <button v-if="previousPage" @click="cambiarPagina(previousPage)" :disabled="cargando">Página anterior</button>

      <!-- Botón de página siguiente solo si existe y no está en estado "cargando" -->
      <button v-if="nextPage" @click="cambiarPagina(nextPage)" :disabled="cargando">Página siguiente</button>
    </div>

    <!-- Se pasan los datos del juego a la tarjeta -->
    <span v-for="juego in juegos" :key="juego.id">
      <tarjetaJuego :juego="juego"></tarjetaJuego>
    </span>

  </main>
</template>

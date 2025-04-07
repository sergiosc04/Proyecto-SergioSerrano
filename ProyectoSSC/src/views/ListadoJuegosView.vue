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

    //Declarar variables para la busqueda de juegos
    let numPagina = ref(1);
    let endpoint = ref("");

    // Variable para evitar el spam en los botones
    let cargando = ref(false);

    // Variables de página anterior/siguiente
    let paginaAnterior = ref(null);
    let paginaSiguiente = ref(null);

    //Función que obtiene los juegos
    const getJuegos = async () => {
      try {

        //hacemos numPagina un numero aleatorio de 1 a 100, y le asignamos ese valor al endpoint
        numPagina.value = Math.floor(Math.random() * 100) + 1;
        endpoint.value = `https://api.rawg.io/api/games?key=9c8533b1b08441e680f0d26ed85dc61b&page=${numPagina.value}`;
        const response = await axios.get(endpoint.value);
        juegos.value = response.data.results;
        console.log(juegos.value);
        console.log(endpoint.value);

        //se asignan los valores correspondientes a la página
        paginaAnterior.value = response.data.previous;
        paginaSiguiente.value = response.data.next;

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
      paginaAnterior,
      paginaSiguiente,
      cargando,
      numPagina,

      // Métodos
      getJuegos,
      cambiarPagina,
    };

  }
};
</script>

<template>
  <main>
    <h1>Inicio</h1>
    <div v-if="juegos.length > 0" class="contenedorJuegos">
      <div class="contenedorBotones">
        <br>
        Página {{ numPagina }} <br>
        <button @click="getJuegos();" :disabled="cargando">Página aleatoria</button>

        <!-- Botón de página siguiente solo si existe y no está en estado "cargando" -->
        <button v-if="paginaAnterior" @click="cambiarPagina(paginaAnterior)" :disabled="cargando">
          Página anterior
        </button>

        <!-- Botón de página anterior solo si existe y no está en estado "cargando" -->
        <button v-if="paginaSiguiente" @click="cambiarPagina(paginaSiguiente)" :disabled="cargando">
          Página siguiente
        </button>
      </div><br>

      <div class="listadoJuegos">
        <!-- Se pasan los datos del juego a la tarjeta -->
        <span v-for="juego in juegos" :key="juego.id" class="listadoJuegos">
          <tarjetaJuego :juego="juego"></tarjetaJuego>
        </span>
      </div>

    </div>

    <p v-else>Cargando...</p>
  </main>
</template>


<style scoped></style>

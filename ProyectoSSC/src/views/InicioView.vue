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
    let numPagina = ref(0);
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
        if (numPagina.value === 0) {
          numPagina.value = Math.floor(Math.random() * 100) + 1;
        }
        endpoint.value = `https://api.rawg.io/api/games?key=9c8533b1b08441e680f0d26ed85dc61b&page=${numPagina.value}`;

        //Recogemos los juegos de la api, y le asignamos el valor a la variable juegos
        const response = await axios.get(endpoint.value);
        juegos.value = response.data.results;

        console.log(endpoint.value);

        //se asignan los valores correspondientes a la página
        paginaAnterior.value = response.data.previous;
        paginaSiguiente.value = response.data.next;

      } catch (error) {
        console.error("Error al obtener los juegos:", error);
      }
    };

    // Función para cambiar de página
    const cambiarPagina = (direccion) => {

      // Bloquea los botones mientras se ejecuta la petición
      cargando.value = true;

      // Ajustar numPagina hacia adelante o atrás
      if (direccion === 'anterior' && paginaAnterior.value) {
        numPagina.value -= 1;
      } else if (direccion === 'siguiente' && paginaSiguiente.value) {
        numPagina.value += 1;
      }

      getJuegos();
      cargando.value = false;
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
    <h1 align="center">¡Bienvenido a PixelRift!</h1>
    <div v-if="juegos.length > 0" class="contenedorJuegos">
      <div class="contenedorPagina">

        Página {{ numPagina }} <br>
        <button @click="getJuegos();" :disabled="cargando">Página aleatoria</button>

        <!-- Botón de página siguiente solo si existe y no está en estado "cargando" -->
        <button v-if="paginaAnterior" @click="cambiarPagina('anterior')" :disabled="cargando">
          Página anterior
        </button>

        <!-- Botón de página anterior solo si existe y no está en estado "cargando" -->
        <button v-if="paginaSiguiente" @click="cambiarPagina('siguiente')" :disabled="cargando">
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
    <p v-else align="center">Cargando...</p>
  </main>
</template>


<style scoped>
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
}
</style>

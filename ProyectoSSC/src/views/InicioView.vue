<script>
import tarjetaJuego from '../components/tarjetaJuego.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import paginacion from '../compostables/paginacion';


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
        cargando.value = true;

        //hacemos numPagina un numero aleatorio de 1 a 100, y le asignamos ese valor al endpoint
        if (numPagina.value === 0) {
          numPagina.value = Math.floor(Math.random() * 15) + 1;
        }
        endpoint.value = `https://api.rawg.io/api/games?key=9c8533b1b08441e680f0d26ed85dc61b&page=${numPagina.value}`;

        //Recogemos los juegos de la api, y le asignamos el valor a la variable juegos
        const response = await axios.get(endpoint.value);
        juegos.value = response.data.results;

        console.log(endpoint.value);

        //se asignan los valores correspondientes a la página
        paginaAnterior.value = response.data.previous;
        paginaSiguiente.value = response.data.next;

        cargando.value = false;

      } catch (error) {
        console.error("Error al obtener los juegos:", error);
      }
    };

    onMounted(() => {
      getJuegos();
    });

    //Compostable para cambiar la pagina
    const { cambiarPagina } = paginacion(numPagina, cargando, paginaAnterior, paginaSiguiente, getJuegos);

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

        <!-- Imagen para Página anterior -->
        <img v-if="paginaAnterior" src="../assets/img/back.png" alt="Página anterior" @click="cambiarPagina('anterior')"
          :disabled="cargando" />

        <strong>Página {{ numPagina }}</strong>

        <!-- Imagen para Página siguiente -->
        <img v-if="paginaSiguiente" src="../assets/img/next.png" alt="Página siguiente"
          @click="cambiarPagina('siguiente')" :disabled="cargando" />
      </div>

      <div class="listadoJuegos">

        <!-- Se pasan los datos del juego a la tarjeta -->
        <span v-for="juego in juegos" :key="juego.id" class="listadoJuegos" v-if="!cargando">
          <tarjetaJuego :juego="juego"></tarjetaJuego>
        </span>

        <p v-else align="center">Cargando...</p>
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
  display: flex;
  align-items: center;
}

.contenedorPagina img {
  width: 20px;
  height: 20px;
  margin: 0 5px;
  cursor: pointer;
}
</style>

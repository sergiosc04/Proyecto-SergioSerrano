<script>
import tarjetaJuego from '../components/tarjetaJuego.vue';

import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {

  components: {
    tarjetaJuego,
  },

  setup() {

    //Se define juegos como una referencia reactiva
    let juegos = ref([]);

    //Se hace un array, que recoge distintos juegos. Mostrar el componente tarjetaJuego con los datos dependiendo de la ID que tenga cada juego, tantas veces como
    //instancias del objeto de juego haya en la API

    //Funcion que obtiene los juegos
    const getJuegos = async () => {
      try {
        const response = await axios.get(
          "https://api.rawg.io/api/games?key=9c8533b1b08441e680f0d26ed85dc61b&page_size=10"
        );
        juegos.value = response.data.results;
        console.log(juegos.value);

      } catch (error) {
        console.error("Error al obtener los juegos:", error);
      }
    }

    onMounted(() => {
      getJuegos();


    });
    return {
      //variables
      juegos,

      //metodos
      getJuegos,

    };
  }
}

</script>

<template>
  <main>
    <h1>Página de listado de juegos</h1>

    <span v-for="juego in juegos" :key="juego.id">
      <!-- Puedes pasar los datos del juego a la tarjeta -->
      <tarjetaJuego :juego="juego"></tarjetaJuego>
    </span>

  </main>
</template>

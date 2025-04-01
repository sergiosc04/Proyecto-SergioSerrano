<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import tarjetaJuego from '@/components/tarjetaJuego.vue';

export default {
  name: 'buscar',

  components: {
    tarjetaJuego,
  },
  setup() {
    let juegos = ref([]);
    let idBuscar = ref("");
    let juegosPagina = ref(20);
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


    return {
      juegos,
      idBuscar,
      juegosPagina,
      numPagina,
      previousPage,
      nextPage,
      cargando,
      buscarJuegos
    };
  }
}

</script>

<template>
  <main>
    <h1>Buscar juegos</h1>

    <div class='buscador'>
      <span>
        <label>
          Buscar:
          <input type="text" placeholder="Busca un juego" v-model="idBuscar">
        </label>
        <label>
          Juegos/página:
          <input type="text" placeholder="Juegos por página" v-model="juegosPagina">
        </label>
        <label>
          Nº página:
          <input type="text" placeholder="Nº de página" v-model="numPagina">
        </label>
        <button type="submit" @click="buscarJuegos()">Buscar</button>
      </span>
    </div>

    <div class="contenedorJuegos">
      <!-- Botón de página anterior solo si existe y no está en estado "cargando" -->
      <button v-if="previousPage" @click="cambiarPagina(previousPage)" :disabled="cargando">Página anterior</button>

      <!-- Botón de página siguiente solo si existe y no está en estado "cargando" -->
      <button v-if="nextPage" @click="cambiarPagina(nextPage)" :disabled="cargando">Página siguiente</button>

      <div class="listadoJuegos">
        <!-- Se pasan los datos del juego a la tarjeta -->
        <span v-for="juego in juegos" :key="juego.id" class="listadoJuegos">
          <tarjetaJuego :juego="juego"></tarjetaJuego>
        </span>
      </div>
    </div>
  </main>
</template>


<style></style>

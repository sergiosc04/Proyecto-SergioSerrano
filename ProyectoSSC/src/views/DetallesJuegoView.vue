<script>
import { ref, onMounted } from 'vue';
import { useRoute } from "vue-router";
import axios from 'axios';

export default {
  setup() {

    let juego = ref();

    const getDetalleJuegos = async () => {
      try {
        const endpoint = `https://api.rawg.io/api/games/${useRoute().params.id}?key=9c8533b1b08441e680f0d26ed85dc61b`;
        const response = await axios.get(endpoint);
        juego.value = response.data;
        console.log(juego.value);

      } catch (error) {
        console.error("Error al obtener los juegos:", error);
      }
    }

    onMounted(() => {
      getDetalleJuegos();
    });

    return {
      juego,
      getDetalleJuegos,
    }
  }
};
</script>

<template>
  <div>
    <h1>Vista de detalles del juego</h1>

    <!-- Mostrar los detalles del juego -->
    <div v-if="juego">
      <p><strong>Nombre:</strong> {{ juego.name }}</p>

      <p><strong>Descripción:</strong></p>
      <p v-html="juego.description"></p>

      <p><strong>Fecha de lanzamiento:</strong> {{ juego.released }}</p>

      <p><strong>Género:</strong>
        <span v-for="(genre, index) in juego.genres" :key="index">

          <!-- Itera sobre los generos del juego, mostrando su nombre y separándolos con comas excepto después de la última -->
          {{ genre.name }}{{ index < juego.genres.length - 1 ? ', ' : '' }} </span>
      </p>

      <p><strong>Calificación:</strong> {{ juego.rating }}</p>

      <p><strong>Plataformas:</strong>
        <span v-for="(platform, index) in juego.platforms" :key="index">

          <!-- Itera sobre las plataformas del juego, mostrando su nombre y separándolas con comas excepto después de la última -->
          {{ platform.platform.name }}{{ index < juego.platforms.length - 1 ? ', ' : '' }} </span>
      </p>

      <p><strong>Imágenes:</strong></p>
      <div v-if="juego.background_image">
        <img :src="juego.background_image" alt="Imagen del juego" width="400px">
      </div>
    </div>

    <!-- Mensaje de carga si los datos aún no están disponibles -->
    <p v-else>Cargando...</p>
  </div>
</template>

<style></style>

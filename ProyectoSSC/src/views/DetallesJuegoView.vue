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
    <!-- Mostrar los detalles del juego -->
    <div v-if="juego">
      <h1 align="center">Detalles de {{ juego.name }}</h1>
      <p><strong>Nombre:</strong> {{ juego.name }}</p>
      <p><strong>Nombre original:</strong> {{ juego.name_original }}</p>
      <p><strong>Slug:</strong> {{ juego.slug }}</p>
      <p><strong>ID:</strong> {{ juego.id }}</p>

      <p><strong>Fecha de lanzamiento:</strong> {{ juego.released }}</p>
      <p><strong>Última actualización:</strong> {{ juego.updated }}</p>

      <p><strong>Género:</strong>
        <span v-for="(genre, index) in juego.genres" :key="index">
          {{ genre.name }}{{ index < juego.genres.length - 1 ? ', ' : '' }} </span>
      </p>

      <p><strong>Calificación:</strong> {{ juego.rating }} (Top: {{ juego.rating_top }})</p>
      <p><strong>Metacritic Score:</strong> {{ juego.metacritic }}</p>
      <p><strong>ESRB Rating:</strong> {{ juego.esrb_rating.name }}</p>

      <p><strong>Plataformas:</strong>
        <span v-for="(platform, index) in juego.parent_platforms" :key="index">
          {{ platform.platform.name }}{{ index < juego.parent_platforms.length - 1 ? ', ' : '' }} </span>
      </p>

      <p><strong>Desarrolladores:</strong>
        <span v-for="(dev, index) in juego.developers" :key="index">
          {{ dev.name }}{{ index < juego.developers.length - 1 ? ', ' : '' }} </span>
      </p>

      <p><strong>Editores:</strong>
        <span v-for="(pub, index) in juego.publishers" :key="index">
          {{ pub.name }}{{ index < juego.publishers.length - 1 ? ', ' : '' }} </span>
      </p>

      <p><strong>Tags:</strong>
        <span v-for="(tag, index) in juego.tags" :key="index">
          {{ tag.name }}{{ index < juego.tags.length - 1 ? ', ' : '' }} </span>
      </p>

      <summary><strong>Descripción:</strong></summary>
      <details>
        <div v-html="juego.description"></div>
      </details>

      <p><strong>Website:</strong> <a :href="juego.website" target="_blank">{{ juego.website }}</a></p>
      <p><strong>Metacritic URL:</strong> <a :href="juego.metacritic_url" target="_blank">{{ juego.metacritic_url }}</a>
      </p>
      <p><strong>Subreddit:</strong> <a :href="juego.reddit_url" target="_blank">{{ juego.reddit_url }}</a></p>

      <p><strong>Estadísticas:</strong></p>
      <ul>
        <li>Total añadidos: {{ juego.added }}</li>
        <li>Completados: {{ juego.added_by_status.beaten }}</li>
        <li>En juego: {{ juego.added_by_status.playing }}</li>
        <li>Abandonados: {{ juego.added_by_status.dropped }}</li>
      </ul>

      <p><strong>Imágenes:</strong></p>
      <div v-if="juego.background_image">
        <img :src="juego.background_image" alt="Imagen principal del juego" width="400px">
      </div>
      <div v-if="juego.background_image_additional">
        <img :src="juego.background_image_additional" alt="Imagen adicional del juego" width="400px">
      </div>
    </div>

    <!-- Mensaje de carga si los datos aún no están disponibles -->
    <p v-else>Cargando...</p>
  </div>
</template>

<style></style>

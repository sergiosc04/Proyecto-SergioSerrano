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
  <div class="container">
    <div v-if="juego" class="juego-detalles">
      <h1 class="titulo"> {{ juego.name }}</h1>

      <!-- Datos principales -->
      <div class="grupo">
        <p><strong>Nombre original:</strong> {{ juego.name_original }}</p>
        <p><strong>Slug:</strong> {{ juego.slug }}</p>
        <p><strong>ID:</strong> {{ juego.id }}</p>
      </div>

      <!-- Descripción -->
      <details class="descripcion">
        <summary><strong>Descripción:</strong></summary>
        <div v-html="juego.description"></div>
      </details>

      <!-- Fechas -->
      <div class="grupo">
        <p><strong>Fecha de lanzamiento:</strong> {{ juego.released }}</p>
        <p><strong>Última actualización:</strong> {{ juego.updated }}</p>
      </div>

      <!-- Géneros -->
      <div class="grupo">
        <p><strong>Género:</strong>
          <span v-for="(genre, index) in juego.genres" :key="index">
            {{ genre.name }}<span v-if="index < juego.genres.length - 1">, </span>
          </span>
        </p>
      </div>

      <!-- Calificaciones -->
      <div class="grupo">
        <p><strong>Calificación:</strong> {{ juego.rating }}/5★ (Más alta: {{ juego.rating_top }}★)</p>
        <p><strong>Metacritic Score:</strong> {{ juego.metacritic }}</p>
        <p><strong>ESRB Rating:</strong> {{ juego.esrb_rating.name }}</p>
      </div>

      <!-- Plataformas -->
      <div class="grupo">
        <p><strong>Plataformas:</strong>
          <span v-for="(platform, index) in juego.parent_platforms" :key="index">
            {{ platform.platform.name }}<span v-if="index < juego.parent_platforms.length - 1">, </span>
          </span>
        </p>
      </div>

      <!-- Devs y editores -->
      <div class="grupo">
        <p><strong>Desarrolladores:</strong>
          <span v-for="(dev, index) in juego.developers" :key="index">
            {{ dev.name }}<span v-if="index < juego.developers.length - 1">, </span>
          </span>
        </p>
        <p><strong>Editores:</strong>
          <span v-for="(pub, index) in juego.publishers" :key="index">
            {{ pub.name }}<span v-if="index < juego.publishers.length - 1">, </span>
          </span>
        </p>
      </div>

      <!-- Tags -->
      <div class="grupo">
        <p><strong>Tags:</strong>
          <span v-for="(tag, index) in juego.tags" :key="index">
            {{ tag.name }}<span v-if="index < juego.tags.length - 1">, </span>
          </span>
        </p>
      </div>



      <!-- Enlaces -->
      <div class="grupo enlaces">
        <p><strong>Website:</strong> <a :href="juego.website" target="_blank">{{ juego.website }}</a></p>
        <p><strong>Metacritic URL:</strong> <a :href="juego.metacritic_url" target="_blank">{{ juego.metacritic_url
            }}</a></p>
        <p><strong>Subreddit:</strong> <a :href="juego.reddit_url" target="_blank">{{ juego.reddit_url }}</a></p>
      </div>

      <!-- Estadísticas -->
      <div class="grupo">
        <p><strong>Estadísticas:</strong></p>
        <ul>
          <li>Total añadidos: {{ juego.added }}</li>
          <li>Completados: {{ juego.added_by_status.beaten }}</li>
          <li>En juego: {{ juego.added_by_status.playing }}</li>
          <li>Abandonados: {{ juego.added_by_status.dropped }}</li>
        </ul>
      </div>

      <!-- Imágenes -->
      <div class="grupo imagenes">
        <div v-if="juego.background_image">
          <img :src="juego.background_image" alt="Imagen principal del juego" />
        </div>
        <div v-if="juego.background_image_additional">
          <img :src="juego.background_image_additional" alt="Imagen adicional del juego" />
        </div>
      </div>
    </div>

    <!-- Cargando -->
    <p v-else class="cargando">Cargando...</p>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
  font-family: sans-serif;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.titulo {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.grupo {
  margin-bottom: 15px;
}

.descripcion {
  margin: 15px 0;
  padding: 10px;
  background-color: #fffef2;
  border-left: 4px solid #ccc;
}

.enlaces a {
  color: #007BFF;
  text-decoration: none;
}

.enlaces a:hover {
  text-decoration: underline;
}

.imagenes img {
  width: 100%;
  max-width: 400px;
  margin-bottom: 10px;
  border-radius: 8px;
}

.cargando {
  text-align: center;
  font-size: 18px;
  color: #888;
}
</style>

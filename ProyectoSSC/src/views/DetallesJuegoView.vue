<script setup>
// Importaciones
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

// Variables reactivas
const juego = ref(null);        // Detalles del juego
const capturas = ref([]);       // Capturas de pantalla
const tiendas = ref([]);        // Tiendas donde se puede comprar el juego

const indiceSlider = ref(0);     // Índice actual del slider
const route = useRoute();       // Acceso a parámetros de ruta

// Función para obtener los detalles del juego
const getDetalleJuegos = async () => {
  try {
    const endpoint = `https://api.rawg.io/api/games/${route.params.slug}?key=9c8533b1b08441e680f0d26ed85dc61b`;
    const response = await axios.get(endpoint);
    juego.value = response.data;
  } catch (error) {
    console.error("Error al obtener los juegos:", error);
  }
};

// Función para obtener capturas de pantalla
const getCapturas = async () => {
  try {
    const endpoint = `https://api.rawg.io/api/games/${route.params.slug}/screenshots?key=9c8533b1b08441e680f0d26ed85dc61b`;
    const response = await axios.get(endpoint);
    capturas.value = response.data.results;
  } catch (error) {
    console.error("Error al obtener las capturas:", error);
  }
};

const getTiendas = async () => {
  try {
    const endpoint = `https://api.rawg.io/api/games/${route.params.slug}/stores?key=9c8533b1b08441e680f0d26ed85dc61b`;
    const response = await axios.get(endpoint);
    tiendas.value = response.data.results;
  } catch (error) {
    console.error("Error al obtener las tiendas:", error);
  }
};

// Función para ir a la siguiente captura
function capSiguiente() {
  if (capturas.value.results?.length) {
    indiceSlider.value = (indiceSlider.value + 1) % capturas.value.results.length; //
  }
}

// Función para ir a la captura anterior
function capAnterior() {
  if (capturas.value.results?.length) {
    indiceSlider.value = (indiceSlider.value - 1 + capturas.value.results.length) % capturas.value.results.length;
  }
}

// Obtener datos cuando el componente se monta
onMounted(() => {
  getDetalleJuegos();
  getCapturas();
  getTiendas();
});
</script>

<template>
  <div class="container">
    <!-- Mostrar detalles del juego si ya está cargado -->
    <div v-if="juego" class="juego-detalles">
      <h1 class="titulo"> {{ juego.name }}</h1>

      <!-- Grupo de datos generales -->
      <div class="grupo">
        <p><strong>Nombre original:</strong> {{ juego.name_original }}</p>
        <p><strong>Slug:</strong> {{ juego.slug }}</p>
        <p><strong>ID:</strong> {{ juego.id }}</p>
      </div>

      <!-- Descripción con desplegable -->
      <details class="descripcion">
        <summary><strong>Descripción:</strong></summary>
        <div v-html="juego.description"></div>
      </details>

      <!-- Fechas de lanzamiento y actualización -->
      <div class="grupo">
        <p><strong>Fecha de lanzamiento:</strong> {{ juego.released }}</p>
        <p><strong>Última actualización:</strong> {{ juego.updated }}</p>
      </div>

      <!-- Géneros del juego -->
      <div class="grupo">
        <p><strong>Géneros: </strong>
          <span v-for="(genre, index) in juego.genres" :key="index">
            {{ genre.name }}<span v-if="index < juego.genres.length - 1">, </span>
          </span>
        </p>
      </div>

      <!-- Calificaciones y puntuaciones -->
      <div class="grupo">
        <p><strong>Calificación:</strong> {{ juego.rating }}/5★</p>
        <p><strong>Puntuación Metacritic:</strong> {{ juego.metacritic }}</p>
        <p><strong>ESRB:</strong> {{ juego.esrb_rating?.name }}</p>
      </div>

      <!-- Plataformas compatibles -->
      <div class="grupo">
        <p><strong>Plataformas:</strong>
          <span v-for="(platform, index) in juego.parent_platforms" :key="index">
            {{ platform.platform.name }}<span v-if="index < juego.parent_platforms.length - 1">, </span>
          </span>
        </p>

        <!-- enlaces de compra -->
        <p><strong>Enlaces de compra:</strong></p>
        <ul>
          <li v-for="(enlace, index) in tiendas" :key="index">
            ID tienda: {{ enlace.store_id }} —
            <a :href="enlace.url" target="_blank">{{ enlace.url }}</a>
          </li>
        </ul>
      </div>

      <!-- Desarrolladores y editores -->
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

      <!-- Etiquetas relacionadas -->
      <div class="grupo">
        <p><strong>Tags:</strong>
          <span v-for="(tag, index) in juego.tags" :key="index">
            {{ tag.name }}<span v-if="index < juego.tags.length - 1">, </span>
          </span>
        </p>
      </div>

      <!-- Enlaces importantes -->
      <div class="grupo enlaces">
        <p><strong>Website:</strong> <a :href="juego.website" target="_blank">{{ juego.website }}</a></p>
        <p><strong>Metacritic URL:</strong> <a :href="juego.metacritic_url" target="_blank">{{ juego.metacritic_url
        }}</a></p>
        <p><strong>Subreddit:</strong> <a :href="juego.reddit_url" target="_blank">{{ juego.reddit_url }}</a></p>
      </div>

      <!-- Estadísticas de jugadores -->
      <div class="grupo">
        <p><strong>Estadísticas:</strong></p>
        <ul>
          <li>Total añadidos: {{ juego.added }}</li>
          <li>Completados: {{ juego.added_by_status?.beaten }}</li>
          <li>En juego: {{ juego.added_by_status?.playing }}</li>
          <li>Abandonados: {{ juego.added_by_status?.dropped }}</li>
        </ul>
      </div>

      <!-- slider capturas de pantalla -->
      <div class="grupo imagenes" v-if="capturas.results?.length">
        <h2>Capturas de pantalla:</h2>
        <p>Recogidas desde el endpoint /screenshots.</p>
        <div class="slider">

          <img :src="capturas.results[indiceSlider].image" class="slide-img" alt="Captura de pantalla" /><br>
          <button @click="capAnterior()">Anterior</button> Imagen {{ indiceSlider + 1 }}/{{ capturas.count }}
          <button @click="capSiguiente()">Siguiente</button>
        </div>
      </div>

      <!-- Imagen principal y adicional -->

      <div class="grupo imagenes">
        <h2>Imagenes adicionales:</h2>
        <p>Recogidas desde el endpoint de detalles.</p>
        <img v-if="juego.background_image" :src="juego.background_image" alt="Imagen principal del juego" />
        <img v-if="juego.background_image_additional" :src="juego.background_image_additional"
          alt="Imagen adicional del juego" />
      </div>

      <!-- Slider de capturas de pantalla -->

    </div>

    <!-- Mostrar mensaje si aún no se cargó el juego -->
    <p v-else class="cargando">Cargando...</p>
  </div>
</template>



<style scoped>
.slider {
  position: relative;
  text-align: center;
}

.slider img {
  width: 100%;
  max-width: 500px;
  border-radius: 10px;
}

.slider-controles {
  margin-top: 10px;
}

.slider-controles button {
  background-color: #444;
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 0 5px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
}


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
  margin: 3px;
  color: #333;
  display: flex;
  align-items: center;

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

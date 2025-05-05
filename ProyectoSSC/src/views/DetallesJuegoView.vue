<script setup>
// Importaciones
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

// Variables reactivas
const juego = ref(null);        // Detalles del juego
const capturas = ref([]);       // Capturas de pantalla
const tiendas = ref([]);        // Tiendas donde se puede comprar el juego
const detallesTiendas = ref([]); // Detalles de las tiendas

const indiceSlider = ref(0);     // Índice actual del slider
const route = useRoute();       // Acceso a parámetros de ruta

//Importamos la clave del .env
const claveAPI = import.meta.env.VITE_RAWG_API_KEY;

// Función para obtener los detalles del juego
const getDetalleJuegos = async () => {
  try {
    const endpoint = `https://api.rawg.io/api/games/${route.params.slug}?key=${claveAPI}`;
    const response = await axios.get(endpoint);
    juego.value = response.data;
  } catch (error) {
    console.error("Error al obtener los juegos:", error);
  }
};


//Funciones de capturas de pantalla-----------------
// Función para obtener capturas de pantalla
const getCapturas = async () => {
  try {
    const endpoint = `https://api.rawg.io/api/games/${route.params.slug}/screenshots?key=${claveAPI}`;
    const response = await axios.get(endpoint);
    capturas.value = response.data.results;
    console.log("capturas.value");
    console.log(capturas.value); // Verifica la respuesta de capturas
  } catch (error) {
    console.error("Error al obtener las capturas:", error);
  }
};

// Función para ir a la siguiente captura

//si indiceSlider.value + 1 iguala o supera capturas.value.length se reinicia a 0 creando un bucle
function capSiguiente() {
  if (capturas.value.length) {
    indiceSlider.value = (indiceSlider.value + 1) % capturas.value.length;
  }
}

// Función para ir a la captura anterior
function capAnterior() {
  if (capturas.value.length) {
    indiceSlider.value = (indiceSlider.value - 1 + capturas.value.length) % capturas.value.length;
  }
}

//Funciones de tiendas -------------------------

//funcion para obtener detalles de las tiendas (necesario para poner el nombre, por ejemplo)
const getDetallesTiendas = async () => {
  try {
    const endpoint = `https://api.rawg.io/api/stores?key=${claveAPI}`;
    const response = await axios.get(endpoint);
    detallesTiendas.value = response.data.results;
    console.log("detallesTiendas.value");
    console.log(detallesTiendas.value); // Verifica la respuesta de tiendas
  } catch (error) {
    console.error("Error al obtener las tiendas:", error);
  }
}

//Función para obtener tiendas del juego especifico
const getTiendas = async () => {
  try {
    const endpoint = `https://api.rawg.io/api/games/${route.params.slug}/stores?key=${claveAPI}`;
    const response = await axios.get(endpoint);
    tiendas.value = response.data.results;

    console.log("tiendas.value");
    console.log(tiendas.value); // Verifica la respuesta de tiendas
  } catch (error) {
    console.error("Error al obtener las tiendas:", error);
  }
};

// Obtener datos cuando el componente se monta
onMounted(() => {
  getDetalleJuegos();
  getCapturas();
  getTiendas();
  getDetallesTiendas();
});

</script>

<template>
  <h1 v-if="juego" class="titulo" align="center"> {{ juego.name }}</h1>
  <div class="container">

    <!-- Mostrar detalles del juego si ya está cargado -->
    <div v-if="juego" class="juego-detalles">


      <!-- Grupo de datos generales -->
      <div class="datosGenerales">
        <h2>Datos del juego</h2>
        <p><strong>Nombre original:</strong> {{ juego.name_original || "No disponible" }}</p>
        <p><strong>Slug:</strong> {{ juego.slug || "No disponible" }}</p>
        <p><strong>ID:</strong> {{ juego.id || "No disponible" }}</p>
      </div>

      <!-- Descripción con desplegable -->
      <div class="descripcion">
        <details>
          <summary><strong>Desplegar descripción...</strong></summary>
          <div v-html="juego.description"></div>
        </details>
      </div>
      <!-- Fechas de lanzamiento y actualización -->
      <div class="fechas">
        <h2>Fechas relevantes</h2>
        <p><strong>Fecha de lanzamiento:</strong> {{ juego.released || "No disponible" }}</p>
        <p><strong>Última actualización:</strong> {{ juego.updated || "No disponible" }}</p>
      </div>

      <!-- Géneros del juego -->
      <div class="generos">
        <h2>Géneros</h2>
        <span v-for="(genre, index) in juego.genres" :key="index">
          {{ genre.name }}<span v-if="index < juego.genres.length - 1">, </span>
        </span>

      </div>

      <!-- Calificaciones y puntuaciones -->
      <div class="calificaciones">
        <h2>Calificaciones</h2>
        <p><strong>Calificación:</strong> {{ juego.rating || "No disponible" }}/5★</p>
        <p><strong>Puntuación Metacritic:</strong> {{ juego.metacritic || "No disponible" }}</p>
        <p><strong>ESRB:</strong> {{ juego.esrb_rating?.name || "No disponible" }}</p>
      </div>

      <!-- Plataformas compatibles -->
      <div class="plataformas">
        <h2>Plataformas</h2>
        <span v-for="(plataforma, index) in juego.parent_platforms" :key="index">
          {{ plataforma.platform.name || "No disponible" }}<span v-if="index < juego.parent_platforms.length - 1">,
          </span>
        </span>
      </div>

      <!-- enlaces de compra -->
      <div class="enlacesCompra">
        <h2>Enlaces de compra</h2>
        <span style="font-style: italic;">Es posible que los enlaces estén incorrectos, la respuesta de la api de las
          tiendas devuelve una id de tienda que no se corresponde con el id de tienda que devuelve el endpoint de
          enlaces.</span>
        <ul>
          <li v-for="(enlace, index) in tiendas" :key="index">
            ID de tienda: {{ enlace.store_id + 2 || "No disponible" }}<br>
            {{ detallesTiendas[enlace.store_id + 2]?.name || "No disponible" }} —
            <a :href="enlace.url" target="_blank">{{ enlace.url || "No disponible" }}</a>
          </li>
        </ul>
      </div>

      <!-- Desarrolladores y editores -->
      <div class="desarrolladores">
        <h2>Desarrolladores y editores</h2>
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

      <!-- tags -->
      <div class="tags">
        <h2>Tags</h2>
        <span v-for="(tag, index) in juego.tags" :key="index">
          {{ tag.name }}<span v-if="index < juego.tags.length - 1">, </span>
        </span>
      </div>

      <!-- Enlaces varios -->
      <div class="enlaces">
        <h2>Enlaces varios</h2>
        <p><strong>Website:</strong> <a :href="juego.website" target="_blank">{{ juego.website || "No disponible" }}</a>
        </p>
        <p><strong v-if="juego.metacritic_url">Metacritic URL:</strong> <a :href="juego.metacritic_url"
            target="_blank">{{ juego.metacritic_url }}</a></p>
        <p v-if="juego.reddit_url"><strong>Subreddit:</strong> <a :href="juego.reddit_url" target="_blank">{{
          juego.reddit_url }}</a></p>
      </div>

      <!-- Estadísticas de jugadores -->
      <div class="estadisticas">
        <h2>Estadísticas de jugadores</h2>
        <ul>
          <li>Total añadidos: {{ juego.added || "No disponible" }}</li>
          <li>Completados: {{ juego.added_by_status?.beaten || "No disponible" }}</li>
          <li>En juego: {{ juego.added_by_status?.playing || "No disponible" }}</li>
          <li>Abandonados: {{ juego.added_by_status?.dropped || "No disponible" }}</li>
        </ul>
      </div>
    </div>

    <div v-if="juego" class="containerFotos">
      <div class="slider">
        <h2>Capturas de pantalla:</h2>
        <p>(Recogidos del endpoint /screenshots)</p>
        <div v-if="capturas.length > 0" class="slider">

          <img :src="capturas[indiceSlider].image" class="slide-img" />

          <div class="controlesSlider">
            <button @click="capAnterior"> ⇐ Anterior</button>
            <span> &nbsp; Imagen {{ indiceSlider + 1 || "No disponible" }} de {{ capturas.length || "No disponible" }}
              &nbsp; </span>
            <button @click="capSiguiente">Siguiente ⇒</button>

          </div>
        </div>
      </div>
      <br>
      <!-- Imagen principal y adicional -->
      <div class="containerAdicionales">
        <h2>Imagenes adicionales:</h2>
        <p>(Recogidas desde el endpoint de detalles)</p>
        <div class="imagenesAdicionales">

          <img v-if="juego.background_image" :src="juego.background_image" alt="Imagen principal del juego" />
          <img v-if="juego.background_image_additional" :src="juego.background_image_additional"
            alt="Imagen adicional del juego" />
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.datos,
.datosGenerales,
.fechas,
.generos,
.calificaciones,
.plataformas,
.desarrolladores,
.tags,
.enlaces,
.enlacesCompra,
.estadisticas,
.descripcion {
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f9f9fc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.container {
  margin-left: 10vw;
  margin-right: 10vw;
  padding: 20px;
  font-family: sans-serif;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border: solid 1px black;
  display: flex;
  flex-direction: row;
  /* Añadido para prevenir desbordamiento */
  box-sizing: border-box;
  overflow: hidden;
  /* Oculta cualquier contenido que pueda desbordar */
}

/* Asegurar que las imágenes no causen desbordamiento */
.slider img {
  max-width: 100%;
  max-height: 400px;
  margin-bottom: 10px;
  border-radius: 10px;
  /* Añadido para asegurar que las imágenes respeten el ancho del contenedor */
  width: auto;
  height: auto;
  object-fit: contain;
}

.imagenesAdicionales {
  display: flex;
  flex-wrap: wrap;
  /* Cambiado de 'flex-direction: wrap' a 'flex-wrap: wrap' */
  gap: 5px;
  /* Añadido para prevenir desbordamiento horizontal */
  justify-content: center;
}

.imagenesAdicionales img {
  max-width: 100%;
  /* Cambiado de 300px a 100% para que se ajuste al contenedor */
  max-height: 150px;
  /* Añadido límite de altura */
  margin-bottom: 10px;
  border-radius: 10px;
  /* Añadido para mejor ajuste de imágenes */
  width: auto;
  height: auto;
  object-fit: cover;
}

/* Ajuste para los contenedores internos */
.container>.juego-detalles,
.container>.containerFotos {
  width: 50%;
  /* Añadido para prevenir desbordamiento */
  box-sizing: border-box;
  padding: 10px;
  overflow: auto;
  /* Añade scroll si el contenido es demasiado grande */
}
</style>
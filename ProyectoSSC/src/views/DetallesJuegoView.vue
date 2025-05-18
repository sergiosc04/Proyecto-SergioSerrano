<script setup>
// Importaciones
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import SpinnerCarga from '@/components/SpinnerCarga.vue';

// Variables reactivas
const juego = ref(null);
const capturas = ref([]);
const tiendas = ref([]);
const detallesTiendas = ref([]);
const indiceSlider = ref(0);
const cargando = ref(true);
const route = useRoute();
const router = useRouter();
const imagenCargando = ref(true);

// Importar las imágenes
import steamIcon from '../assets/img/tiendas/steam.png';
import xboxIcon from '../assets/img/tiendas/xbox.png';
import playstationIcon from '../assets/img/tiendas/playstation.png';
import appleIcon from '../assets/img/tiendas/apple.png';
import gogIcon from '../assets/img/tiendas/gog.png';
import nintendoIcon from '../assets/img/tiendas/nintendo.png';
import xbox360Icon from '../assets/img/tiendas/xbox360.png';
import googlePlayIcon from '../assets/img/tiendas/google-play.png';
import itchIcon from '../assets/img/tiendas/itch-io.png';
import epicIcon from '../assets/img/tiendas/epic-games.png';

const tiendaIconos = {
  1: steamIcon,
  2: xboxIcon,
  3: playstationIcon,
  4: appleIcon,
  5: gogIcon,
  6: nintendoIcon,
  7: xbox360Icon,
  8: googlePlayIcon,
  9: itchIcon,
  11: epicIcon
};

// Importamos la clave del .env
const claveAPI = import.meta.env.VITE_RAWG_API_KEY;

// Función para obtener los detalles del juego
const getDetalleJuegos = async () => {
  try {
    cargando.value = true;
    const endpoint = `https://api.rawg.io/api/games/${route.params.slug}?key=${claveAPI}`;
    const response = await axios.get(endpoint);
    juego.value = response.data;
  } catch (error) {
    console.error("Error al obtener los juegos:", error);
  } finally {
    cargando.value = false;
  }
};

// Función para obtener capturas de pantalla
const getCapturas = async () => {
  try {
    const endpoint = `https://api.rawg.io/api/games/${route.params.slug}/screenshots?key=${claveAPI}`;
    const response = await axios.get(endpoint);
    capturas.value = response.data.results;
  } catch (error) {
    console.error("Error al obtener las capturas:", error);
  }
};

// Navegación en el slider
function capSiguiente() {
  if (capturas.value.length) {
    indiceSlider.value = (indiceSlider.value + 1) % capturas.value.length;
  }
}

function capAnterior() {
  if (capturas.value.length) {
    indiceSlider.value = (indiceSlider.value - 1 + capturas.value.length) % capturas.value.length;
  }
}

// Funciones de tiendas
const getDetallesTiendas = async () => {
  try {
    const endpoint = `https://api.rawg.io/api/stores?key=${claveAPI}`;
    const response = await axios.get(endpoint);
    detallesTiendas.value = response.data.results;
  } catch (error) {
    console.error("Error al obtener las tiendas:", error);
  }
}

const getTiendas = async () => {
  try {
    const endpoint = `https://api.rawg.io/api/games/${route.params.slug}/stores?key=${claveAPI}`;
    const response = await axios.get(endpoint);
    tiendas.value = response.data.results;
  } catch (error) {
    console.error("Error al obtener las tiendas:", error);
  }
};

function obtenerNombreTienda(storeId) {
  const tienda = detallesTiendas.value.find(tienda => tienda.id === storeId);
  return tienda ? tienda.name : "No disponible";
}

const juegoParaColeccion = () => {
  const idGuardar = juego.value.id;
  router.push({ 
    name: 'coleccion', 
    query: { idRecibido: idGuardar } 
  });
};

const manejarCargaImagen = () => {
  imagenCargando.value = false;
};

const cambiarImagen = (direccion) => {
  imagenCargando.value = true;
  if (direccion === 'siguiente') {
    capSiguiente();
  } else {
    capAnterior();
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
  <!-- Pantalla de carga -->
  <div v-if="cargando" class="contenedorCarga">
    <SpinnerCarga />
    <p>Cargando detalles del juego...</p>
  </div>

  <!-- Contenido principal -->
  <div v-else-if="juego" class="contenedorPrincipal">
    <!-- Cabecera del juego -->
    <header class="cabeceraJuego">
      <h1 class="tituloJuego">{{ juego.name }}</h1>
      <p class="subtituloJuego">{{ juego.released || "Fecha no disponible" }}</p>
      <button class="botonPrimario" @click="juegoParaColeccion()">Añadir a colección</button>
    </header>

    <div class="contenidoFlex">
      <!-- Panel izquierdo: Capturas y datos clave -->

      <aside class="panelIzquierdo">

        <!-- Datos clave -->
        <div class="tarjetaInfo">
          <h2 class="tituloSeccion">Calificaciones</h2>
          <div class="datosCalificacion">
            <div class="itemCalificacion">
              <span class="valorCalificacion">{{ juego.rating || "N/A" }}</span>
              <span class="etiquetaCalificacion">Rating</span>
            </div>
            <div class="itemCalificacion">
              <span class="valorCalificacion">{{ juego.metacritic || "N/A" }}</span>
              <span class="etiquetaCalificacion">Metacritic</span>
            </div>
            <div class="itemCalificacion">
              <span class="valorCalificacion">{{ juego.esrb_rating?.name || "N/A" }}</span>
              <span class="etiquetaCalificacion">ESRB</span>
            </div>
          </div>
        </div>

          <!-- Estadísticas de jugadores -->
          <section class="seccionInfo">
            <h2 class="tituloSeccion">Estadísticas de jugadores</h2>

            <ul class="listaEstadisticas">
              <li class="itemEstadistica">
                <span class="valorEstadistica">{{ juego.added || "0" }}</span>
                <span class="etiquetaEstadistica">Total añadidos</span>
              </li>
              <li class="itemEstadistica">
                <span class="valorEstadistica">{{ juego.added_by_status?.beaten || "0" }}</span>
                <span class="etiquetaEstadistica">Completados</span>
              </li>
              <li class="itemEstadistica">
                <span class="valorEstadistica">{{ juego.added_by_status?.playing || "0" }}</span>
                <span class="etiquetaEstadistica">En juego</span>
              </li>
              <li class="itemEstadistica">
                <span class="valorEstadistica">{{ juego.added_by_status?.dropped || "0" }}</span>
                <span class="etiquetaEstadistica">Abandonados</span>
              </li>
            </ul>
          </section>
        <!-- Plataformas -->
        <div class="tarjetaInfo">
          <h2 class="tituloSeccion">Plataformas</h2>
          <div class="listaTags">
            <span v-for="(plataforma, index) in juego.parent_platforms" :key="index" class="tag">
              {{ plataforma.platform.name }}
            </span>
          </div>
        </div>

        <!-- Enlaces de compra -->
        <div class="tarjetaInfo" v-if="tiendas.length > 0">
          <h2 class="tituloSeccion">Dónde comprar</h2>
          <ul class="listaEnlaces">

            <li v-for="(enlace, index) in tiendas" :key="index" class="itemEnlace">
              <a :href="enlace.url" target="_blank" class="botonTienda">
                <img :src="tiendaIconos[enlace.store_id]" :alt="obtenerNombreTienda(enlace.store_id)"
                  class="iconoTienda" />
                {{ obtenerNombreTienda(enlace.store_id) }}
              </a>

            </li>
          </ul>
        </div>


        
        <section class="seccionInfo">
          <h2 class="tituloSeccion">Datos técnicos</h2>

          <div class="gridInfoTecnica">

            <div class="itemInfoTecnica">
              <span class="etiquetaInfoTecnica">ID</span>
              <span class="valorInfoTecnica">{{ juego.id || "No disponible" }}</span>
            </div>

            <div class="itemInfoTecnica">
              <span class="etiquetaInfoTecnica">Slug</span>
              <span class="valorInfoTecnica">{{ juego.slug || "No disponible" }}</span>
            </div>

            <div class="itemInfoTecnica">
              <span class="etiquetaInfoTecnica">Nombre original</span>
              <span class="valorInfoTecnica">{{ juego.name_original || "No disponible" }}</span>
            </div>

            <div class="itemInfoTecnica">
              <span class="etiquetaInfoTecnica">Lanzamiento</span>
              <span class="valorInfoTecnica">{{ juego.released || "No disponible" }}</span>
            </div>

            <div class="itemInfoTecnica">
              <span class="etiquetaInfoTecnica">Última actualización</span>
              <span class="valorInfoTecnica">{{ juego.updated || "No disponible" }}</span>
            </div>

          </div>

        </section>
      </aside>

      <!-- Panel derecho: Detalles e información -->
      <main class="panelDerecho">


        
        <!-- Slider de imágenes -->
        <section class="seccionInfo">
          <h2 class="tituloSeccion">Capturas del juego</h2>

          <div v-if="capturas.length > 0" class="sliderGaleria">
            <div class="contenedorImagen">

              <SpinnerCarga v-if="imagenCargando" class="spinnerImagen"/>
              <img 
                :src="capturas[indiceSlider].image" 
                class="imagenCaptura" 
                :class="{ 'oculto': imagenCargando }"
                alt="Captura del juego" 
                @load="manejarCargaImagen"
              />
            </div>

            <div class="controlesSlider">
              <button @click="() => cambiarImagen('anterior')" class="botonControl">⇐</button>
              <span class="contadorImagenes">Imagen {{ indiceSlider + 1 }} de {{ capturas.length }}</span>
              <button @click="() => cambiarImagen('siguiente')" class="botonControl">⇒</button>
            </div>

          </div>
        </section>
        
        <!-- Descripción -->
        <section class="seccionInfo">
          <h2 class="tituloSeccion">Descripción</h2>
          <div v-html="juego.description" class="contenidoDescripcion"></div>
        </section>

        <!-- Información general -->
        <div class="infoGrid">
          <!-- Géneros -->
          <section class="seccionInfo">
            <h2 class="tituloSeccion">Géneros</h2>
            <div class="listaTags">
              <span v-for="(genre, index) in juego.genres" :key="index" class="tag">
                {{ genre.name }}
              </span>
            </div>
          </section>

          <!-- Desarrolladores y editores -->
          <section class="seccionInfo">
            <h2 class="tituloSeccion">Desarrolladores y editores</h2>

            <div class="grupoInfo">
              <h3 class="subtituloInfo">Desarrolladores:</h3>

              <div class="listaTags">
                <span v-for="(dev, index) in juego.developers" :key="index" class="tag">
                  {{ dev.name }}
                </span>
              </div>
            </div>
            <div class="grupoInfo">
              <h3 class="subtituloInfo">Editores:</h3>

              <div class="listaTags">
                <span v-for="(pub, index) in juego.publishers" :key="index" class="tag">
                  {{ pub.name }}
                </span>
              </div>
            </div>
          </section>
        </div>

        <!-- Tags -->
        <section class="seccionInfo">
          <h2 class="tituloSeccion">Tags</h2>
          <div class="listaTags">
            <span v-for="(tag, index) in juego.tags" :key="index" class="tag">
              {{ tag.name }}
            </span>
          </div>
        </section>
      </main>
    </div>
  </div>

  <!-- Mensaje de error -->
  <div v-else class="contenedorError">
    <div class="mensajeError">
      <h2>No se pudo cargar la información del juego</h2>
      <p>Por favor, intenta nuevamente más tarde</p>
    </div>
  </div>
</template>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  background-color: #1a1c2e;
  min-height: 100vh;
  width: 100%;
}

/* Estilos principales */
.contenedorPrincipal {
  min-height: 100vh;
  width: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #1a1c2e;
  padding: 2rem;
}

.cabeceraJuego {
  text-align: center;
  margin: 0 auto 2rem auto;
  max-width: 1400px;
  background: linear-gradient(90deg, #1f2136, #252744, #1f2136);
  padding: 1.5rem;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  border: 1px solid #333654;
}

.cabeceraJuego::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(45deg, #d000ff, #00d9ff);
}

.tituloJuego {
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 0 15px rgba(208, 0, 255, 0.3);
}

.subtituloJuego {
  color: #a4a8e0;
  margin-top: 0.5rem;
  font-size: 1rem;
}

.contenidoFlex {
  display: flex;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Panel izquierdo (capturas y datos rápidos) */
.panelIzquierdo {
  flex: 1;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.sliderGaleria {
  background-color: #1f2136;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #333654;
  padding: 10px;
}

.contenedorImagen {
  position: relative;
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinnerImagen {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.imagenCaptura {
  width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 10px;
  transition: opacity 0.1s ease;
}

.imagenCaptura.oculto {
  opacity: 0;
}

.controlesSlider {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.botonControl {
  background: #5d5fef;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
}

.botonControl:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.contadorImagenes {
  color: #a4a8e0;
  font-size: 14px;
}

.tarjetaInfo {
  background-color: #1f2136;
  border-radius: 12px;
  padding: 1.25rem;
  border: 1px solid #333654;
}

.datosCalificacion {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.itemCalificacion {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.valorCalificacion {
  font-size: 1.5rem;
  font-weight: bold;
  color: #ffffff;
}

.etiquetaCalificacion {
  color: #a4a8e0;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.listaEnlaces {
  list-style: none;
  padding: 0;
  margin: 0.75rem 0 0;
}

.itemEnlace {
  margin-bottom: 0.5rem;
}

.botonTienda {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(90deg, #2c2e48, #252744);
  color: #00d9ff;
  text-decoration: none;
  padding: 0.75rem;
  border-radius: 6px;
  text-align: left;
  border: 1px solid #333654;
  transition: all 0.2s;
}

.botonTienda:hover {
  background: linear-gradient(90deg, #252744, #2c2e48);
  transform: translateY(-2px);
  border-color: #00d9ff;
}

.iconoTienda {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

/* Panel derecho (información detallada) */
.panelDerecho {
  background-color: 1a1c2e;
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.seccionInfo {
  background-color: #1f2136;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #333654;
}

.tituloSeccion {
  color: #ffffff;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #333654;
  position: relative;
}

.tituloSeccion::before {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 50px;
  height: 2px;
  background: linear-gradient(to right, #d000ff, #00d9ff);
}

.botonDesplegar {
  background: linear-gradient(90deg, #252744, #2c2e48);
  color: #ffffff;
  padding: 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #333654;
  font-weight: 500;
  transition: background 0.2s;
}

.botonDesplegar:hover {
  background: linear-gradient(90deg, #2c2e48, #333a5f);
}

.contenidoDescripcion {
  margin-top: 1rem;
  color: #c3c7f7;
  line-height: 1.6;
}

.infoGrid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.grupoInfo {
  margin-bottom: 1rem;
}

.subtituloInfo {
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
  text-align: left;
}

.listaTags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  background: linear-gradient(90deg, #2c2e48, #252744);
  color: #a4a8e0;
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  border: 1px solid #333654;
}

.enlaceExterno {
  color: #00d9ff;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  transition: color 0.2s;
}

.enlaceExterno:hover {
  color: #d000ff;
  text-decoration: underline;
}

.listaEstadisticas {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 0;
  list-style: none;
  margin: 0.5rem 0 0;
}

.itemEstadistica {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #1a1c2e;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #333654;
}

.valorEstadistica {
  font-size: 1.25rem;
  font-weight: bold;
  color: #ffffff;
}

.etiquetaEstadistica {
  color: #a4a8e0;
  font-size: 0.8rem;
  margin-top: 0.25rem;
}

.gridInfoTecnica {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.itemInfoTecnica {
  display: flex;
  flex-direction: column;
  background: #1a1c2e;
  padding: 0.75rem;
  border-radius: 8px;
  border: 1px solid #333654;
}

.etiquetaInfoTecnica {
  color: #a4a8e0;
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
}

.valorInfoTecnica {
  color: #ffffff;
  word-break: break-word;
}

/* Pantallas de carga y error */
.contenedorCarga {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1a1c2e;
  color: #ffffff;
}

.contenedorError {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1a1c2e;
}

.mensajeError {
  background-color: #291e23;
  border: 1px solid #ff5555;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  color: #ff5555;
  max-width: 500px;
}

/* Responsive */
@media (max-width: 1100px) {
  .contenidoFlex {
    flex-direction: column;
  }

  .panelIzquierdo {
    max-width: 100%;
  }

  .infoGrid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .contenedorPrincipal {
    padding: 1rem;
  }

  .tituloJuego {
    font-size: 1.75rem;
  }

  .gridInfoTecnica {
    grid-template-columns: 1fr;
  }

  .listaEstadisticas {
    grid-template-columns: 1fr;
  }
}
</style>
<script setup>
import { onMounted } from 'vue';
import tarjetaJuego from '../components/tarjetaJuego.vue';
import Paginacion from '../components/paginacion.vue';
import { getJuegos } from '../compostables/obtenerJuegos';
import SpinnerCarga from '@/components/SpinnerCarga.vue';
import { useSessionStore } from '../stores/session.js';
import BannerJuego from '@/components/bannerJuego.vue';
import { useObtenerNombreUsuario } from '../compostables/obtenerNombreUsuario';
import { obtenerColecciones } from '../compostables/obtenerColecciones';

const sessionStore = useSessionStore();
const { nombreUsuario, obtenerUsername } = useObtenerNombreUsuario();
const { colecciones, loading: loadingColecciones, getIdAuth } = obtenerColecciones();

const {
  juegos,
  cargando,
  obtenerJuegos,
} = getJuegos();

// Cargar los juegos cuando se monte el componente
onMounted(async () => {
  sessionStore.recuperarSesion();
  await obtenerJuegos();
  await obtenerUsername();
  await getIdAuth();

  if (sessionStore.session) {
    console.log('Sesión recuperada:', sessionStore.session);
  } else {
    console.log('No hay sesión activa.');
  }
});
</script>

<template>
  <main>
    <div v-if="cargando" class="loading-container">
      <SpinnerCarga />
      <br><strong>Cargando inicio...</strong>
    </div>

    <div v-else>
      <!-- Banner que muestra un juego aleatorio destacado -->
      <BannerJuego v-if="juegos && juegos.length > 0" :juegos="juegos" />

      <div class="contenedorJuegos">

        <!-- Listado de juegos cuando no está cargando -->
        <div class="titulos">

          <span v-if="sessionStore.session">
            <span class="titulo" v-if="nombreUsuario">
              ¡Bienvenido de vuelta, <strong> {{ nombreUsuario || "usuario" }}!</strong>

              <p class="subtitulo">Aquí tienes una selección aleatoria de juegos para ti:</p>
            </span>
          </span>

          <span v-else class="">
            <div class="titulo">¡Bienvenido a <strong>PixelRift!</strong></div><br>

            <router-link to="/cuenta/" class="subtitulo" align="center">Regístrate o Inicia Sesión</router-link> para
            acceder a tu cuenta y guardar tus juegos favoritos.

            <p>Mientras tanto, echa un vistazo a nuestro catálogo:</p>
          </span>

        </div>

        <!-- Listado de 10 juegos aleatorios cada vez que carga la pagina -->


        <p v-if="cargando">
          <SpinnerCarga />
          <br><strong>Cargando juegos...</strong>
          <br>
        </p>

        <div v-else class="listadoJuegos">
          <tarjetaJuego v-for="juego in juegos.slice(0, 10)" :key="juego.id" :juego="juego" />
        </div>

        <br>
        <br>



      </div>

      <br>
      <hr>
      <br>

      <!-- Sección de colecciones -->
      <div class="coleccionesContainer">
        <div class="titulo">Tus <strong>Colecciones</strong></div>

        <router-link to="/coleccion/" align="center" class="botonVerColecciones">
          <button class="botonPrimario">Ver todas las colecciones</button>
        </router-link>

        <!-- Muestra de colecciones del usuario con menos detalles para optimizar la carga inicial -->

        <div v-if="sessionStore.session" class="colecciones-preview">

          <div v-if="loadingColecciones">
            <SpinnerCarga />
            <p>Cargando colecciones...</p>
          </div>

          <div v-else-if="colecciones && colecciones.length > 0" class="lista-colecciones">
            <div v-for="coleccion in colecciones" :key="coleccion.idcoleccion" class="coleccion-item">
              <h3>{{ coleccion.nombreColeccion }}</h3>

              <h5 v-if="coleccion.datosentrada.juegos.length"> Esta colección tiene {{
                coleccion.datosentrada.juegos.length
              }} juegos. </h5>

              <h5 v-else> Esta colección no tiene juegos aún.</h5>

              <router-link to="/coleccion"><button class="botonSecundario">Ver colección</button></router-link>

            </div>

          </div>

        </div>

        <div v-else>
          <p>Inicia sesión para ver tus colecciones</p>
          <router-link to="/cuenta/"><button>Iniciar sesión</button></router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.botonVerColecciones {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.titulos {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 2rem;
}

.colecciones-preview {
  margin-left: 13%;
  margin-right: 13%;
  padding: 1rem;
}

.preguntas {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 1rem;
}

.lista-colecciones {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.coleccion-item {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sin-colecciones {
  text-align: center;
  padding: 2rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>
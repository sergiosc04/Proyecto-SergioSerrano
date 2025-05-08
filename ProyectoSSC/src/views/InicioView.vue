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
  await getIdAuth(); // Añadimos la carga de colecciones

  if (sessionStore.session) {
    console.log('Sesión recuperada:', sessionStore.session);
  } else {
    console.log('No hay sesión activa.');
  }
});
</script>

<template>
  <main>
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

      <div v-if="!cargando" class="listadoJuegos">
        <tarjetaJuego v-for="juego in juegos.slice(0, 10)" :key="juego.id" :juego="juego" />
      </div>

      <p v-else align="center">
        <SpinnerCarga />
        <br><strong>Cargando...</strong>
      </p>
      <br>
      <span class="titulo2"> <strong> ¿Buscas algo en específico?</strong></span>
      <router-link to="/buscar"><br>
        <button class="botonPrimario">Explorar catálogo completo</button>
      </router-link>
    </div>

    <br>
    <hr>
    <br>


    <!-- Sección de colecciones -->

    <div class="titulo">Tus <strong>Colecciones</strong></div>

    <div>
      <h3>¿Quieres administrar tus colecciones?</h3>
      <router-link to="/coleccion"><button class="botonPrimario">Ver colecciones</button></router-link>
    </div>


    <!-- Muestra de colecciones del usuario con menos detalles para optimizar la carga inicial -->
    <div v-if="sessionStore.session" class="colecciones-preview">

      <div v-if="loadingColecciones">
        <SpinnerCarga />
        <p>Cargando colecciones...</p>
      </div>

      <div v-else-if="colecciones && colecciones.length > 0" class="lista-colecciones">
        <div v-for="coleccion in colecciones" :key="coleccion.idcoleccion" class="coleccion-item">
          <h3>{{ coleccion.nombreColeccion }}</h3>

          <h5 v-if="coleccion.datosentrada.juegos.length"> Esta colección tiene {{ coleccion.datosentrada.juegos.length
          }} juegos. </h5>

          <h5 v-else> Esta colección no tiene juegos aún.</h5>

          <router-link to="/coleccion"><button class="botonSecundario">Ver colecciones</button></router-link>

        </div>
      </div>

    </div>

    <div v-else>
      <p>Inicia sesión para ver tus colecciones</p>
      <router-link to="/cuenta/"><button>Iniciar sesión</button></router-link>
    </div>
  </main>
</template>

<style scoped>
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
</style>
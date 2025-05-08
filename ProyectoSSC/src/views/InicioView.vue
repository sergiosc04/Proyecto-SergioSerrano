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

      <div v-if="!cargando" class="listadoJuegos">
        <tarjetaJuego v-for="juego in juegos.slice(0, 10)" :key="juego.id" :juego="juego" />
      </div>

      <p v-else align="center">
        <SpinnerCarga />
        <br><strong>Cargando...</strong>
      </p>

      <router-link to="/buscar"><br>
        <button>Explorar catálogo completo</button>
      </router-link>
    </div>
    <hr>
    <div class="titulo">Tus <strong>Colecciones</strong></div>

    <div v-if="sessionStore.session" class="colecciones-preview">
      <div v-if="loadingColecciones">
        <SpinnerCarga />
        <p>Cargando colecciones...</p>
      </div>

      <div v-else-if="colecciones && colecciones.length > 0" class="lista-colecciones">
        <div v-for="coleccion in colecciones.slice(0, 2)" :key="coleccion.idcoleccion" class="coleccion-item">
          <h3>{{ coleccion.nombreColeccion }}</h3>
          <!-- Puedes añadir más detalles de la colección aquí -->
        </div>
        <router-link to="/coleccion"><button>Ver todas</button></router-link>
      </div>

      <div v-else class="sin-colecciones">
        <p>No tienes colecciones creadas</p>
        <router-link to="/coleccion"><button>Crear colección</button></router-link>
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
  margin: 2rem 0;
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
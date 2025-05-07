<script setup>
import { ref, onMounted } from 'vue';
import tarjetaJuego from '../components/tarjetaJuego.vue';
import Paginacion from '../components/paginacion.vue';
import { getJuegos } from '../compostables/obtenerJuegos';
import SpinnerCarga from '@/components/SpinnerCarga.vue';
import { useSessionStore } from '../stores/session.js';
import BannerJuego from '@/components/bannerJuego.vue';

// Obtener funciones y estados para gestionar los juegos

const sessionStore = useSessionStore();

const {
  juegos,
  cargando,
  paginaInput,
  paginaAnterior,
  paginaSiguiente,
  juegosPagina,
  obtenerJuegos,
} = getJuegos();

const obtenerUsername = async () => {
  const sesionRecuperada = await sessionStore.recuperarSesion();
  if (sesionRecuperada && sessionStore.session?.user) {
    console.log('UID de la sesión:', sessionStore.session.user.id);
    return sessionStore.session.user.id;
  } else {
    console.warn('La sesión del usuario no está disponible, prueba a iniciar sesión');
    return null;
  }

  //HACER UN GET A LA BASE DE DATOS PARA OBTENER EL NOMBRE DE USUARIO

}

// Cargar los juegos cuando se monte el componente
onMounted(async () => {
  sessionStore.recuperarSesion();
  await obtenerJuegos();

  await obtenerUsername();

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
          <span class="titulo">¡Bienvenido de vuelta,<strong> {{ sessionStore.session.username || usuario
              }}!</strong></span><br><br>
        </span>

        <span v-else class="">
          <div class="titulo">¡Bienvenido a <strong>PixelRift!</strong></div><br>

          <router-link to="/cuenta/" class="subtitulo" align="center">Regístrate o Inicia Sesión</router-link>
          para acceder
          a tu
          cuenta y
          guardar tus juegos favoritos.
        </span>

        <p>Mientras tanto, echa un vistazo a nuestro catálogo:</p>
      </div>

      <div v-if="!cargando" class="listadoJuegos">
        <tarjetaJuego v-for="juego in juegos.slice(0, 10)" :key="juego.id" :juego="juego" />
      </div>

      <p v-else align="center">
        <SpinnerCarga />
        <br><strong>Cargando...</strong>
      </p>

      <Paginacion v-model:numPagina="paginaInput" v-model:juegosPagina="juegosPagina" :cargando="cargando"
        :paginaAnterior="paginaAnterior" :paginaSiguiente="paginaSiguiente" @actualizarJuegos="obtenerJuegos" />
    </div>

    <div class="titulo">Tus <strong>Colecciones</strong></div>
    <span align="center">
      mostrar aqui 2 colecciones max<br>
      <router-link to="/coleccion"><button>Ver todas</button></router-link>

      <br><br><br><br><br>
    </span>
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

.titulo {
  text-align: center;
  font-size: 2rem;
}

.subtitulo {
  text-align: center;
  font-size: 1rem;
  color: #000000;
  margin-top: 1rem;
}
</style>
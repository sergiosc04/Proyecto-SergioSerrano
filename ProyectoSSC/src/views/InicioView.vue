<script setup>
import { ref, onMounted } from 'vue';
import tarjetaJuego from '../components/tarjetaJuego.vue';
import Paginacion from '../components/paginacion.vue';
import { getJuegos } from '../compostables/obtenerJuegos';
import SpinnerCarga from '@/components/SpinnerCarga.vue';
import BannerJuego from '@/components/bannerJuego.vue'; // Componente para mostrar un juego destacado

// Obtener funciones y estados para gestionar los juegos
const {
  juegos,
  cargando,
  paginaInput,
  paginaAnterior,
  paginaSiguiente,
  juegosPagina,
  obtenerJuegos,
} = getJuegos();

// Cargar los juegos cuando se monte el componente
onMounted(() => {
  obtenerJuegos();
});
</script>

<template>
  <main>
    <!-- Banner que muestra un juego aleatorio destacado -->
    <BannerJuego v-if="juegos && juegos.length > 0" :juegos="juegos" />

    <div class="contenedorJuegos">
      <!-- Listado de juegos cuando no está cargando -->
      <div class="titulos">
        <span class="titulo">¡Bienvenido a <strong>PixelRift!</strong></span>
        <span class="subtitulo">Aquí tienes algunas de nuestras recomendaciones:</span>
      </div>

      <div v-if="!cargando" class="listadoJuegos">
        <tarjetaJuego v-for="juego in juegos.slice(0, 10)" :key="juego.id" :juego="juego" />
      </div>

      <!-- Spinner de carga mientras se obtienen los juegos -->
      <p v-else align="center">
        <SpinnerCarga />
        <br><strong>Cargando...</strong>
      </p>

      <!-- Componente de paginación para navegar entre resultados -->
      <Paginacion v-model:numPagina="paginaInput" v-model:juegosPagina="juegosPagina" :cargando="cargando"
        :paginaAnterior="paginaAnterior" :paginaSiguiente="paginaSiguiente" @actualizarJuegos="obtenerJuegos" />
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

.titulo {
  text-align: center;
  font-size: 2rem;
}

.subtitulo {
  text-align: center;
  font-size: 1.25rem;
  color: #000000;
  margin-top: 1rem;
}
</style>
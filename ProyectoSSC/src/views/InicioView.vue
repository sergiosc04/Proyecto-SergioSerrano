<script setup>
import { ref, onMounted, watch } from 'vue';
import tarjetaJuego from '../components/tarjetaJuego.vue';
import Paginacion from '../components/paginacion.vue';
import { getJuegos } from '../compostables/obtenerJuegos';
import SpinnerCarga from '@/components/SpinnerCarga.vue';


// Función para obtener los juegos, importada del compostable
const {
  juegos,
  cargando,
  paginaInput,
  paginaAnterior,
  paginaSiguiente,
  juegosPagina,
  obtenerJuegos,
} = getJuegos();

onMounted(() => {
  obtenerJuegos();
});

</script>

<template>
  <main>
    <h1 align="center">¡Bienvenido a PixelRift!</h1>



    <div class="contenedorJuegos">

      <div v-if="!cargando" class="listadoJuegos">
        <tarjetaJuego v-for="juego in juegos" :key="juego.id" :juego="juego" />
      </div>

      <p v-else align="center">
        <SpinnerCarga />
        <br><strong>Cargando...</strong>
      </p>

      <Paginacion v-model:numPagina="paginaInput" v-model:juegosPagina="juegosPagina" :cargando="cargando"
        :paginaAnterior="paginaAnterior" :paginaSiguiente="paginaSiguiente" @actualizarJuegos="obtenerJuegos" />
    </div>

  </main>
</template>

<style scoped></style>
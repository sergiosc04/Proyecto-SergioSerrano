<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import tarjetaJuego from '../components/tarjetaJuego.vue';
import Paginacion from '../components/paginacion.vue';
import { getJuegos } from '../compostables/obtenerJuegos';


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

//Importamos la clave del .env
const claveAPI = import.meta.env.VITE_RAWG_API_KEY;

onMounted(() => {
  obtenerJuegos();
});

</script>

<template>
  <main>
    <h1 align="center">¡Bienvenido a PixelRift!</h1>

    <Paginacion v-model:numPagina="paginaInput" v-model:juegosPagina="juegosPagina" :cargando="cargando"
      :paginaAnterior="paginaAnterior" :paginaSiguiente="paginaSiguiente" @actualizarJuegos="obtenerJuegos" />

    <div class="contenedorJuegos">

      <div v-if="!cargando" class="listadoJuegos">
        <tarjetaJuego v-for="juego in juegos" :key="juego.id" :juego="juego" />
      </div>
      <p v-else align="center">Cargando...</p>

    </div>

  </main>
</template>

<style scoped></style>
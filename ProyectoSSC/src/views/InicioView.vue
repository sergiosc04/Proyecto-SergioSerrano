<script setup>
import tarjetaJuego from '../components/tarjetaJuego.vue';
import Paginacion from '../components/paginacion.vue';
import { onMounted } from 'vue';
import { getJuegos } from '../compostables/obtenerJuegos';

// Importamos los estados y funciones desde el composable obtenerJuegos
const {
  juegos,
  cargando,
  paginaInput,
  numPagina,
  paginaAnterior,
  paginaSiguiente,
  buscado,
  idBuscar,
  buscarInput,
  generoSelect,
  juegosPagina,
  obtenerJuegos,
} = getJuegos();

// Ejecutar al montar el componente
onMounted(() => {
  obtenerJuegos();
});
</script>

<template>
  <main>
    <h1 align="center">¡Bienvenido a PixelRift!</h1>
    <div v-if="juegos.length > 0" class="contenedorJuegos">

      <!-- componente de carga -->
      <Paginacion :numPagina="numPagina" :cargando="cargando" :paginaAnterior="paginaAnterior"
        :paginaSiguiente="paginaSiguiente" @update:numPagina="numPagina = $event" @actualizarJuegos="getJuegos()"
        @update:buscado="buscado = $event" />


      <div class="listadoJuegos">

        <!-- Tarjeta de juego, muestra uno por cada juego que haya -->
        <span v-for="juego in juegos" :key="juego.id" class="listadoJuegos" v-if="!cargando">
          <tarjetaJuego :juego="juego"></tarjetaJuego>
        </span>

        <p v-else align="center">Cargando...</p>
      </div>
    </div>
    <p v-else align="center">Cargando lista de juegos...</p>
  </main>
</template>


<style scoped></style>

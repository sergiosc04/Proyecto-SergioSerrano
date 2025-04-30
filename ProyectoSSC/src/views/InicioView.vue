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

// Toggle de búsqueda avanzada
const busquedaAvanzada = ref(false);

// Endpoint y lista de géneros para filtro avanzado
const endpointGeneros = `https://api.rawg.io/api/genres?key=9c8533b1b08441e680f0d26ed85dc61b`;
const generos = ref([]);

// Función para obtener géneros desde la API
const getGeneros = async () => {
  try {
    const { data } = await axios.get(endpointGeneros);
    generos.value = data.results;
  } catch (error) {
    console.error('Error al obtener los géneros:', error);
  }
};

// Alternar vista avanzada
const vistaAvanzada = () => (busquedaAvanzada.value = !busquedaAvanzada.value);

onMounted(() => {
  getGeneros();
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

<style scoped>
/* Los estilos permanecen igual */
.buscador_container {
  display: flex;
  flex-direction: column;
  margin: 0 20%;
}

.barra_busqueda input {
  width: 80%;
  padding: 10px;
  border-radius: 3px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
}

.buscador_avanzado {
  margin-bottom: 20px;
}

.buscador_genero select,
.buscador_pagina input {
  padding: 10px;
  border-radius: 3px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  width: 50%;
}

.buscador_pagina {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.boton-buscar,
button {
  background-color: #2d2d44;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  margin-bottom: 20px;
}

button:hover,
.boton-buscar:hover {
  background-color: #4f4f6e;
  transform: translateY(-2px);
}

.listadoJuegos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}
</style>
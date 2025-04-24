<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';

const idUsuario = ref(9); // ID de usuario para la búsqueda (puedes cambiarlo o recibirlo como parámetro)

const colecciones = ref([]);
const loading = ref(false);
const error = ref(null);

// Función para obtener colecciones por ID de usuario
async function getColeccion(idUsuario) {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('coleccion')
      .select('')
      .eq('idusuario', idUsuario)

    if (error) {
      console.error('Error al obtener las colecciones:', error);
    }

    colecciones.value = data[0].datosentrada
    console.log('Colecciones.value:', colecciones.value);
  } catch (err) {
    error.value = 'Error al cargar las colecciones: ' + err.message
  } finally {
    loading.value = false
  }
}


onMounted(() => {
  getColeccion(idUsuario.value);
})
</script>

<template>
  <h1 align="center">Colecciones</h1>

  <div>
    <h2>Detalles del Usuario</h2>
    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <p>El idUsuario es: {{ idUsuario }}</p>
      <!-- Aquí podrías cargar más detalles sobre el usuario -->
    </div>
  </div>

  <!-- 
  <p>Busca una colección: (deseados, favoritos, otro)</p>
  <input type="text" v-model="introNombre" placeholder="Busca una coleccion"><button
    @click="getColeccion(introNombre)">Buscar</button>

  <!-- Mostrar los items de todas las colecciones -->
  <div v-if="!loading && !error">
    <h3>Items en la colección</h3>
    <ul>
      <li v-for="(item, idx) in colecciones.items" :key="idx">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

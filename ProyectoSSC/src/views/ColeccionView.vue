<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase.js'

const colecciones = ref([])
const error = ref(null)
const introNombre = ref('')

// Función para obtener colecciones filtradas por nombre
const getColeccion = async (nombreBuscar = '') => {
    const { data, error: supaError } = await supabase
        .from('coleccion')
        .select('*')
        .eq('nombreColeccion', nombreBuscar)

    if (supaError) {
        error.value = supaError
        console.error(supaError.message)
    } else {
        colecciones.value = data
    }
}

// Al montar el componente, carga todas las colecciones (sin filtro)
onMounted(() => {
    getColeccion()
})
</script>

<template>
    <h1 align="center">Colección</h1>
    <p>Busca una colección: (deseados, favoritos, otro)</p>
    <input type="text" v-model="introNombre" placeholder="Busca una coleccion"><button
        @click="getColeccion(introNombre)">Buscar</button>

    <!-- Mostrar los items de todas las colecciones -->
    <div v-for="(entrada, index) in colecciones" :key="index">
        <h3>Items en la colección {{ entrada.idcoleccion }}</h3>
        Nombre de coleccion: {{ entrada.nombreColeccion }}<br>
        <ul>
            <li v-for="item in entrada.datosentrada.items" :key="item">{{ item }}</li>
        </ul>
    </div>
</template>
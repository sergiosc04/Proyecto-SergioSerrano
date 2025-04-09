<script>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase.js'

export default {
    name: 'ColeccionView',
    setup() {
        const colecciones = ref([]);
        const error = ref(null);
        const introNombre = ref("");

        const getColeccion = async (nombreBuscar) => {

            //Bucar de la tabla coleccion, todas las tuplas que contengan nombreBuscar (recogido del input)
            let { data: coleccion, error } = await supabase
                .from('coleccion')
                .select('*')
                .eq('nombreColeccion', nombreBuscar);

            if (error) {
                console.error(error.message);
            } else {
                colecciones.value = coleccion;
            }
            console.log(colecciones.value);
        }

        getColeccion();

        onMounted(() => {
            getColeccion();
        })

        return {
            colecciones,
            error,
            getColeccion,
            introNombre
        }
    }
}
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
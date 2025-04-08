<script>
import { ref, onMounted } from 'vue'
import { supabase } from '../supabase.js'

export default {
    name: 'ColeccionView',
    setup() {
        const colecciones = ref([]);
        const error = ref(null);

        const getColeccion = async () => {
            let { data: coleccion, error } = await supabase
                .from('coleccion')
                .select('*');

            if (error) {  // Cambié queryError a error
                console.error(error.message); // Muestra el error en la consola
            } else {
                colecciones.value = coleccion; // Cambié data a coleccion
            }
            console.log(colecciones.value);
        }

        onMounted(() => {
            getColeccion();
        })

        return {
            colecciones,
            loading,
            error,
            getColeccion
        }
    }
}
</script>

<template>
    <h1 align="center">Colección</h1>

    <!-- Mostrar los items de todas las colecciones -->
    <div v-for="(entrada, index) in colecciones" :key="index">
        <h3>Items en la colección {{ entrada.idcoleccion }}</h3>
        <ul>
            <li v-for="item in entrada.datosentrada.items" :key="item">{{ item }}</li>
        </ul>
    </div>
</template>
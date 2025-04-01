<script>
import { ref } from 'vue';
export default {
    name: "buscar",

    setup() {
        let idBuscar = ref();



        return {
            idBuscar,
        }
    }
}
</script>

<template>
    <div class='buscador'>
        <span class="buscador">
            <input type="text" placeholder="Busca un juego" v-model="idBuscar">
            <button type="submit">Buscar</button>
        </span>
    </div>
</template>

<style></style>
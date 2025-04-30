<template>
    <div class="contenedorPagina">
        <img v-if="paginaAnterior" src="../assets/img/botones/back.png" alt="Página anterior"
            @click="cambiar('anterior')" :disabled="cargando" />
        <strong>Página {{ numPagina }}</strong>
        <img v-if="paginaSiguiente" src="../assets/img/botones/next.png" alt="Página siguiente"
            @click="cambiar('siguiente')" :disabled="cargando" />
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

// Props
const props = defineProps({
    numPagina: Number,
    cargando: Boolean,
    paginaAnterior: String,
    paginaSiguiente: String,
    buscado: {
        type: Boolean,
        required: false,
        default: null,
    },
});

// Emits
const emit = defineEmits(['update:numPagina', 'actualizarJuegos', 'update:buscado']);

// Método para cambiar de página

function cambiar(direccion) {
    if (props.cargando) return;

    setTimeout(() => {
        let nuevaPagina = props.numPagina;

        if (nuevaPagina === 0) {
            nuevaPagina = Math.floor(Math.random() * 200) + 1;
        } else if (direccion === 'siguiente' && props.paginaSiguiente) {
            nuevaPagina++;
        } else if (direccion === 'anterior' && props.paginaAnterior && nuevaPagina > 1) {
            nuevaPagina--;
        }

        emit('update:numPagina', nuevaPagina);
        emit('actualizarJuegos');

        if (props.buscado !== null) {
            emit('update:buscado', true);
            console.log(true);
        }
    }, 500);
}
</script>

<style scoped>
.contenedorPagina {
    position: fixed;
    bottom: 10px;
    left: 10px;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px;
    border: 1px solid gray;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    display: flex;
    align-items: center;
}

.contenedorPagina img {
    width: 20px;
    height: 20px;
    margin: 0 5px;
    cursor: pointer;
}
</style>

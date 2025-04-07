<script setup>
import { ref } from 'vue'
import Login from './Login.vue'
import Registro from './Registro.vue'

const mostrarRegistro = ref(false);

const cambiarARegistro = () => {
    mostrarRegistro.value = true;
}

const cambiarALogin = () => {
    mostrarRegistro.value = false;
}
</script>

<template>
    <div>
        <Login v-if="!mostrarRegistro" @cambiarARegistro="cambiarARegistro" />
        <Registro v-else @cambiarALogin="cambiarALogin" />
    </div>
</template>
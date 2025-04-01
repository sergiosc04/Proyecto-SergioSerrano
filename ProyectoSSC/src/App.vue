<script>
import navbar from './components/navbar.vue';

export default {
    components: {
        navbar,
    },

    setup() {

        return {
        }
    }
}

</script>

<template>
    <!-- Barra superior. Siempre se muestra por lo que no hace falta cargarla en el router -->
    <navbar />

    <!-- Vista que se actualiza dependiendo del momento (router.push). Solo se actualiza esta parte de la página sin tener que refrescarla -->
    <RouterView />

</template>

<style></style>
<script>
import navbar from './components/navbar.vue'
export default {
    components: {
        navbar,
    },
}

</script>

<template>
    <!-- Barra superior. Siempre se muestra por lo que no hace falta cargarla en el router -->
    <span class="navbar--container">
        <navbar />
    </span>
    <!-- Vista que se actualiza dependiendo del momento (router.push/routerlink). Solo se actualiza esta parte de la página sin tener que refrescarla -->
    <span>
        <RouterView />
    </span>
</template>

<style></style>
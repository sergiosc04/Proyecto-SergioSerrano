<script>
import navbar from './components/navbar.vue';
import { provide, ref } from 'vue';

export default {
    components: {
        navbar,
    },

    setup() {
        const avatar = ref('');
        provide('avatar', avatar);
    }
}

</script>

<template>
    <span class="navbar--container">
        <navbar />
    </span>

    <!-- Vista que se actualiza dependiendo del momento (router.push/routerlink). Solo se actualiza esta parte de la página sin tener que refrescarla -->
    <span>
        <RouterView />
    </span>
</template>

<style>
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
}

#app {
    width: 100%;
    height: 100%;
}
</style>
<script setup>
import { onMounted } from 'vue';
import { useSessionStore } from './stores/session';
import navbar from './components/navbar.vue';

const sessionStore = useSessionStore();

onMounted(async () => {
    await sessionStore.recuperarSesion();
});
</script>

<template>
    <span class="navbar--container">
        <navbar />
    </span>

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
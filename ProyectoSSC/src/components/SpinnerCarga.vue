<script setup>
</script>

<template>
    <div class="flex justify-center items-center h-full">
        <div class="spinner"></div>
    </div>
</template>

<style scoped>
* {
    display: flex;
    justify-content: center;
    align-items: center;
}

.spinner {
    margin: 15px;
    border: 4px solid var(--color-borde);
    border-top: 4px solid var(--color-fondo-boton);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: giro 1s linear infinite;
}

@keyframes giro {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>
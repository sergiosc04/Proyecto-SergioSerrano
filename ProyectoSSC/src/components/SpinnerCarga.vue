<script setup>
</script>

<template>
    <div class="flex justify-center items-center h-full">
        <div class="spinner"></div>
    </div>
</template>

<style scoped>
.spinner {
    border: 4px solid #a4a4a4;
    border-top: 4px solid rgb(90, 90, 90);
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
<script>
export default {
    name: 'tarjetaJuego',
    props: {
        juego: {
            type: Object,
            required: true,
        },
    },
};
</script>

<template>
    <div class="tarjetaJuego">
        <img :src="juego.background_image" alt="" width="100%">

        <!-- Se pueden meter más campos si es necesario -->
        <h2>{{ juego.name }}</h2>
        <ul>
            <li>ID Del juego: {{ juego.id }}</li>
            <li>Fecha de salida: {{ juego.released }}</li>
            <li>Calificación del juego: {{ juego.rating }}/ 5</li>
        </ul>

        <div class="accionesJuegos">
            <router-link :to="'juego/' + juego.id"
                style="display: flex; justify-content: center; padding-bottom: 10px;">
                <button>Ver juego</button>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
.tarjetaJuego {
    border: 1px solid black;
    border-radius: 5px;
    width: 20vw;
    min-width: 250px;
    max-width: 300px;
}

.tarjetaJuego h2 {
    text-align: center;
}
</style>

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

        <!-- Se pueden meter más campos si es necesario -->
        <h2>{{ juego.name }}</h2>
        <ul>
            <li>ID Del juego: {{ juego.id }}</li>
            <li>Fecha de salida: {{ juego.released }}</li>
            <li>Calificación del juego: {{ juego.rating }}/ 5</li>
            <router-link :to="'juego/' + juego.id">
                <button>Ver juego</button>
            </router-link>
        </ul>


    </div>
</template>

<style scoped>
.tarjetaJuego {
    border: 1px solid black;
    width: 30vw;
}
</style>
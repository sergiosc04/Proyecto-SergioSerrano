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
        <h2>{{ juego.name }}</h2>
        <p>{{ juego.id }}</p>
        <!-- Puedes agregar más campos según la información disponible, como el rating, descripción, etc. -->
    </div>
</template>

<style scoped>
.tarjetaJuego {
    border: 1px solid black;
    width: 25vw;
}
</style>
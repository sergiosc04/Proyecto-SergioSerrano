<script>
export default {
    name: 'navbar',
}
</script>

<template>
    <nav class="navbar">
        <RouterLink class="link--navbar" to="/">Inicio</RouterLink>
        <RouterLink class="link--navbar" to="/nuevoLibro">Biblioteca</RouterLink>

        <span class="buscador">
            <input type="text" placeholder="Busca por ID" v-model="idBuscar">
            <button type="submit">Buscar</button>
        </span>

        <button>Iniciar Sesión</button>
    </nav>
</template>

<style></style>
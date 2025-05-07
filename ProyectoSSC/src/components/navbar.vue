<script setup>
import { onMounted } from 'vue';
import { useSessionStore } from '../stores/session.js';
import { RouterLink } from 'vue-router';

const sessionStore = useSessionStore();

onMounted(async () => {
    console.log("Navbar");
    await sessionStore.recuperarSesion();

});
</script>

<template>
    <nav class="navbar--container">
        <div class="navbar--content">
            <!-- Logo -->
            <a href="/" class="navbar--logo">
                <img src="../assets/img/logo/PixelRift-Logo-Colores.png" alt="PixelRift Logo" height="60" />
            </a>

            <!-- Links -->
            <div class="navbar--links">
                <RouterLink class="link--navbar" to="/"><button>INICIO</button></RouterLink>
                <RouterLink class="link--navbar" to="/buscar/"><button>BUSCAR</button></RouterLink>

                <RouterLink class="link--navbar" to="/coleccion/"><button>COLECCIONES</button></RouterLink>
                <RouterLink class="link--navbar" to="/cuenta/"><button>CUENTA</button></RouterLink>
            </div>

            <!-- Botón del usuario con clase nueva -->
            <RouterLink class="navbar--user" to="/cuenta/">
                <button>
                    <img v-if="sessionStore.avatarUrl" :src="sessionStore.avatarUrl" alt="Usuario" />
                    <img v-else src="../assets/img/usuarioPH.jpg" alt="">
                </button>
            </RouterLink>
        </div>
    </nav>
</template>

<style scoped>
.navbar--container {
    background: linear-gradient(to right, #1f1f2e, #2d2d44);
    padding: 1rem 2rem;
    box-shadow: 0 2px 10px rgba(116, 9, 255, 0.2);
    border-radius: 0;
    /* Eliminamos el border-radius */
    margin: 0;
    /* Eliminamos los márgenes */
    color: #fff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.navbar--content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1400px;
    /* Opcional: para mantener el contenido centrado en pantallas muy grandes */
    margin: 0 auto;
    /* Opcional: para centrar el contenido */
}

.navbar--logo img {
    height: 60px;
    transition: transform 0.2s ease-in-out;
}

.navbar--logo img:hover {
    transform: scale(1.05);
    animation: cambioHue 2s linear infinite;
}

/* Animación del cambio constante de hue */
@keyframes cambioHue {
    0% {
        filter: hue-rotate(0deg);
    }

    100% {
        filter: hue-rotate(360deg);
    }
}

.navbar--links {
    display: flex;
    gap: 1rem;
}

.link--navbar button {
    background-color: transparent;
    color: #FFF;
    border: 2px solid #fff;
    padding: 0.4rem 1rem;
    border-radius: 3px;
    transition: all 0.3s ease;
    cursor: pointer;
    font-weight: 500;
}

.link--navbar button:hover {
    background-color: #ffffff;
    color: #2d2d44;
    transform: translateY(-2px);
    box-shadow: 0px 4px 10px rgba(255, 255, 255, 0.2);
}

.navbar--auth {
    display: flex;
    gap: 0.5rem;
}

.navbar--user button {
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
}

.navbar--user img {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #fff;
    transition: transform 0.2s ease-in-out;
}

.navbar--user img:hover {
    transform: scale(1.05);
}
</style>
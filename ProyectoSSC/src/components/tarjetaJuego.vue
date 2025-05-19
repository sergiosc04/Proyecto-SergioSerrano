<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
const props = defineProps({
    juego: {
        type: Object,
        required: true,
    }
});

const router = useRouter();
const videoUrl = ref(null);
const hovering = ref(false);
const tarjetaRef = ref(null);
const claveAPI = import.meta.env.VITE_RAWG_API_KEY;

const obtenerVideos = async () => {
    try {
        const endpoint = `https://api.rawg.io/api/games/${props.juego.id}/movies?key=${claveAPI}`;
        const respuesta = await axios.get(endpoint);
        const resultados = respuesta.data.results;

        if (resultados.length > 0 && resultados[0].data && resultados[0].data['480']) {
            videoUrl.value = resultados[0].data['480'];
        }
    } catch (error) {
        console.error('Error al obtener el video:', error);
    }
};

const juegoParaColeccion = () => {
    const idGuardar = props.juego.id;
    router.push({ name: 'coleccion', query: { idRecibido: idGuardar } });
};

const cargarTarjeta = () => {
    obtenerVideos();
};

const observer = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
            cargarTarjeta();
            observer.unobserve(entrada.target);
        }
    });
});

onMounted(() => {
    if (tarjetaRef.value) {
        observer.observe(tarjetaRef.value);
    }
});

onBeforeUnmount(() => {
    if (tarjetaRef.value) {
        observer.unobserve(tarjetaRef.value);
    }
});
</script>

<template>
    <div ref="tarjetaRef" class="tarjetaJuego" :class="{ 'con-video': videoUrl }" @mouseenter="hovering = true"
        @mouseleave="hovering = false">

        <router-link :to="`/juego/${juego.slug}`">
            <div class="contenedor-img">
                <img v-if="!hovering || !videoUrl" :src="juego.background_image" alt="Imagen del juego"
                    class="juego-img" loading="lazy" />
                <video v-if="hovering && videoUrl" :src="videoUrl" class="video-preview" autoplay muted loop playsinline
                    preload="none"></video>
                <div class="rating-badge" v-if="juego.rating">
                    {{ juego.rating }} <span class="estrella">★</span>
                </div>
                <span v-if="videoUrl && !hovering" class="icono-video"></span>
            </div>

            <div class="tarjeta--contenido">
                <h2>{{ juego.name }}</h2>
                <div class="juego-info">
                    <div class="info-item">
                        <span class="info-label">ID:</span>
                        <span class="info-value">{{ juego.id }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Lanzamiento:</span>
                        <span class="info-value">{{ juego.released }}</span>
                    </div>
                </div>
            </div>
        </router-link>

        <div class="accionesJuegos">
            <router-link :to="`/juego/${juego.slug}`">
                <button class="boton-accion boton-ver">
                    <span class="boton-texto">Ver más</span>
                </button>
            </router-link>
            <button @click="juegoParaColeccion()" class="boton-accion boton-coleccion">
                <span class="boton-texto">Añadir a colección</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
a {
    color: inherit;
    text-decoration: none;
}

.tarjetaJuego {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #131520;
    color: #e9e9ec;
    border-radius: 16px;
    width: 20vw;
    min-width: 250px;
    max-width: 300px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(79, 70, 229, 0.15);
}

.tarjetaJuego:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 30px rgba(99, 102, 241, 0.2);
    border-color: rgba(99, 102, 241, 0.3);
}

.contenedor-img {
    position: relative;
    width: 100%;
    height: 180px;
    /* Altura fija para la imagen */
    overflow: hidden;
}

.juego-img,
.video-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.tarjetaJuego:hover .juego-img {
    transform: scale(1.05);
}

.video-preview {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}

.icono-video {
    position: absolute;
    bottom: 12px;
    right: 12px;
    width: 32px;
    height: 32px;
    background-image: url('../assets/img/botones/play.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    z-index: 2;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
}

.rating-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: var(--color-fondo-boton);
    color: var(--color-texto);
    font-weight: bold;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 0.9rem;
    z-index: 2;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.estrella {
    color: var(--color-advertencia);
    margin-left: 2px;
}

.tarjeta--contenido {
    padding: 1.2rem;
    flex: 1;
    background: var(--gradiente-oscuro);
    display: flex;
    flex-direction: column;
}

.tarjetaJuego h2 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.8rem;
    color: var(--color-texto);
    line-height: 1.3;
    letter-spacing: 0.02em;
}

.juego-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: auto;
}

.info-item {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
}

.info-label {
    color: var(--color-texto-secundario);
    font-weight: 500;
}

.info-value {
    color: var(--color-texto);
    font-weight: 400;
}

.accionesJuegos {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    padding: 1rem;
    background-color: var(--color-fondo);
}

.boton-accion {
    flex: 1;
    border: none;
    border-radius: 8px;
    padding: 0.7rem 0;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    display: flex;
    justify-content: center;
    align-items: center;
}

.boton-ver {
    background-color: var(--color-secundario);
    color: var(--color-texto);
    padding: 0.7rem 1.5rem;
    /* Añadido padding horizontal */
}

.boton-ver:hover {
    background-color: var(--color-fondo-hover);
}

.boton-coleccion {
    background-color: var(--color-fondo-boton);
    color: var(--color-texto);
}

.boton-coleccion:hover {
    background-color: var(--color-acento-terciario);
}

.boton-texto {
    display: inline-block;
    transform: translateY(0);
    transition: transform 0.2s ease;
}

.boton-accion:hover .boton-texto {
    transform: translateY(-2px);
}

@media (max-width: 768px) {
    .tarjetaJuego {
        width: 100%;
        max-width: none;
    }

    .accionesJuegos {
        flex-direction: column;
    }
}
</style>
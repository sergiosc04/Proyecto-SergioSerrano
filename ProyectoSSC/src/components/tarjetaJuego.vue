<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Definición de las propiedades recibidas por el componente
const props = defineProps({
    juego: {
        type: Object,
        required: true, // El objeto juego es obligatorio
    }
});

const router = useRouter(); // Hook para manejar navegación
const videoUrl = ref(null); // URL del video preview, inicialmente nulo
const hovering = ref(false); // Estado para saber si el ratón está sobre la tarjeta
const tarjetaRef = ref(null); // Referencia al elemento DOM de la tarjeta
const claveAPI = import.meta.env.VITE_RAWG_API_KEY; // Clave API de RAWG desde variables de entorno

// Función para obtener los videos del juego desde la API RAWG
const obtenerVideos = async () => {
    try {
        // Construye el endpoint para obtener videos del juego por su ID
        const endpoint = `https://api.rawg.io/api/games/${props.juego.id}/movies?key=${claveAPI}`;
        const respuesta = await axios.get(endpoint);
        const resultados = respuesta.data.results;

        // Si hay videos y existe la calidad 480p, se guarda la URL en videoUrl
        if (resultados.length > 0 && resultados[0].data && resultados[0].data['480']) {
            videoUrl.value = resultados[0].data['480'];
        }
    } catch (error) {
        console.error('Error al obtener el video:', error);
    }
};

// Función que redirige a la ruta 'coleccion' pasando el ID del juego en query
const juegoParaColeccion = () => {
    const idGuardar = props.juego.id;
    router.push({ name: 'coleccion', query: { idRecibido: idGuardar } });
};

// Carga la tarjeta (en este caso llama a obtener videos)
const cargarTarjeta = () => {
    obtenerVideos();
};

// Observer para detectar cuándo la tarjeta está visible en pantalla (lazy load)
const observer = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
            cargarTarjeta(); // Carga contenido cuando la tarjeta entra en el viewport
            observer.unobserve(entrada.target); // Deja de observar para no recargar
        }
    });
});

// Montar el observer cuando el componente se monta
onMounted(() => {
    if (tarjetaRef.value) {
        observer.observe(tarjetaRef.value);
    }
});

// Limpiar el observer cuando el componente se desmonta
onBeforeUnmount(() => {
    if (tarjetaRef.value) {
        observer.unobserve(tarjetaRef.value);
    }
});
</script>

<template>
    <!-- Contenedor principal de la tarjeta, con referencia para el IntersectionObserver -->
    <div ref="tarjetaRef" class="tarjetaJuego" :class="{ 'con-video': videoUrl }" 
        @mouseenter="hovering = true" @mouseleave="hovering = false">

        <!-- Enlace al detalle del juego -->
        <router-link :to="`/juego/${juego.slug}`">
            <div class="contenedor-img">
                <!-- Imagen del juego si no está en hover o no hay video -->
                <img v-if="!hovering || !videoUrl" :src="juego.background_image" alt="Imagen del juego"
                    class="juego-img" loading="lazy" />
                
                <!-- Video de preview si está en hover y hay video -->
                <video v-if="hovering && videoUrl" :src="videoUrl" class="video-preview" autoplay muted loop playsinline
                    preload="none"></video>
                
                <!-- Badge con el rating del juego -->
                <div class="rating-badge" v-if="juego.rating">
                    {{ juego.rating }} <span class="estrella">★</span>
                </div>
                
                <!-- Icono de video visible cuando hay video pero no se está haciendo hover -->
                <span v-if="videoUrl && !hovering" class="icono-video"></span>
            </div>

            <!-- Contenido textual de la tarjeta -->
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

        <!-- Botones de acción -->
        <div class="accionesJuegos">
            <!-- Botón para ver más detalles -->
            <router-link :to="`/juego/${juego.slug}`">
                <button class="boton-accion boton-ver">
                    <span class="boton-texto">Ver más</span>
                </button>
            </router-link>
            <!-- Botón para añadir a la colección -->
            <button @click="juegoParaColeccion()" class="boton-accion boton-coleccion">
                <span class="boton-texto">Añadir a colección</span>
            </button>
        </div>
    </div>
</template>

<style scoped>
/* Estilos para enlaces, sin decoración ni cambio de color */
a {
    color: inherit;
    text-decoration: none;
}

/* Estilos generales de la tarjeta */
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

/* Efecto hover para elevar y aumentar la tarjeta */
.tarjetaJuego:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 12px 30px rgba(99, 102, 241, 0.2);
    border-color: rgba(99, 102, 241, 0.3);
}

/* Contenedor de la imagen/video con altura fija y overflow oculto */
.contenedor-img {
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;
}

/* Imagen y video comparten estilos */
.juego-img,
.video-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

/* Zoom en imagen al hacer hover */
.tarjetaJuego:hover .juego-img {
    transform: scale(1.05);
}

/* El video se posiciona encima de la imagen */
.video-preview {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}

/* Icono de video en la esquina inferior derecha */
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

/* Badge del rating del juego */
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

/* Color estrella rating */
.estrella {
    color: var(--color-advertencia);
    margin-left: 2px;
}

/* Contenido textual */
.tarjeta--contenido {
    padding: 1.2rem;
    flex: 1;
    background: var(--gradiente-oscuro);
    display: flex;
    flex-direction: column;
}

/* Título */
.tarjetaJuego h2 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 0.8rem;
    color: var(--color-texto);
    line-height: 1.3;
    letter-spacing: 0.02em;
}

/* Contenedor de info con flex vertical y espacio entre elementos */
.juego-info {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: auto;
}

/* Cada par label-valor */
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

/* Contenedor botones acción */
.accionesJuegos {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    padding: 1rem;
    background-color: var(--color-fondo);
}

/* Estilo común para botones */
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

/* Botón ver detalles */
.boton-ver {
    background-color: var(--color-secundario);
    color: var(--color-texto);
    padding: 0.7rem 1.5rem;
}

.boton-ver:hover {
    background-color: var(--color-fondo-hover);
}

/* Botón añadir a colección */
.boton-coleccion {
    background-color: var(--color-fondo-boton);
    color: var(--color-texto);
}

.boton-coleccion:hover {
    background-color: var(--color-acento-terciario);
}

/* Animación texto botón */
.boton-texto {
    display: inline-block;
    transform: translateY(0);
    transition: transform 0.2s ease;
}

.boton-accion:hover .boton-texto {
    transform: translateY(-2px);
}

/* Responsive: tarjeta a ancho completo en pantallas pequeñas */
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

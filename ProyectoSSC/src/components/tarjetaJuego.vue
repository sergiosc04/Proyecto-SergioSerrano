<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    name: "tarjetaJuego",
    props: {
        juego: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        const router = useRouter();

        // Referencia para almacenar la URL del video
        const videoUrl = ref(null);

        // Referencia para detectar si el ratón está encima de la tarjeta
        const hovering = ref(false);

        // Referencia para la tarjeta (se usará para el lazy load)
        const tarjetaRef = ref(null);

        // Importamos la clave del .env
        const claveAPI = import.meta.env.VITE_RAWG_API_KEY;

        // Función para obtener videos del juego desde la API
        const obtenerVideos = async () => {
            try {
                const endpoint = `https://api.rawg.io/api/games/${props.juego.id}/movies?key=${claveAPI}`;
                const respuesta = await axios.get(endpoint);
                const resultados = respuesta.data.results;

                // Si hay un video disponible, se guarda la URL del video 480p
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

        // Función para cargar la tarjeta cuando entra en el viewport
        const cargarTarjeta = () => {
            obtenerVideos();
        };

        // Crear el IntersectionObserver
        const observer = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    cargarTarjeta();  // Cargar el video y otros datos cuando entra en el viewport
                    observer.unobserve(entrada.target);  // Dejar de observar la tarjeta después de cargarla
                }
            });
        });

        // Observar la tarjeta cuando se monte
        onMounted(() => {
            if (tarjetaRef.value) {
                observer.observe(tarjetaRef.value);
            }
        });

        // Limpiar el observer cuando el componente se destruya
        onBeforeUnmount(() => {
            if (tarjetaRef.value) {
                observer.unobserve(tarjetaRef.value);
            }
        });

        return {
            videoUrl,
            hovering,
            juegoParaColeccion,
            tarjetaRef,
        };
    }
};
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
                <span v-if="videoUrl && !hovering" class="icono-video"></span>
            </div>

            <div class="tarjeta--contenido">
                <h2>{{ juego.name }}</h2>
                <ul>
                    <li><strong>ID:</strong> {{ juego.id }}</li>
                    <li><strong>Fecha de salida:</strong> {{ juego.released }}</li>
                    <li><strong>Calificación:</strong> {{ juego.rating }} / 5 ★</li>
                </ul>
            </div>
        </router-link>
        <div class="accionesJuegos">
            <router-link :to="`/juego/${juego.slug}`"></router-link>
            <button class="boton-accion">Ver juego</button>

            <button @click="juegoParaColeccion()" class="boton-accion">Añadir a colección</button>
        </div>
    </div>
</template>


<style scoped>
a {
    color: black;
    text-decoration: none;
}

.tarjetaJuego {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: #f0f0f8;
    border: 1px solid gray;
    border-radius: 10px;
    width: 20vw;
    min-width: 250px;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease;
    /* Transición suave al hacer hover */
}


.contenedor-img {
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;
}

.juego-img,
.video-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* Asegura que la imagen/video se ajuste correctamente */
}

/* Estilos para el video */
.video-preview {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    /* Asegura que el video se muestre encima de la imagen */
}

/* Estilos para el icono de video */
.icono-video {
    position: absolute;
    bottom: 12px;
    left: 12px;
    width: 25px;
    height: 25px;
    background-image: url('../assets/img/botones/play.png');

    /* Aquí se debe poner la URL del icono */
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    z-index: 2;
    /* Asegura que el icono se muestre encima del video */
}

.tarjeta--contenido {
    padding: 1rem;
    flex-grow: 1;
}

.tarjetaJuego h2 {
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #2d2d44;
}

.tarjetaJuego ul {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem 0;
    font-size: 0.9rem;
    color: #555;
}

.tarjetaJuego li {
    margin-bottom: 0.4rem;
}

.tarjetaJuego:hover {
    background-color: #f9f9fc;
}

.accionesJuegos {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 0.8rem;
    border-top: 1px solid #ddd;
    background-color: #f0f0f8;
    flex-wrap: wrap;
}

.boton-accion {
    background-color: #2d2d44;
    color: #fff;
    border: none;
    padding: 0.5rem 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    /* Transiciones al hacer hover en los botones */
}

.boton-accion:hover {
    background-color: #4f4f6e;
    transform: translateY(-3px);

    /* Efecto de movimiento en el botón al hacer hover */
}
</style>

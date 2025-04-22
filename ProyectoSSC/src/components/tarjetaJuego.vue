<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'

export default {
    name: "tarjetaJuego",
    props: {
        juego: {
            type: Object,
            required: true,
        },
    },
    setup(props) {
        // Referencia para almacenar la URL del video
        const videoUrl = ref(null)
        // Referencia para detectar si el ratón está encima de la tarjeta
        const hovering = ref(false)

        // Función para obtener videos del juego desde la API
        const getVideos = async () => {
            try {
                const endpoint = `https://api.rawg.io/api/games/${props.juego.id}/movies?key=9c8533b1b08441e680f0d26ed85dc61b`
                const response = await axios.get(endpoint)
                const results = response.data.results

                // Si hay un video disponible, se guarda la URL del video 480p
                if (results.length > 0 && results[0].data && results[0].data['480']) {
                    videoUrl.value = results[0].data['480']
                }
            } catch (error) {
                console.error('Error al obtener el video:', error)
            }
        }

        // Se llama a la función para obtener los videos cuando el componente se monta
        onMounted(getVideos)

        return {
            videoUrl,
            hovering
        }
    }
}
</script>

<template>
    <!-- Detecta cuando el
        ratón entra en la tarjeta -->
    <div class="tarjetaJuego" :class="{ 'con-video': videoUrl }" @mouseenter="hovering = true"
        @mouseleave="hovering = false"> <!-- Detecta cuando el ratón sale de la tarjeta -->

        <div class="contenedor-img">
            <!-- Muestra la imagen si no se está haciendo hover o si no hay video -->
            <img v-if="!hovering || !videoUrl" :src="juego.background_image" alt="Imagen del juego" class="juego-img" />

            <!-- Muestra el video si se hace hover y hay un video disponible -->
            <video v-if="hovering && videoUrl" :src="videoUrl" class="video-preview" autoplay muted loop
                playsinline></video>

            <!-- Muestra un icono de video en la esquina inferior si hay un video disponible -->
            <span v-if="videoUrl" class="icono-video"></span>
        </div>

        <div class="tarjeta--contenido">
            <!-- Muestra el nombre del juego con un enlace -->
            <h2><router-link :to="`/juego/${juego.slug}`">{{ juego.name }}</router-link></h2>
            <ul>
                <li><strong>ID:</strong> {{ juego.id }}</li> <!-- Muestra el ID del juego -->
                <li><strong>Fecha de salida:</strong> {{ juego.released }}</li> <!-- Muestra la fecha de lanzamiento -->
                <li><strong>Calificación:</strong> {{ juego.rating }} / 5 ★</li>
                <!-- Muestra la calificación del juego -->
            </ul>
        </div>

        <div class="accionesJuegos">
            <!-- Enlace para ver más detalles del juego -->
            <router-link :to="`/juego/${juego.slug}`">
                <button class="boton-accion">Ver juego</button>
            </router-link>

            <!-- Enlace para añadir el juego a la colección -->
            <router-link :to="`/coleccion`">
                <button class="boton-accion">Añadir a colección</button>
            </router-link>
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
    background-color: #f9f9fc;
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

.tarjetaJuego:hover {
    transform: scale(1.03);
    /* Efecto de ampliación al hacer hover */
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
    bottom: 8px;
    left: 8px;
    width: 24px;
    height: 24px;
    background-image: url('./assets/img/play.png');
    /* <-- NO FUNCIONA */
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
    transform: translateY(-2px);
    /* Efecto de movimiento en el botón al hacer hover */
}
</style>

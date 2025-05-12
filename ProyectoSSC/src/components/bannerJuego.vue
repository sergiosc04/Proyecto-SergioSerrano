<script>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
    name: "BannerJuego",
    props: {
        juegos: {
            type: Array,
            required: true,
        },
    },
    setup(props) {
        const router = useRouter();
        const juegoAleatorio = ref(null);
        const urlVideo = ref(null);
        const estaEncima = ref(false);
        const refBanner = ref(null);
        const claveAPI = import.meta.env.VITE_RAWG_API_KEY;


        //Funcion que selecciona un juego aleatorio del array de juegos recibido
        const seleccionarJuegoAleatorio = () => {
            if (props.juegos && props.juegos.length > 0) {
                // Limpiar el video antes de cambiar de juego
                urlVideo.value = null;
                const indiceAleatorio = Math.floor(Math.random() * props.juegos.length);
                juegoAleatorio.value = props.juegos[indiceAleatorio];
            }
        };

        /**
         * Obtiene los videos disponibles para el juego seleccionado
         */
        const obtenerVideos = async () => {
            if (!juegoAleatorio.value) return;

            // Limpiar el video anterior
            urlVideo.value = null;

            try {
                const endpoint = `https://api.rawg.io/api/games/${juegoAleatorio.value.id}/movies?key=${claveAPI}`;
                const respuesta = await axios.get(endpoint);
                const resultados = respuesta.data.results;

                if (resultados && resultados.length > 0 && resultados[0].data && resultados[0].data['480']) {
                    urlVideo.value = resultados[0].data['480'];
                }
            } catch (error) {
                console.error('Error al obtener el video:', error);
                // Asegurarnos de que urlVideo sea null en caso de error
                urlVideo.value = null;
            }
        };


        //Funcion para navegar a la página de colección con el ID del juego seleccionado
        const agregarAColeccion = () => {
            if (!juegoAleatorio.value) return;

            const idGuardar = juegoAleatorio.value.id;
            router.push({ name: 'coleccion', query: { idRecibido: idGuardar } });
        };

        // Inicializa los datos del banner cuando se activa
        const cargarBanner = () => {
            seleccionarJuegoAleatorio();
            obtenerVideos();
        };

        // Computed property para verificar si hay un juego seleccionado para mostrar
        const hayJuego = computed(() => {
            return juegoAleatorio.value !== null;
        });

        // Observar cambios en la prop juegos para actualizar el juego aleatorio
        watch(() => props.juegos, (nuevosJuegos) => {
            if (nuevosJuegos && nuevosJuegos.length > 0 && !juegoAleatorio.value) {
                seleccionarJuegoAleatorio();
                obtenerVideos();
            }
        }, { immediate: true, deep: true });

        // Variable para almacenar la instancia del IntersectionObserver
        let observador;

        // Al montar el componente, configurar el observer y seleccionar juego inicial
        onMounted(() => {
            // Crear IntersectionObserver para lazy loading del banner
            observador = new IntersectionObserver((entradas) => {
                entradas.forEach(entrada => {
                    if (entrada.isIntersecting) {
                        cargarBanner();  // Cargar datos cuando el banner es visible
                        observador.unobserve(entrada.target);  // Dejar de observar
                    }
                });
            });

            // Comenzar a observar el elemento del banner
            if (refBanner.value) {
                observador.observe(refBanner.value);
            }

            // Seleccionar juego aleatorio si tenemos datos disponibles
            if (props.juegos && props.juegos.length > 0 && !juegoAleatorio.value) {
                seleccionarJuegoAleatorio();
                obtenerVideos();
            }
        });

        // Limpiar el observer cuando el componente se destruya
        onBeforeUnmount(() => {
            if (observador && refBanner.value) {
                observador.unobserve(refBanner.value);
            }
        });

        return {
            juegoAleatorio,
            urlVideo,
            estaEncima,
            agregarAColeccion,
            refBanner,
            hayJuego,
            seleccionarJuegoAleatorio,
            obtenerVideos
        };
    }
};
</script>


<template>
    <!-- Banner principal que muestra un juego aleatorio -->
    <div ref="refBanner" class="bannerJuego" :class="{ 'con-video': urlVideo }" @mouseenter="estaEncima = true"
        @mouseleave="estaEncima = false" v-if="hayJuego">
        <!-- Contenedor para la imagen de fondo y el video -->
        <div class="contenedor-img">
            <!-- Imagen de fondo del juego -->
            <img :src="juegoAleatorio.background_image" alt="Imagen del juego" class="juego-img fondo-blur"
                loading="lazy" />
            <!-- Video que se reproduce al pasar el mouse -->
            <video v-if="urlVideo && estaEncima" :src="urlVideo" class="video-preview" autoplay muted loop playsinline
                preload="none"></video>
            <!-- Icono de video cuando no se está reproduciendo -->
            <span v-if="urlVideo && !estaEncima" class="icono-video"></span>
        </div>

        <!-- Contenido informativo sobre el juego -->
        <div class="banner--contenido">

            <!-- Título del juego con enlace a la página de detalles -->
            <h1 class="titulo-juego"><router-link :to="`/juego/${juegoAleatorio.slug}`">{{ juegoAleatorio.name
            }}</router-link></h1>

            <!-- Información adicional del juego -->
            <div class="info-juego">
                <p><strong>Fecha de lanzamiento:</strong> {{ juegoAleatorio.released }}</p>
                <p><strong>Calificación:</strong> {{ juegoAleatorio.rating }} / 5 ★</p>
            </div>

            <!-- Botones de acción para el juego -->
            <div class="accionesJuegos">
                <router-link :to="`/juego/${juegoAleatorio.slug}`">
                    <button class="boton-accion">Ver detalles</button>
                </router-link>
                <button @click="agregarAColeccion()" class="boton-accion">Añadir a colección</button>
                <button @click="seleccionarJuegoAleatorio(); obtenerVideos()" class="boton-accion boton-aleatorio">
                    Siguiente juego
                </button>
            </div>
        </div>
    </div>

    <!-- Mensaje alternativo cuando no hay juego disponible -->
    <div v-else class="bannerError">
        <p>No se pudo cargar el banner. No hay datos de juegos disponibles.</p>
    </div>
</template>


<style scoped>
a {
    color: white;
    text-decoration: none;
}

/* Contenedor principal del banner */
.bannerJuego {
    position: relative;
    width: 99.2vw;
    height: 80vh;
    max-width: 100vw;
    min-height: 550px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* Estilo para el mensaje de error */
.bannerError {
    width: 100%;
    padding: 2rem;
    background-color: #f8d7da;
    color: #721c24;
    text-align: center;
    border-radius: 5px;
    margin-bottom: 1rem;
}

/* Contenedor para la imagen y video */
.contenedor-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

/* Estilos comunes para imagen y video */
.juego-img,
.video-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Efecto de desenfoque para la imagen de fondo */
.fondo-blur {
    filter: blur(3px) brightness(0.7);
    transform: scale(1.05);
}

/* Estilos para el video */
.video-preview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 1;
}

/* Estilos para el icono de video */
.icono-video {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 50px;
    background-image: url('../assets/img/botones/play.png');
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    transform: translate(-50%, -50%);
    z-index: 2;
    pointer-events: none;
}

/* Contenedor del contenido informativo */
.banner--contenido {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem 10%;
    box-sizing: border-box;
    z-index: 3;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.2) 100%);
}

/* Estilo para el título del juego (reducido) */
.titulo-juego {
    font-size: 2rem;
    /* antes 3rem */
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
    color: white;
    font-weight: 700;
}

/* Contenedor de información */
.info-juego {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

/* Párrafos de información (reducidos) */
.info-juego p {
    color: white;
    font-size: 1rem;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
    margin: 0;
}

/* Contenedor de botones de acción */
.accionesJuegos {
    display: flex;
    gap: 12px;
    margin-top: 1.5rem;
}

/* Estilo base para los botones (reducidos) */
.boton-accion {
    background-color: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    color: white;
    border: 2px solid white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.3s ease;
}

/* Efecto hover ajustado */
.boton-accion:hover {
    background-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

/* Adaptación responsive */
@media (max-width: 768px) {
    .titulo-juego {
        font-size: 1.6rem;
    }

    .info-juego p {
        font-size: 0.9rem;
    }

    .banner--contenido {
        padding: 1rem 5%;
    }
}

/* Estilos específicos para el botón aleatorio (padding reducido) */
.boton-aleatorio {
    padding: 0.5rem 1rem;
    border-color: #ff9800;
    color: #ffc163;
}
</style>

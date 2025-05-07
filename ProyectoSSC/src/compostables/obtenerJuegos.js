import { ref, watch } from 'vue';
import axios from 'axios';

// Función para gestionar la obtención de juegos desde la API de RAWG
export function getJuegos() {

    //Importamos la clave del .env
    const claveAPI = import.meta.env.VITE_RAWG_API_KEY;

    const juegos = ref([]);
    const cargando = ref(false);

    const paginaInput = ref(1);
    const numPagina = ref(0); // Pagina actual (0 para que sea aleatorio)
    const juegosPagina = ref(50);

    const paginaAnterior = ref(null);
    const paginaSiguiente = ref(null);

    const buscado = ref(false);
    const idBuscar = ref('');
    const buscarInput = ref('');
    const generoSelect = ref('');

    // Watch para detectar cambios en numPagina y actualizar paginaInput
    watch(numPagina, (nuevoValor) => {
        if (nuevoValor > 0) {
            paginaInput.value = nuevoValor;
        }
    });

    // Función para cambiar página y obtener juegos en un solo paso
    const cambiarPagina = async (nuevaPagina) => {
        numPagina.value = nuevaPagina;
        await obtenerJuegos();
    };

    // Función unificada para buscar o cargar juegos aleatorios
    const obtenerJuegos = async () => {
        cargando.value = true; // Inicia el indicador de carga

        // Determina si hay texto en el input para búsqueda
        const buscando = buscarInput.value.trim() !== '';

        // Si no se busca y es la primera carga, asigna página aleatoria
        if (!buscando && numPagina.value === 0) {
            numPagina.value = Math.floor(Math.random() * 15) + 1;
        }
        // Si se está usando paginaInput explícitamente, actualiza numPagina
        else if (paginaInput.value !== numPagina.value) {
            numPagina.value = parseInt(paginaInput.value) || 1;
        }

        // Guarda el término de búsqueda actual
        idBuscar.value = buscarInput.value;

        // Construye parámetros básicos para la API
        const params = new URLSearchParams({
            key: claveAPI,
            page: numPagina.value,
            page_size: juegosPagina.value,
        });

        // Ejecutado al buscar algo
        if (buscando) {
            numPagina.value = 1;
            paginaInput.value = 1;

            params.set('page', 1); // Asegura que los parámetros también estén bien
            params.append('search', buscarInput.value);

            if (generoSelect.value) {
                params.append('genres', generoSelect.value);
            }
        }

        try {
            // Llama a la API con los parámetros construidos
            const { data } = await axios.get(
                `https://api.rawg.io/api/games?${params.toString()}`
            );

            // Actualiza el estado con los resultados y enlaces de paginación
            juegos.value = data.results;
            paginaAnterior.value = data.previous;
            paginaSiguiente.value = data.next;
            buscado.value = buscando;
            console.log(`Endpoint de la pagina ${numPagina.value} con ${juegosPagina.value} juegos: http://api.rawg.io/api/games?${params.toString()} `);
        } catch (error) {
            console.error('Error al obtener los juegos:', error);
        } finally {
            cargando.value = false;
        }
    };

    // Retorna el estado y la función para usar en componentes
    return {
        juegos,
        cargando,
        paginaInput,
        numPagina,
        paginaAnterior,
        paginaSiguiente,
        buscado,
        idBuscar,
        buscarInput,
        generoSelect,
        juegosPagina,
        obtenerJuegos,
        cambiarPagina,
    };
}
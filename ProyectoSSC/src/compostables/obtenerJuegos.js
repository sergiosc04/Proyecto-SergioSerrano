import { ref, watch } from 'vue';
import axios from 'axios';

// Función para gestionar la obtención de juegos desde la API de RAWG
export function getJuegos() {

    //Importamos la clave del .env
    const claveAPI = import.meta.env.VITE_RAWG_API_KEY;

    const juegos = ref([]); // Lista de juegos obtenidos
    const cargando = ref(false); // Indicador de carga (loading)

    const paginaInput = ref(1);  // Número de página deseada (input)
    const numPagina = ref(0); // Página actual (0 para indicar aleatorio)
    const juegosPagina = ref(20); // Juegos por página (número de resultados por petición)

    const paginaAnterior = ref(null); // URL de la página anterior (para paginación)
    const paginaSiguiente = ref(null);  // URL de la página siguiente (para paginación)

    const buscado = ref(false); // Indica si se ha realizado una búsqueda activa
    const idBuscar = ref('');  // Almacena el texto buscado
    const buscarInput = ref(''); // Texto enlazado al formulario
    const generoSelect = ref('');   // Género seleccionado en el filtro

    // Watch para detectar cambios en numPagina y actualizar paginaInput
    watch(numPagina, (newVal) => {
        if (newVal > 0) {
            paginaInput.value = newVal;
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

        // Si hay búsqueda activa, añade parámetros de búsqueda y género
        if (buscando) {
            params.append('search', buscarInput.value);
            if (generoSelect.value) {
                params.append('genres', generoSelect.value);
            }
        }

        try {
            // Llamada a la API con los parámetros construidos
            const { data } = await axios.get(
                `http://api.rawg.io/api/games?${params.toString()}`
            );

            // Actualiza el estado con los resultados y enlaces de paginación
            juegos.value = data.results;
            paginaAnterior.value = data.previous;
            paginaSiguiente.value = data.next;
            buscado.value = buscando;
            console.log(`Endpoint de la página ${numPagina.value} con ${juegosPagina.value} juegos: http://api.rawg.io/api/games?${params.toString()} `);
        } catch (error) {
            console.error('Error al obtener los juegos:', error);
        } finally {
            cargando.value = false; // Finaliza el indicador de carga
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
        cambiarPagina, // Nueva función que combina actualización de página y carga
    };
}
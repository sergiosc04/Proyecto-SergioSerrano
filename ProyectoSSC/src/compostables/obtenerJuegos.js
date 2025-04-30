import { ref } from 'vue';
import axios from 'axios';

// Composable para gestionar la obtención de juegos desde la API de RAWG

export function getJuegos() {
    const juegos = ref([]); //lista de juegos obtenidos

    const cargando = ref(false); // Indicador de carga (loading)

    const paginaInput = ref(1);  // Número de página deseada
    const numPagina = ref(0); // Página actual (0 para indicar aleatorio)
    const juegosPagina = ref(20); // juegos por página (número de resultados por petición)

    const paginaAnterior = ref(null); //URL de la página anterior (para paginación)
    const paginaSiguiente = ref(null);  // URL de la página siguiente (para paginación)


    const buscado = ref(false); //indica si se ha realizado una busqueda activa

    const idBuscar = ref('');  // Almacena el texto buscado

    const buscarInput = ref('');//texto enlazado al formulario
    const generoSelect = ref('');   // Género seleccionado en el filtro


    // Función unificada para buscar o cargar juegos aleatorios
    const obtenerJuegos = async () => {
        cargando.value = true; // Inicia el indicador de carga

        // Determina si hay texto en el input para búsqueda
        const buscando = buscarInput.value.trim() !== '';

        // Si no se busca y es la primera carga, asigna página aleatoria
        if (!buscando && numPagina.value === 0) {
            numPagina.value = Math.floor(Math.random() * 15) + 1;
        }
        // Si se busca, usa la página indicada por el usuario
        else if (buscando) {
            numPagina.value = paginaInput.value;
        }

        // Guarda el término de búsqueda actual
        idBuscar.value = buscarInput.value;

        // Construye parámetros básicos para la API
        const params = new URLSearchParams({
            key: '9c8533b1b08441e680f0d26ed85dc61b',
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
                `https://api.rawg.io/api/games?${params.toString()}`
            );

            // Actualiza el estado con los resultados y enlaces de paginación
            juegos.value = data.results;
            paginaAnterior.value = data.previous;
            paginaSiguiente.value = data.next;
            buscado.value = buscando;

            console.log(`API → https://api.rawg.io/api/games?${params.toString()}`);
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
    };
}

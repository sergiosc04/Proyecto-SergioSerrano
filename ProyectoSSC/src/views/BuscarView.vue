<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import tarjetaJuego from '../components/tarjetaJuego.vue';
import Paginacion from '../components/paginacion.vue';
import { getJuegos } from '../compostables/obtenerJuegos';
import SpinnerCarga from '../components/SpinnerCarga.vue';

//Importamos la clave del .env
const claveAPI = import.meta.env.VITE_RAWG_API_KEY;

// Función para obtener los juegos, importada del compostable
const {
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
} = getJuegos();

// Toggle de búsqueda avanzada
const busquedaAvanzada = ref(false);

// Endpoint y lista de géneros para filtro avanzado
const endpointGeneros = `https://api.rawg.io/api/genres?key=${claveAPI}`;
const generos = ref([]);

// Función para obtener géneros desde la API
const getGeneros = async () => {
  try {
    const { data } = await axios.get(endpointGeneros);
    generos.value = data.results;
  } catch (error) {
    console.error('Error al obtener los géneros:', error);
  }
};

// Alternar vista avanzada
const vistaAvanzada = () => (busquedaAvanzada.value = !busquedaAvanzada.value);

onMounted(() => {
  getGeneros();
  obtenerJuegos();
});
</script>

<template>
  <!-- Pantalla de carga -->
  <div v-if="cargando" class="contenedorCarga">
    <SpinnerCarga />
    <p>Cargando catálogo de juegos...</p>
  </div>

  <!-- Contenido principal -->
  <div v-else class="contenedorPrincipal">
    <!-- Cabecera -->
    <header class="cabeceraJuego">
      <h1 class="tituloJuego">Catálogo de Juegos</h1>
      <p class="subtituloJuego">
        Explora, busca y añade tus juegos favoritos a tus colecciones.
      </p>
    </header>

    <div class="contenidoFlex">
      <!-- Panel principal -->
      <main class="panelPrincipal">
        <!-- Buscador -->
        <section class="seccionInfo">
          <h2 class="tituloSeccion">Buscador</h2>

          <div class="barraBusqueda">
            <input type="text" placeholder="Busca un juego..." v-model="buscarInput" class="campoTexto" />
            <button @click="obtenerJuegos()" class="botonControl">Buscar</button>
          </div>

          <div class="grupoBotones">
            <button v-if="busquedaAvanzada" @click="vistaAvanzada()" class="botonSecundario">
              Ocultar opciones avanzadas
            </button>
            <button v-else @click="vistaAvanzada()" class="botonSecundario">
              Ver opciones avanzadas
            </button>
          </div>

          <!-- Búsqueda avanzada -->
          <div v-if="busquedaAvanzada" class="buscadorAvanzado">
            <h3 class="subtituloSeccion">Opciones Avanzadas</h3>

            <div class="formularioBusqueda">
              <div class="grupoFormulario">
                <label class="etiquetaFormulario">Género:</label>
                <select v-model="generoSelect" class="campoSelect">
                  <option value="">Todos los géneros</option>
                  <option v-for="genero in generos" :key="genero.id" :value="genero.slug">
                    {{ genero.name }} ({{ genero.games_count }} juegos)
                  </option>
                </select>
              </div>
            </div>
            <Paginacion v-model:numPagina="paginaInput" v-model:juegosPagina="juegosPagina" :cargando="cargando"
              :paginaAnterior="paginaAnterior" :paginaSiguiente="paginaSiguiente" @actualizarJuegos="obtenerJuegos" />
          </div>
        </section>

        <!-- Listado de juegos -->
        <section class="seccionInfo">
          <h2 class="tituloSeccion">
            <span v-if="idBuscar">Resultados de búsqueda: "{{ idBuscar }}"</span>
            <div v-if="generoSelect">Género: {{ generoSelect }}</div>

            <span v-if="!idBuscar">Juegos recomendados</span>

          </h2>

          <div v-if="juegos.length === 0" class="tarjetaInfo">
            <div class="mensajeInfo">No se encontraron juegos que coincidan con tu búsqueda.</div>
          </div>

          <div v-else class="listadoJuegos">
            <tarjetaJuego v-for="juego in juegos" :key="juego.id" :juego="juego" />
          </div>

          <!-- Paginación -->
          <div class="contenedorPaginacion">
            <Paginacion v-model:numPagina="paginaInput" v-model:juegosPagina="juegosPagina" :cargando="cargando"
              :paginaAnterior="paginaAnterior" :paginaSiguiente="paginaSiguiente" @actualizarJuegos="obtenerJuegos" />
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Estilos principales */
html,
body {
  margin: 0;
  padding: 0;
  background-color: var(--color-fondo);
  min-height: 100vh;
  width: 100%;
}

.contenedorPrincipal {
  min-height: 100vh;
  width: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--color-fondo);
  padding: 2rem;
}

.cabeceraJuego {
  text-align: center;
  margin: 0 auto 2rem auto;
  max-width: 1400px;
  background: var(--gradiente-secundario);
  padding: 1.5rem;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  border: 1px solid var(--color-borde);
}

.cabeceraJuego::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ff6b6b, #7b68ee);
}

.tituloJuego {
  color: var(--color-texto);
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 0 15px rgba(208, 0, 255, 0.3);
}

.subtituloJuego {
  color: var(--color-texto-secundario);
  margin-top: 0.5rem;
  font-size: 1rem;
}

.contenidoFlex {
  display: flex;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Panel principal */
.panelPrincipal {
  background-color: var(--color-fondo);
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.seccionInfo {
  background-color: var(--color-primario);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-borde);
  margin-bottom: 1.5rem;
}

.tituloSeccion {
  color: var(--color-texto);
  font-size: 1.25rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-borde);
  position: relative;
}

.tituloSeccion::before {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 50px;
  height: 2px;
  background: var(--gradiente-primario);
}

.subtituloSeccion {
  color: var(--color-texto);
  font-size: 1.1rem;
  margin: 1.5rem 0 1rem;
}

/* Buscador */
.barraBusqueda {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.campoTexto {
  flex: 1;
  padding: 0.75rem;
  background-color: var(--color-fondo);
  border: 1px solid var(--color-borde);
  border-radius: 6px;
  font-size: 1rem;
  color: var(--color-texto);
}

.campoTexto:focus {
  border-color: var(--color-acento-secundario);
  outline: none;
}

.campoSelect {
  width: 100%;
  padding: 0.75rem;
  background-color: var(--color-fondo);
  border: 1px solid var(--color-borde);
  border-radius: 6px;
  font-size: 1rem;
  color: var(--color-texto);
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}

.campoSelect:focus {
  border-color: var(--color-acento-secundario);
  outline: none;
}

.grupoBotones {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}

.buscadorAvanzado {
  background-color: var(--color-fondo);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid var(--color-borde);
}

.formularioBusqueda {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.grupoFormulario {
  flex: 1;
  min-width: 250px;
}

.etiquetaFormulario {
  display: block;
  color: var(--color-texto-secundario);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

/* Botones */
.botonControl {
  background: var(--color-fondo-boton);
  color: var(--color-texto);
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  min-width: 100px;
}

.botonControl:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.botonSecundario {
  background: var(--gradiente-secundario);
  color: var(--color-texto);
  border: 1px solid var(--color-borde);
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.botonSecundario:hover {
  border-color: var(--color-acento-secundario);
  background: var(--gradiente-terciario);
}

/* Listado de juegos */
.listadoJuegos {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

/* Tarjetas informativas */
.tarjetaInfo {
  background-color: var(--color-fondo);
  border-radius: 8px;
  padding: 1.25rem;
  border: 1px solid var(--color-borde);
  margin-top: 1rem;
}

.mensajeInfo {
  color: var(--color-texto-secundario);
  text-align: center;
  font-size: 1rem;
}

/* Contenedor de paginación */
.contenedorPaginacion {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

/* Pantalla de carga */
.contenedorCarga {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: var(--color-fondo);
  color: var(--color-texto);
}

/* Responsive */
@media (max-width: 768px) {
  .contenedorPrincipal {
    padding: 1rem;
  }

  .barraBusqueda {
    flex-direction: column;
  }

  .tituloJuego {
    font-size: 1.75rem;
  }

  .listadoJuegos {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
}
</style>
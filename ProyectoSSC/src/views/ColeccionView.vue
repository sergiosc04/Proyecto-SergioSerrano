<script setup>
import { ref, onMounted } from 'vue';
import Coleccion from '../components/coleccion.vue';
import { useRoute } from 'vue-router';
import { obtenerColecciones } from '../compostables/obtenerColecciones';
import SpinnerCarga from '@/components/SpinnerCarga.vue';

const route = useRoute();
const idRecibido = Number(route.query.idRecibido);
const nombreColeccion = ref("");
const mostrarCreacion = ref(false);

const {
  colecciones,
  loading,
  error,
  getIdAuth,
  crearColeccion
} = obtenerColecciones();

const toggleCreacion = () => {
  mostrarCreacion.value = !mostrarCreacion.value;
}

const manejarCrearColeccion = async () => {
  const resultado = await crearColeccion(nombreColeccion.value);
  if (resultado) {
    alert(`Colección creada correctamente`);
    nombreColeccion.value = '';
    mostrarCreacion.value = false;
  }
}

onMounted(async () => {
  await getIdAuth();
});

</script>
<template>
  <!-- Pantalla de carga -->
  <div v-if="loading" class="contenedorCarga">
    <SpinnerCarga />
    <p>Cargando colecciones...</p>
  </div>

  <!-- Contenido principal -->
  <div v-else class="contenedorPrincipal">
    <!-- Cabecera -->
    <div class="cabeceraJuego">
      <h1 class="tituloJuego" v-if="idRecibido">Añadir juego a colección</h1>
      <h1 class="tituloJuego" v-else>Mis Colecciones</h1>
      <p class="subtituloJuego" v-if="colecciones && colecciones.length > 0">
        {{ colecciones.length }} colecciones disponibles
      </p><br>

        <button class="botonPrimario" @click="toggleCreacion()" v-if="!mostrarCreacion">
          + Crear nueva colección
        </button>
        
      <form v-if="mostrarCreacion" @submit.prevent="manejarCrearColeccion" class="formularioCreacion">
          <div class="grupoFormulario">
            <label for="nombreColeccion" class="etiquetaFormulario">Nombre de la colección</label>
            <input id="nombreColeccion" v-model="nombreColeccion" type="text" required
              placeholder="Escribe un nombre..." class="campoTexto" />

            <div class="grupoControles">
              <button type="submit" :disabled="loading" class="botonControl">
                {{ loading ? 'Guardando...' : 'Crear colección' }}
              </button>
              <button type="button" class="botonSecundario" @click="toggleCreacion">
                Cancelar
              </button>
            </div>
          </div>
        </form>
    </div>

    <div class="contenidoFlex">
      <!-- Panel principal -->
      <main class="panelPrincipal">

        <!-- Sección de colecciones -->
        <div class="seccionInfo">
          <h2 class="tituloSeccion">Mis colecciones</h2>

          <div v-if="error === 'Sin sesión activa'" class="tarjetaInfo">
          <router-link to="/cuenta/" align="center">
            <strong>Regístrate o Inicia Sesión</strong>
          </router-link>
          para crear y administrar colecciones.
          </div>

          <div v-else-if="error" class="tarjetaInfo">
            <div class="mensajeError">{{ error }}</div>
          </div>

          <div v-else-if="colecciones.length === 0" class="tarjetaInfo">
            <div class="mensajeInfo">No tienes colecciones creadas.</div>
          </div>

          <div v-else class="listaColecciones">
            <Coleccion v-for="(coleccion, index) in colecciones" :key="index" :nombre="coleccion.nombreColeccion"
              :idcoleccion="coleccion.idcoleccion" :idRecibido="idRecibido"
              :juegos="coleccion.datosentrada?.juegos || []" />
          </div>
        </div>
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
  background-color: #1a1c2e;
  min-height: 100vh;
  width: 100%;
}

.contenedorPrincipal {
  min-height: 100vh;
  width: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #1a1c2e;
  padding: 2rem;
  min-width: 320px; /* Añadir ancho mínimo */
  max-width: 1920px; /* Añadir ancho máximo */
  margin: 0 auto; /* Centrar el contenedor */
}

.cabeceraJuego {
  text-align: center;
  margin: 0 auto 2rem auto;
  max-width: 1400px;
  background: linear-gradient(90deg, #1f2136, #252744, #1f2136);
  padding: 1.5rem;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  border: 1px solid #333654;
}

.cabeceraJuego::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(45deg, #d000ff, #00d9ff);
}

.tituloJuego {
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 0 15px rgba(208, 0, 255, 0.3);
}

.subtituloJuego {
  color: #a4a8e0;
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
  background-color: 1a1c2e;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.seccionInfo {
  background-color: #1f2136;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #333654;
  margin-bottom: 1.5rem;
}

.tituloSeccion {
  color: #ffffff;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #333654;
  position: relative;
}

.tituloSeccion::before {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 50px;
  height: 2px;
  background: linear-gradient(to right, #d000ff, #00d9ff);
}

/* Formulario de creación */
.contenedorCreacion {
  display: flex;
  justify-content: center;
  align-items: center;
}

.formularioCreacion {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.grupoFormulario {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.etiquetaFormulario {
  font-weight: 600;
  color: #ffffff;
}

.campoTexto {
  padding: 0.75rem;
  background-color: #1a1c2e;
  border: 1px solid #333654;
  border-radius: 6px;
  font-size: 1rem;
  color: #ffffff;
  width: 100%;
}

.campoTexto:focus {
  border-color: #00d9ff;
  outline: none;
}

.grupoControles {
  display: flex;
  gap: 10px;
  margin-top: 0.5rem;
}

/* Botones */
.botonControl {
  background: linear-gradient(90deg, #d000ff, #00d9ff);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  flex: 1;
}

.botonControl:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.botonSecundario {
  background: linear-gradient(90deg, #252744, #2c2e48);
  color: #ffffff;
  border: 1px solid #333654;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
}

.botonSecundario:hover {
  border-color: #00d9ff;
  background: linear-gradient(90deg, #2c2e48, #333a5f);
}

/* Lista de colecciones */
.listaColecciones {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 200px; /* Añadir altura mínima */
}

/* Tarjetas informativas */
.tarjetaInfo {
  background-color: #1a1c2e;
  border-radius: 8px;
  padding: 1.25rem;
  border: 1px solid #333654;
  margin-top: 1rem;
}

.mensajeInfo {
  color: #a4a8e0;
  text-align: center;
  font-size: 1rem;
}

.mensajeError {
  background-color: #291e23;
  color: #ff5555;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
}

/* Pantalla de carga */
.contenedorCarga {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #1a1c2e;
  color: #ffffff;
  min-width: 320px; /* Añadir el mismo ancho mínimo */
  max-width: 1920px; /* Añadir el mismo ancho máximo */
  margin: 0 auto; /* Centrar el contenedor */
}

/* Responsive */
@media (max-width: 768px) {
  .contenedorPrincipal {
    padding: 1rem;
  }

  .cabeceraJuego {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .tituloJuego {
    font-size: 1.75rem;
  }

  .subtituloJuego {
    font-size: 0.9rem;
    margin: 0.5rem 0;
  }

  .contenidoFlex {
    flex-direction: column;
    gap: 1rem;
  }

  .panelPrincipal {
    gap: 1rem;
  }

  .seccionInfo {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .formularioCreacion {
    padding: 0.5rem;
  }

  .grupoControles {
    flex-direction: column;
    gap: 0.5rem;
  }

  .botonControl,
  .botonSecundario {
    width: 100%;
    padding: 0.75rem;
  }

  .campoTexto {
    padding: 0.5rem;
  }
}

@media (max-width: 480px) {
  .contenedorPrincipal {
    padding: 0.5rem;
  }

  .tituloJuego {
    font-size: 1.5rem;
  }

  .tituloSeccion {
    font-size: 1.1rem;
  }

  .mensajeInfo,
  .mensajeError {
    font-size: 0.9rem;
    padding: 0.75rem;
  }

  .tarjetaInfo {
    padding: 1rem;
  }

  .etiquetaFormulario {
    font-size: 0.9rem;
  }

  .campoTexto {
    font-size: 0.9rem;
  }

  .botonControl,
  .botonSecundario {
    font-size: 0.9rem;
    padding: 0.6rem;
  }
}
</style>
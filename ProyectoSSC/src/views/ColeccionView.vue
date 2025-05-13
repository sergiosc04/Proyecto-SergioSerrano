<script setup>
import { ref, onMounted } from 'vue';
import Coleccion from '../components/coleccion.vue';
import { useRoute } from 'vue-router';
import { obtenerColecciones } from '../compostables/obtenerColecciones';

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

  <h1 class="tituloPrincipal" align="center" v-if="idRecibido">Añadir juego a colección</h1>
  <h1 align="center" v-else>Colecciones</h1>
  <div class="vistaColecciones">

    <div class="containerCreacion">
      <button class="botonPrimario" @click="toggleCreacion()" v-if="!mostrarCreacion">+ Crear nueva colección</button>

      <form v-if="mostrarCreacion" @submit.prevent="manejarCrearColeccion">
        <div class="grupoFormulario">

          <label for="nombreColeccion" class="etiquetaFormulario">Crear nueva colección</label>
          <input id="nombreColeccion" v-model="nombreColeccion" type="text" required placeholder="Escribe un nombre..."
            class="campoTexto" />

          <div class="containerBotones">
            <button type="submit" :disabled="loading" class="botonPrimario">
              {{ loading ? 'Guardando...' : 'Crear colección' }}
            </button>
            <button class="botonPrimario2" @click="toggleCreacion()">
              Cancelar creación
            </button>
          </div>
        </div>
      </form>
    </div>


    <div class="seccionColecciones">

      <div v-if="loading" class="estadoCarga">
        Cargando colecciones...
      </div>

      <div v-else-if="error === 'Sin sesión activa'">
        <div class="sinColecciones">Regístrate o Inicia sesión para ver tus colecciones.</div>

      </div>

      <div v-else-if="error" class="mensajeError">
        {{ error }}
      </div>

      <div v-else>
        <div v-if="colecciones.length === 0" class="sinColecciones">
          <p>No tienes colecciones creadas.</p>
        </div>

        <div v-else class="listaColecciones">
          <Coleccion v-for="(coleccion, index) in colecciones" :key="index" :nombre="coleccion.nombreColeccion"
            :idcoleccion="coleccion.idcoleccion" :idRecibido="idRecibido"
            :juegos="coleccion.datosentrada?.juegos || []" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.containerCreacion {
  display: flex;
  justify-content: center;
  align-items: center;
}

.containerBotones {
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
}


.containerBotones button {
  flex: 1;
}

.vistaColecciones {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.tituloPrincipal {
  color: #2c3e50;
  margin-bottom: 2rem;
}

.subtitulo {
  color: #2c3e50;
  margin: 1.5rem 0;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
}

.formularioCrearColeccion {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.grupoFormulario {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 400px;
}

.etiquetaFormulario {
  font-weight: 600;
  color: #2c3e50;
}

.campoTexto {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  max-width: 1000px;
}

.listaColecciones {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.estadoCarga,
.mensajeError,
.sinColecciones {
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
}

.mensajeError {
  background-color: #ffebee;
  color: #c62828;
}

.sinColecciones {
  background-color: #f5f5f5;
  color: #666;
}
</style>
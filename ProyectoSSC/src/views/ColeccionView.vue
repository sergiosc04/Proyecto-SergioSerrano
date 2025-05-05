<script setup>
import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';
import Coleccion from '../components/coleccion.vue';

//Importamos la clave del .env
const claveAPI = import.meta.env.VITE_RAWG_API_KEY;

// Variables reactivas para almacenar los IDs y datos
const idauth = ref(0);
const idusuario = ref(0);
const colecciones = ref("");

const nombreColeccion = ref("");

const loading = ref(false);
const error = ref(null);



// Función para obtener la sesión actual y extraer el UUID de Supabase
async function getIdAuth() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;

    // Asignamos el UUID del usuario autenticado
    idauth.value = data.session.user.id;
    console.log('IDAUTH:', idauth.value);

    // Obtenemos el ID interno de usuario en nuestra tabla 'usuarios'
    await getIdUsuario(idauth.value);
  } catch (err) {
    console.error('Error obteniendo sesión:', err);
    return;
  }
}

// Función para mapear el UUID de Supabase a nuestro ID interno en la tabla 'usuarios'
async function getIdUsuario(uuid) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('idusuario')
      .eq('idauth', uuid)
      .single();

    if (error) throw error;

    // Asignamos el ID interno de usuario
    idusuario.value = data.idusuario;
    console.log('IDUSUARIO:', idusuario.value);

    // Obtenemos las colecciones asociadas a este usuario
    await getColeccion(idusuario.value);
  } catch (err) {
    console.error('Error obteniendo ID de usuario:', err);
  }
}

// Función para obtener las colecciones del usuario por su ID interno
async function getColeccion(idUsuario) {
  try {
    loading.value = true;  // Iniciamos indicador de carga

    const { data, error } = await supabase
      .from('coleccion')
      .select('datosentrada, nombreColeccion, idcoleccion')
      .eq('idusuario', idUsuario);

    console.log("RESPUESTA COMPLETA DE SUPABASE:", { data, error });
    if (error) throw error;

    // Asignamos el array de colecciones
    colecciones.value = data;
    console.log('Colecciones:', colecciones.value);

  } catch (err) {
    error.value = 'Inicia sesión para ver las colecciones.';
    console.error('Error al obtener las colecciones:', err);
  } finally {
    loading.value = false;
  }
}

async function crearColeccion() {
  if (!idusuario.value) {
    alert("Regístrate o inicia sesión para administrar colecciones.");
    return;
  }

  loading.value = true;
  try {
    const { data, error } = await supabase
      .from('coleccion')
      .insert([{
        idusuario: idusuario.value,
        nombreColeccion: nombreColeccion.value,
      }]);

    if (error) {
      throw error;
    }

    alert(`Colección del usuario ${idusuario.value} llamada ${nombreColeccion.value} creada`);
    location.reload();

    // Limpiar formulario
    nombreColeccion.value = '';

  } catch (err) {
    console.error('Error al crear colección:', err);
    error.value = 'No se pudo crear la colección.';
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  // Llamamos a la función principal para obtener y mostrar datos
  await getIdAuth();

  if (idauth.value) {
    console.log('Usuario autenticado:', idauth.value);
  } else {
    error.value = 'Regístrate o inicia sesión para ver y administrar las colecciones.';
  }
});

</script>

<template>
  <h1 align="center">Colecciones</h1>


  <form @submit.prevent="crearColeccion(idUsuario)" class="formularioColeccion">
    <div>
      <label for="nombreColeccion">Crear nueva colección</label><br>
      <input id="nombreColeccion" v-model="nombreColeccion" type="text" required placeholder="Escribe un nombre..." />


      <button type="submit" :disabled="loading">
        {{ loading ? 'Guardando...' : 'Crear colección' }}
      </button>
    </div>

  </form>
  <div>
    <h2>Tus colecciones:</h2>

    <div v-if="loading">Cargando...</div>

    <!-- si hay error muestra el error -->
    <div v-else-if="error">{{ error }}</div>

    <div v-else>
      <div v-if="colecciones.length === 0">
        <p>No tienes colecciones creadas.</p>
      </div>

      <div v-else>
        <div v-if="colecciones.length === 0">
          <p>No tienes colecciones creadas.</p>
        </div>

        <div v-else class="listaColecciones">
          <Coleccion v-for="(coleccion, index) in colecciones" :key="index" :nombre="coleccion.nombreColeccion"
            :idcoleccion="coleccion.idcoleccion" :items="coleccion.datosentrada?.items || []" />
        </div>
      </div>
    </div>
  </div>
</template>

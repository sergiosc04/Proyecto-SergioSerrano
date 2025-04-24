<script setup>import { ref, onMounted } from 'vue';
import { supabase } from '../supabase';

// Variables reactivas para almacenar los IDs y datos
const idauth = ref(0);        // ID de autenticación de Supabase (UUID)
const idusuario = ref(0);     // ID interno de usuario en nuestra tabla 'usuarios'
const colecciones = ref("");  // Array de colecciones del usuario

const nombreColeccion = ref("");

const loading = ref(false);   // Indicador de carga
const error = ref(null);      // Mensaje de error

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
  }
}

// Función para mapear el UUID de Supabase a nuestro ID interno en la tabla 'usuarios'
async function getIdUsuario(uuid) {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('idusuario')   // Seleccionamos solo la columna idusuario
      .eq('idauth', uuid)     // Buscamos por el campo idauth que coincide con el UUID
      .single();              // Esperamos un único registro

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
      .select('datosentrada')  // Seleccionamos la columna que contiene los datos de la colección
      .eq('idusuario', idUsuario); // Filtramos por el ID interno del usuario

    console.log("RESPUESTA COMPLETA DE SUPABASE:", { data, error });
    if (error) throw error;

    // Asignamos el array de colecciones
    colecciones.value = data;
    console.log('Colecciones:', colecciones.value);

  } catch (err) {
    error.value = 'Inicia sesión para ver las colecciones.';
    console.error('Error al obtener las colecciones:', err);
  } finally {
    loading.value = false; // Terminamos indicador de carga
  }
}


async function crearColeccion() {
  if (!idusuario.value) {
    error.value = 'El usuario no está autenticado o no tiene un ID válido.';
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

    alert(`Colección del usuario ${idusuario.value}, ${nombreColeccion.value} creada`);

    // Limpiar formulario
    nombreColeccion.value = '';

  } catch (err) {
    console.error('Error al crear colección:', err);
    error.value = 'No se pudo crear la colección.';
  } finally {
    loading.value = false;
  }
}

// Hook del ciclo de vida: se ejecuta al montar el componente
onMounted(async () => {
  // Llamamos a la función principal para obtener y mostrar datos
  await getIdAuth();
});

</script>

<template>
  <h1 align="center">Colecciones</h1>


  <form @submit.prevent="crearColeccion(idUsuario)" class="space-y-4 max-w-sm mx-auto">
    <div>
      <label for="nombreColeccion">Crear nueva colección</label><br>
      <input id="nombreColeccion" v-model="nombreColeccion" type="text" required placeholder="Escribe un nombre..." />


      <button type="submit" :disabled="loading">
        {{ loading ? 'Guardando...' : 'Crear colección' }}
      </button>
      <p v-if="error">Error: {{ error }}</p>

    </div>

  </form>
  <div>
    <h2>Tus colecciones:</h2>
    <div v-if="loading">Cargando...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <div v-if="colecciones.length === 0">
        <p>No tienes colecciones creadas.</p>
      </div>
      <div v-else>
        <div v-for="(coleccion, coleccionIndex) in colecciones" :key="coleccionIndex">
          <p>Colección {{ coleccionIndex + 1 }}:</p>
          <div v-if="coleccion.datosentrada?.items">
            <div v-for="(itemId, itemIndex) in coleccion.datosentrada.items" :key="itemIndex">
              {{ itemId }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

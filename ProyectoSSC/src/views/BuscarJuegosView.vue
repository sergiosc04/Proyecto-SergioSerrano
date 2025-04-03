<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import tarjetaJuego from '@/components/tarjetaJuego.vue';

export default {
  name: 'buscar',

  components: {
    tarjetaJuego,
  },
  setup() {

    const endpoint = `https://api.rawg.io/api/genres?key=9c8533b1b08441e680f0d26ed85dc61b`;
    //Var para cargar juegos
    let juegos = ref([]);
    let idBuscar = ref("");
    let juegosPagina = ref(20);

    //Var para cargar generos
    let generos = ref([]);
    let generoSelect = ref("");

    //Var para cargar paginas
    let numPagina = ref(1);
    let cargando = ref(false);
    let previousPage = ref(null);
    let nextPage = ref(null);


    //Funcion para buscar juegos
    const buscarJuegos = async () => {
      try {
        const endpoint = `https://api.rawg.io/api/games?key=9c8533b1b08441e680f0d26ed85dc61b&search=${idBuscar.value}&page_size=${juegosPagina.value}&page=${numPagina.value}&genres=${generoSelect.value}`;
        const response = await axios.get(endpoint);

        juegos.value = response.data.results;
        previousPage.value = response.data.previous;
        nextPage.value = response.data.next;

      } catch (error) {
        console.error("Error al obtener los juegos:", error);
      }
    };

    //Función para cambiar el endpoint

    //Función para cambiar de página - DISTINTO A LA FUNCION DE ListadoJuegosView (la pagina es dinamica)
    const cambiarPagina = (direccion) => {
      if (cargando.value) return; // Evita cambios si ya está cargando

      cargando.value = true;

      setTimeout(() => {
        if (direccion === 'siguiente' && nextPage.value) {
          numPagina.value++; // Aumentar página si es "siguiente"
        } else if (direccion === 'anterior' && previousPage.value && numPagina.value > 1) {
          numPagina.value--; // Disminuir página si es "anterior"
        }

        buscarJuegos(); // Vuelve a hacer la petición con el nuevo número de página
        cargando.value = false;
      }, 500);
    };

    //Funcion para buscar Generos
    const getGeneros = async () => {
      try {
        const response = await axios.get(endpoint);
        generos.value = response.data.results;

        console.log(generos.value);

      } catch (error) {
        console.error("Error al obtener los juegos:", error);
      }
    };

    onMounted(() => {
      getGeneros();
    });

    return {
      //Variables de juegos
      juegos,
      idBuscar,
      juegosPagina,

      //Variables de pagina
      numPagina,
      previousPage,
      nextPage,
      cargando,

      //Variables de generos
      generos,
      generoSelect,

      //Métodos de Juegos
      buscarJuegos,

      //Métodos de Paginas
      cambiarPagina,

      //Metodos de generos
      getGeneros,
    };
  }
}

</script>

<template>
  <main>
    <h1>Buscar juegos</h1>

    <div class='buscador'>
      <span>
        <label>
          Buscar:
          <input type="text" placeholder="Busca un juego" v-model="idBuscar">
        </label>
        <label>
          Juegos/página:
          <input type="text" placeholder="Juegos por página" v-model="juegosPagina">
        </label>
        <label>
          Nº página:
          <input type="text" placeholder="Nº de página" v-model="numPagina">
        </label>
        <br>
        <label for="selectGenero">

          Género:
          <!-- Selector de generos -->
          <select name="selectGenero" id="selectGenero" v-model="generoSelect" placeholder="Todos los géneros">
            <option v-for="genero in generos" :key="genero.id" :value="genero.slug">
              {{ genero.name }} ({{ genero.games_count }} juegos)
            </option>

          </select>
        </label>

        <br>
        <button type="submit" @click="buscarJuegos()">Buscar</button>
      </span>
    </div>

    <div class="contenedorJuegos">

      <div class="contenedorBotones"><br> Página {{ numPagina }} <br>

        <!-- Botón de página siguiente solo si existe y no está en estado "cargando" -->
        <button v-if="nextPage" @click="cambiarPagina('siguiente')" :disabled="cargando">Página siguiente</button>

        <!-- Botón de página anterior solo si existe y no está en estado "cargando" -->
        <button v-if="previousPage" @click="cambiarPagina('anterior')" :disabled="cargando">Página anterior</button>
      </div><br>

      <div class="listadoJuegos">
        <!-- Se pasan los datos del juego a la tarjeta -->
        <span v-for="juego in juegos" :key="juego.id" class="listadoJuegos">
          <tarjetaJuego :juego="juego"></tarjetaJuego>
        </span>
      </div>
    </div>
  </main>
</template>


<style></style>

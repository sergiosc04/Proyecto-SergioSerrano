<script>
import { ref } from 'vue';
export default {
  setup() {

  }
}

</script>

<template>
  <div>
    <h1>Búsqueda avanzada de juegos</h1>

    <form @submit.prevent("")>

    </form>

  </div>


  <!-- Para buscar segun el nombre, usar endpoint (https://api.rawg.io/api/games?key=9c8533b1b08441e680f0d26ed85dc61b&search={game_name}&page_size={page_size}&page={page}) 
    Si quieres realizar una búsqueda específica ,usa el parámetro search:

    Parámetros:
       - search: Nombre del juego.
       - page_size: Juegos por página.
       - page: Número de la página. -->

</template>

<style></style>

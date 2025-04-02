<script>
//Funcion para buscar detalles de un juego

const buscarJuegos = async () => {
  try {
    const endpoint = `https://api.rawg.io/api/games/${idJuego}?key=9c8533b1b08441e680f0d26ed85dc61b`;
    const response = await axios.get(endpoint);

    juegos.value = response.data.results;
    previousPage.value = response.data.previous;
    nextPage.value = response.data.next;

  } catch (error) {
    console.error("Error al obtener los juegos:", error);
  }
};
</script>

<template>
  <div>
    <h1>Vista de detalles del juego</h1>
  </div>
</template>

<style></style>

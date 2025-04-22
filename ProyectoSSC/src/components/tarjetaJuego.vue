<template>
    <div class="tarjetaJuego">
        <img :src="juego.background_image" alt="Imagen del juego" class="juego-img" />

        <div class="tarjeta--contenido">
            <h2><router-link :to="`/juego/${juego.slug}`">{{ juego.name }}</router-link></h2>
            <ul>
                <li><strong>ID:</strong> {{ juego.id }}</li>
                <li><strong>Fecha de salida:</strong> {{ juego.released }}</li>
                <li><strong>Calificación:</strong> {{ juego.rating }} / 5 ★</li>
            </ul>
        </div>

        <div class="accionesJuegos">
            <router-link :to="`/juego/${juego.slug}`">
                <button class="boton-accion">Ver juego</button>
            </router-link>

            <router-link :to="`/coleccion`">
                <button class="boton-accion">Añadir a colección</button>
            </router-link>
        </div>
    </div>
</template>

<script>
export default {
    name: "tarjetaJuego",
    props: {
        juego: {
            type: Object,
            required: true,
        },
    },
};
</script>

<style scoped>
a {
    color: black;
    text-decoration: none;
}

.tarjetaJuego {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    background-color: #f9f9fc;
    border: 1px solid gray;
    border-radius: 10px;
    width: 20vw;
    min-width: 250px;
    max-width: 300px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    transition: transform 0.3s ease;
    height: 100%;
    /* asegura altura constante si se usa en grid */
}

.tarjetaJuego:hover {
    transform: translateY(-5px);
}

.juego-img {
    width: 100%;
    height: 180px;
    object-fit: cover;
}

.tarjeta--contenido {
    padding: 1rem;
    flex-grow: 1;
}

.tarjetaJuego h2 {
    text-align: center;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    color: #2d2d44;
}

.tarjetaJuego ul {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem 0;
    font-size: 0.9rem;
    color: #555;
}

.tarjetaJuego li {
    margin-bottom: 0.4rem;
}

.accionesJuegos {
    display: flex;
    justify-content: center;
    gap: 10px;
    padding: 0.8rem;
    border-top: 1px solid #ddd;
    background-color: #f0f0f8;
    flex-wrap: wrap;
}

.boton-accion {
    background-color: #2d2d44;
    color: #fff;
    border: none;
    padding: 0.5rem 0.8rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

.boton-accion:hover {
    background-color: #4f4f6e;
    transform: translateY(-2px);
}
</style>
<script>
import { ref } from 'vue';

export default {
    name: 'navbar',

    components: {
    },

    setup() {
        let idBuscar = ref("");
        let verBuscar = ref(false);

        let visibleBuscar = () => {
            verBuscar.value = !verBuscar.value;
            console.log(verBuscar);
        }

        return {
            idBuscar,
            verBuscar,
            visibleBuscar,
        }
    }

}
</script>

<template>
    <nav class="navbar">

        <!-- Cambiar el logo por el correcto cuando lo tenga-->
        <a href="/">
            <img src="../assets/img/logoPH.jpg" alt="Placeholder" height="80px">
        </a>

        <!-- Enlace a inicio de sesión -->
        <RouterLink class="link--navbar" to="/"><button>inicio</button></RouterLink>

        <!-- Enlace a página de búsqueda -->
        <RouterLink class="link--navbar" to="/buscar/"><button>Buscar</button></RouterLink>

        <!-- Aparece un boton para buscar, cuando se pulsa se esconde y aparece la busqueda con los detalles -->
        <!-- <span v-show="!verBuscar">
            <button @click="visibleBuscar()">Abrir búsqueda</button>
        </span>

        <span v-show="verBuscar" class="verBuscar">
            <buscar />
            <button @click="visibleBuscar()">X</button>
        </span> -->

        <!-- Deberá estar oculto hasta que se inicie sesión -->
        <RouterLink class="link--navbar" to="/deseados"><button>Lista de deseados</button></RouterLink>

        <!-- Deberá mostrarse hasta q se inicie sesión-->
        <RouterLink class="link--navbar" to="/registro"><button>Registrarse</button></RouterLink>
        <RouterLink class="link--navbar" to="/login"><button>Iniciar Sesión</button></RouterLink>
    </nav>
</template>

<style>
.navbar {
    display: flex;
    align-items: center;
}

.verBuscar {
    display: flex;
    align-items: center;
}
</style>
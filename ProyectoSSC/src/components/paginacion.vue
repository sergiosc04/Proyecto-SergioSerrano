<template>
    <div class="contenedorPagina">
        <img v-if="paginaAnterior" src="../assets/img/botones/back.png" alt="Página anterior"
            @click="cambiar('anterior')" :disabled="cargando" />
        <strong>Página {{ numPagina }}</strong>
        <img v-if="paginaSiguiente" src="../assets/img/botones/next.png" alt="Página siguiente"
            @click="cambiar('siguiente')" :disabled="cargando" />
    </div>
</template>

<script>
export default {
    props: {
        numPagina: Number,
        cargando: Boolean,
        paginaAnterior: String,
        paginaSiguiente: String,

        // buscado indica si se ha realizado una búsqueda, y el evento `update:buscado` notifica al componente padre sobre el cambio de este estado.
        buscado: {
            type: Boolean,
            required: false,
            default: null,
        },
    },
    emits: ['update:numPagina', 'actualizarJuegos', 'update:buscado'], // Emision de eventos

    methods: {
        cambiar(direccion) {
            if (this.cargando) return;

            setTimeout(() => {
                let nuevaPagina = this.numPagina;

                if (nuevaPagina === 0) {
                    nuevaPagina = Math.floor(Math.random() * 100) + 1;
                } else if (direccion === 'siguiente' && this.paginaSiguiente) {
                    nuevaPagina++;
                } else if (direccion === 'anterior' && this.paginaAnterior && nuevaPagina > 1) {
                    nuevaPagina--;
                }

                // se emiten los cambios necesarios
                this.$emit('update:numPagina', nuevaPagina);
                this.$emit('actualizarJuegos');

                if (this.buscado !== null) {
                    this.$emit('update:buscado', true);
                    console.log(true);
                }
            }, 500);
        },
    },
};
</script>

<style scoped>
.contenedorPagina {
    position: fixed;
    bottom: 10px;
    left: 10px;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px;
    border: 1px solid gray;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    display: flex;
    align-items: center;
}

.contenedorPagina img {
    width: 20px;
    height: 20px;
    margin: 0 5px;
    cursor: pointer;
}
</style>

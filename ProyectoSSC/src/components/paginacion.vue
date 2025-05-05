<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    numPagina: {
        type: [Number, String],
        required: true
    },

    juegosPagina: {
        type: [Number, String],
        required: true
    },

    cargando: {
        type: Boolean,
        default: false
    },

    paginaAnterior: {
        type: [Boolean, String, null],
        default: null
    },

    paginaSiguiente: {
        type: [Boolean, String, null],
        default: null
    }
});

const emit = defineEmits(['update:numPagina', 'update:juegosPagina', 'actualizarJuegos', 'cambiarPagina']);

const cambiarPagina = (direccion) => {
    if (props.cargando) return;
    let nuevaPagina = Number(props.numPagina);
    if (direccion === 'siguiente' && props.paginaSiguiente) nuevaPagina++;
    else if (direccion === 'anterior' && props.paginaAnterior && nuevaPagina > 1) nuevaPagina--;
    else return;

    emit('update:numPagina', nuevaPagina);
    emit('cambiarPagina', nuevaPagina);
};


const cambiarJuegos = (direccion) => {
    if (props.cargando) return;
    let nuevosJuegos = Number(props.juegosPagina);
    if (direccion === 'siguiente' && props.paginaSiguiente) nuevosJuegos++;
    else if (direccion === 'anterior' && props.paginaAnterior && nuevosJuegos > 1) nuevosJuegos--;
    else return;

    emit('update:juegosPagina', nuevosJuegos);
    emit('cambiarJuegos', nuevosJuegos);
};

//Funcion para cambiar la página
const irAPagina = () => {
    if (props.cargando) return;
    emit('actualizarJuegos');
};

//Funcion para actualizar el num de página
const actualizarNumPagina = (event) => {
    emit('update:numPagina', event.target.value);
};

//Funcion para actualizar los juegos por página
const actualizarJuegosPagina = (event) => {
    emit('update:juegosPagina', event.target.value);
};
</script>

<template>
    <div class="paginacion">

        <div class="inputs">
            <!-- controles de paginas -->
            <div class="controles pagina">
                <img src="../assets/img/botones/back.png" alt="Anterior"
                    :class="{ 'boton-img': true, 'disabled': !paginaAnterior || cargando || Number(numPagina) <= 1 }"
                    @click="cambiarPagina('anterior')" />

                <div class="campo">
                    <label for="numPagina">Página</label>
                    <input id="numPagina" type="number" :value="numPagina" @input="actualizarNumPagina" min="1"
                        :disabled="cargando" class="input" />
                </div>

                <img src="../assets/img/botones/next.png" alt="Siguiente"
                    :class="{ 'boton-img': true, 'disabled': !paginaSiguiente || cargando }"
                    @click="cambiarPagina('siguiente')" />
            </div>

            <!-- controles de juegos/pagina -->
            <div class="controles juegos">
                <img src="../assets/img/botones/back.png" alt="Menos juegos"
                    :class="{ 'boton-img': true, 'disabled': !paginaAnterior || cargando || Number(numPagina) <= 1 }"
                    @click="cambiarJuegos('anterior')" />

                <div class="campo">
                    <label for="juegosPagina">Juegos/Página</label>
                    <input id="juegosPagina" type="number" :value="juegosPagina" @input="actualizarJuegosPagina" min="1"
                        :disabled="cargando" class="input" />
                </div>

                <img src="../assets/img/botones/next.png" alt="Más juegos"
                    :class="{ 'boton-img': true, 'disabled': !paginaSiguiente || cargando }"
                    @click="cambiarJuegos('siguiente')" />
            </div>


        </div><button @click="irAPagina" :disabled="cargando" class="ir-btn"
            title="Ir a la página especificada">Ir</button>

    </div>
</template>

<style scoped>
.paginacion {
    display: flex;
    margin-left: 38%;
    margin-right: 38%;
    margin-bottom: 20px;
    margin-top: 20px;

    align-items: center;
    justify-content: center;
    gap: 15px;

    padding: 10px 20px;
    background: #f9f9fb;

    border: 0.5px solid #ccc;
    border-radius: 12px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    font-family: 'Segoe UI', sans-serif;
}

.controles {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    gap: 5px;
}

.inputs {
    display: flex;
    align-items: flex-end;
    gap: 10px;
}

.campo {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    color: #333;
}

.campo label {
    margin-bottom: 4px;
    font-weight: 500;
}

.input {
    width: 70px;
    padding: 6px 8px;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.input:focus {
    outline: none;
    border-color: #7b84ff;
    box-shadow: 0 0 0 2px #c7ccff;
}

.boton,
.ir-btn {
    background-color: #2d2d44;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 6px 14px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s, transform 0.2s;
}

.boton:hover:not(:disabled),
.ir-btn:hover:not(:disabled) {
    background-color: #505072;
    transform: translateY(-1px);
}

.boton:disabled,
.ir-btn:disabled {
    background-color: #bbbcc5;
    cursor: not-allowed;
    transform: none;
}

.boton-img {
    width: 32px;
    height: 32px;
    padding: 6px;
    cursor: pointer;
    border-radius: 6px;
    transition: background-color 0.3s, transform 0.2s;
}

.boton-img:hover:not(.disabled) {
    background-color: #505072;
    transform: translateY(-1px);
}

.boton-img.disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #bbbcc5;
}
</style>

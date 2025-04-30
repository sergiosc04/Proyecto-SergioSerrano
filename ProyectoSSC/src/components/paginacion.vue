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

const irAPagina = () => {
    if (props.cargando) return;
    emit('actualizarJuegos');
};

const actualizarNumPagina = (event) => {
    emit('update:numPagina', event.target.value);
};

const actualizarJuegosPagina = (event) => {
    emit('update:juegosPagina', event.target.value);
};
</script>

<template>
    <div class="paginacion">

        <div class="inputs">

            <button :disabled="!paginaAnterior || cargando || Number(numPagina) <= 1" @click="cambiarPagina('anterior')"
                class="boton">
                ⬅
            </button>

            <div class="campo">

                <label for="numPagina">Página</label>
                <input id="numPagina" type="number" :value="numPagina" @input="actualizarNumPagina" min="1"
                    :disabled="cargando" class="input" />
            </div>

            <button :disabled="!paginaSiguiente || cargando" @click="cambiarPagina('siguiente')" class="boton">
                ➡
            </button>

            <div class="campo">
                <label for="juegosPagina">Juegos/Página</label>
                <input id="juegosPagina" type="number" :value="juegosPagina" @input="actualizarJuegosPagina" min="1"
                    :disabled="cargando" class="input" />
            </div>

            <button @click="irAPagina" :disabled="cargando" class="ir-btn"
                title="Ir a la página especificada">Ir</button>
        </div>

    </div>
</template>

<style scoped>
.paginacion {
    display: flex;
    margin-left: 40%;
    margin-right: 40%;
    margin-bottom: 20px;

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
</style>

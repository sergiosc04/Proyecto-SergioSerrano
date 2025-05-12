<script setup>
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
    <div class="paginador">
        <div class="paginador-contenedor">
            <!-- Controles de navegación de páginas -->
            <div class="paginador-navegacion">
                <button class="paginador-btn" :disabled="!paginaAnterior || cargando || Number(numPagina) <= 1"
                    @click="cambiarPagina('anterior')">
                    <img src="../assets/img/botones/back.png" alt="Anterior" class="paginador-icono" />
                </button>

                <div class="paginador-pagina">
                    <label for="numPagina">Página</label>
                    <input id="numPagina" type="number" :value="numPagina" @input="actualizarNumPagina" min="1"
                        :disabled="cargando" />
                </div>

                <button class="paginador-btn" :disabled="!paginaSiguiente || cargando"
                    @click="cambiarPagina('siguiente')">
                    <img src="../assets/img/botones/next.png" alt="Siguiente" class="paginador-icono" />
                </button>
            </div>

            <!-- Selector de elementos por página -->
            <div class="paginador-selector">
                <label for="juegosPagina">Mostrar</label>
                <input id="juegosPagina" type="number" :value="juegosPagina" @input="actualizarJuegosPagina" min="1"
                    :disabled="cargando" />
                <span>por página</span>
            </div>

            <!-- Botón de ir a página -->
            <button @click="irAPagina" :disabled="cargando" class="paginador-ir-btn">
                Ir
            </button>
        </div>
    </div>
</template>

<style scoped>
.paginador {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 30px 0;
    font-family: 'Segoe UI', Arial, sans-serif;
}

.paginador-contenedor {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 12px 24px;
    background-color: #f5f7fa;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    max-width: 600px;
}

.paginador-navegacion {
    display: flex;
    align-items: center;
    gap: 10px;
}

.paginador-pagina {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
}

.paginador-pagina label {
    color: #555;
    font-weight: 500;
}

.paginador-pagina input {
    width: 60px;
    text-align: center;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
}

.paginador-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #555;
}

.paginador-selector input {
    width: 50px;
    text-align: center;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
}

.paginador-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 6px;
    background-color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.paginador-btn:hover:not(:disabled) {
    background-color: #eef1f6;
    transform: translateY(-1px);
}

.paginador-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f0f0f0;
}

.paginador-icono {
    width: 16px;
    height: 16px;
}

.paginador-ir-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background-color: #4a55b5;
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.paginador-ir-btn:hover:not(:disabled) {
    background-color: #3a44a0;
    transform: translateY(-1px);
}

.paginador-ir-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

input:focus {
    outline: none;
    border-color: #4a55b5;
    box-shadow: 0 0 0 2px rgba(74, 85, 181, 0.2);
}
</style>
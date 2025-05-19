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
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.paginador-contenedor {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 12px 24px;
    background-color: #1f2136;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    max-width: 600px;
    border: 1px solid #333654;
    position: relative;
}

.paginador-contenedor::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, #d000ff, #00d9ff);
    border-radius: 8px 8px 0 0;
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
    color: #a4a8e0;
    font-weight: 500;
}

.paginador-pagina input {
    width: 60px;
    text-align: center;
    padding: 8px;
    border: 1px solid #333654;
    border-radius: 6px;
    font-size: 14px;
    background-color: #1a1c2e;
    color: #ffffff;
}

.paginador-selector {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #a4a8e0;
}

.paginador-selector input {
    width: 50px;
    text-align: center;
    padding: 8px;
    border: 1px solid #333654;
    border-radius: 6px;
    font-size: 14px;
    background-color: #1a1c2e;
    color: #ffffff;
}

.paginador-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: 1px solid #333654;
    border-radius: 6px;
    background-color: #1a1c2e;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.paginador-btn:hover:not(:disabled) {
    border-color: #00d9ff;
    background-color: #252744;
    transform: translateY(-1px);
}

.paginador-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #1a1c2e;
}

.paginador-icono {
    width: 16px;
    height: 16px;
    filter: invert(1);
}

.paginador-ir-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background: var(--color-fondo-boton);
    color: white;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
}

.paginador-ir-btn:hover:not(:disabled) {
    opacity: 0.9;
    transform: scale(1.05);
}

.paginador-ir-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

input:focus {
    outline: none;
    border-color: #00d9ff;
    box-shadow: 0 0 0 2px rgba(0, 217, 255, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
    .paginador-contenedor {
        flex-direction: column;
        padding: 16px;
        gap: 16px;
    }

    .paginador-selector {
        order: 3;
    }

    .paginador-ir-btn {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .paginador-navegacion {
        width: 100%;
        justify-content: space-between;
    }

    .paginador-pagina input,
    .paginador-selector input {
        width: 45px;
    }
}
</style>
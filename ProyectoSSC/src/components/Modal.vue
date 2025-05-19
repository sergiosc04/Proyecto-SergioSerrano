<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    mostrar: {
        type: Boolean,
        required: true,
    },
    titulo: {
        type: String,
        default: 'Aviso'
    },
    mensaje: {
        type: String,
        required: true
    },
    tipo: {
        type: String,
        default: 'alerta',
        validator: (value) => ['alerta', 'confirmar'].includes(value)
    },
    textoConfirmar: {
        type: String,
        default: 'Confirmar'
    },
    textoCancelar: {
        type: String,
        default: 'Cancelar'
    }
});

const emit = defineEmits(['confirmar', 'cancelar', 'cerrar', 'update:mostrar']);

const confirmar = () => {
    emit('confirmar');
    emit('update:mostrar', false);
};

const cancelar = () => {
    emit('cancelar');
    emit('update:mostrar', false);
};

const cerrar = () => {
    emit('cerrar');
    emit('update:mostrar', false);
};
</script>

<template>
    <div v-if="mostrar" class="fondoModal">
        <div class="contenedorModal">
            <h2 class="tituloModal">{{ titulo }}</h2>
            <p class="contenidoModal">{{ mensaje }}</p>
            <div class="botonesModal">
                <button v-if="tipo === 'confirmar'" @click="confirmar" class="botonPrimario">
                    {{ textoConfirmar }}
                </button>
                <button v-if="tipo === 'confirmar'" @click="cancelar" class="botonSecundario">
                    {{ textoCancelar }}
                </button>
                <button v-if="tipo === 'alerta'" @click="cerrar" class="botonPrimario">
                    Aceptar
                </button>
            </div>
        </div>
    </div>
</template>


<style scoped>
.fondoModal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.contenedorModal {
    background: var(--color-primario);
    border-radius: 12px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--color-borde);
}

.tituloModal {
    color: var(--color-texto);
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
}

.contenidoModal {
    color: var(--color-texto-secundario);
    font-size: 1rem;
    margin-bottom: 1.5rem;
}

.botonesModal {
    display: flex;
    justify-content: center;
}

.botonPrimario:hover,
.botonSecundario:hover {
    opacity: 0.9;
    transform: scale(1.05);
}
</style>

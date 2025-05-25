<script setup>
// Define las propiedades que recibe el componente con sus tipos, valores por defecto y validadores
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

// Define los eventos que puede emitir el componente
const emit = defineEmits(['confirmar', 'cancelar', 'cerrar', 'update:mostrar']);

// Función que emite el evento confirmar y cierra el modal
const confirmar = () => {
    emit('confirmar');
    emit('update:mostrar', false);
};

// Función que emite el evento cancelar y cierra el modal
const cancelar = () => {
    emit('cancelar');
    emit('update:mostrar', false);
};

// Función que emite el evento cerrar y cierra el modal
const cerrar = () => {
    emit('cerrar');
    emit('update:mostrar', false);
};
</script>

<template>
    <!-- Modal visible solo si 'mostrar' es true -->
    <div v-if="mostrar" class="fondoModal">
        <div class="contenedorModal">
            <h2 class="tituloModal">{{ titulo }}</h2>
            <p class="contenidoModal">{{ mensaje }}</p>

            <div class="botonesModal">
                <!-- Botones para tipo 'confirmar' -->
                <button v-if="tipo === 'confirmar'" @click="confirmar" class="botonPrimario">
                    {{ textoConfirmar }}
                </button>
                <button v-if="tipo === 'confirmar'" @click="cancelar" class="botonPrimario">
                    {{ textoCancelar }}
                </button>
                <!-- Botón para tipo 'alerta' -->
                <button v-if="tipo === 'alerta'" @click="cerrar" class="botonPrimario">
                    Aceptar
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Fondo oscuro semi-transparente que cubre toda la pantalla */
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

/* Contenedor blanco del modal con bordes redondeados y sombra */
.contenedorModal {
    background: var(--color-primario);
    border-radius: 12px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border: 1px solid var(--color-borde);
}

/* Estilo del título dentro del modal */
.tituloModal {
    color: var(--color-texto);
    font-size: 1.5rem;
    margin: 0 0 1rem 0;
}

/* Estilo del mensaje dentro del modal */
.contenidoModal {
    color: var(--color-texto-secundario);
    font-size: 1rem;
    margin-bottom: 1.5rem;
}

/* Contenedor para los botones, centrados */
.botonesModal {
    display: flex;
    justify-content: center;
}

/* Efecto hover para botones primarios y secundarios */
.botonPrimario:hover,
.botonSecundario:hover {
    opacity: 0.9;
    transform: scale(1.05);
}
</style>

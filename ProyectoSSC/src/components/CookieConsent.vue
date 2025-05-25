<script setup>
import { ref, onMounted } from 'vue';

const mostrarAviso = ref(false);

const aceptarCookies = () => {
    localStorage.setItem('cookiesAceptadas', 'true');
    mostrarAviso.value = false;
};

onMounted(() => {
    // Comprobar si ya se han aceptado las cookies
    const cookiesAceptadas = localStorage.getItem('cookiesAceptadas');
    if (!cookiesAceptadas) {
        mostrarAviso.value = true;
    }
});
</script>

<template>
    <div v-if="mostrarAviso" class="cookieOverlay">
        <div class="cookieContenido">
            <div class="cookieInfo">
                <h2>🍪 Aviso de cookies</h2>
                <p>
                    Utilizamos cookies propias y de terceros para mejorar tu experiencia y mostrar contenido personalizado.
                </p>
            </div>
            <div class="cookieBotones">
                <button class="botonAceptar" @click="aceptarCookies">Aceptar</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.cookieOverlay {
    position: fixed;
    bottom: 1.5rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    display: flex;
    justify-content: center;
    width: 90%;
    max-width: 1200px;
}

.cookieContenido {
    background: var(--color-primario);
    border: 1px solid var(--color-borde);
    border-radius: 12px;
    padding: 1rem 1.5rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    animation: deslizarArriba 0.3s ease-out;
    backdrop-filter: blur(10px);
    background: linear-gradient(
        to right,
        rgba(31, 33, 54, 0.95),
        rgba(37, 39, 68, 0.95)
    );
}

.cookieInfo {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.cookieContenido h2 {
    color: var(--color-texto);
    font-size: 1.1rem;
    margin: 0;
    white-space: nowrap;
}

.cookieContenido p {
    color: var(--color-texto-secundario);
    line-height: 1.4;
    margin: 0;
    font-size: 0.9rem;
}

.cookieBotones {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.botonAceptar, .botonRechazar {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.botonAceptar {
    background: linear-gradient(90deg, #7b68ee, #d000ff);
    color: white;
    border: none;
}

.botonRechazar {
    background: transparent;
    color: var(--color-texto);
    border: 1px solid var(--color-borde);
}

.botonAceptar:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(123, 104, 238, 0.3);
}

.botonRechazar:hover {
    background: rgba(255, 255, 255, 0.1);
}

@keyframes deslizarArriba {
    from {
        transform: translateY(100%);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@media (max-width: 768px) {
    .cookieOverlay {
        bottom: 0;
        width: 100%;
        border-radius: 12px 12px 0 0;
    }

    .cookieContenido {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
    }

    .cookieBotones {
        width: 100%;
        flex-direction: column;
    }

    .botonAceptar,
    .botonRechazar {
        width: 100%;
        text-align: center;
    }
}
</style>
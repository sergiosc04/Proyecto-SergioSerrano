<script setup>
import { ref, onMounted } from 'vue';
import { useSessionStore } from '../stores/session.js';
import { RouterLink } from 'vue-router';
import { useObtenerNombreUsuario } from '../compostables/obtenerNombreUsuario.js';

const sessionStore = useSessionStore();
const { nombreUsuario, obtenerUsername } = useObtenerNombreUsuario();
const menuAbierto = ref(false);

const toggleMenu = () => {
  menuAbierto.value = !menuAbierto.value;
};

onMounted(async () => {
  await sessionStore.recuperarSesion();
  await obtenerUsername();
});
</script>

<template>
  <nav class="navbarContenedor">
    <div class="navbarContenido">
      <!-- Logo -->
      <RouterLink to="/" class="navbarLogo">
        <img src="../assets/img/logo/PixelRift-Logo-Colores.png" alt="PixelRift Logo" />
      </RouterLink>

      <!-- Botón hamburguesa para móvil -->
      <button class="menuBoton" @click="toggleMenu">
        <img src="../assets/img/botones/menuHamburguesa.png" alt="Menú" />
      </button>

      <!-- Links navegación (escritorio y móvil) -->
      <div class="navbarLinks" :class="{ 'menuAbierto': menuAbierto }">
        <RouterLink class="navEnlace" to="/" @click="menuAbierto = false">INICIO</RouterLink>
        <RouterLink class="navEnlace" to="/catalogo/" @click="menuAbierto = false">CATÁLOGO</RouterLink>
        <RouterLink class="navEnlace" to="/coleccion/" @click="menuAbierto = false">COLECCIONES</RouterLink>
        <RouterLink class="navEnlace" to="/cuenta/" @click="menuAbierto = false">CUENTA</RouterLink>
      </div>

      <!-- Datos de la sesión -->
      <div class="navbarSesion">
        <RouterLink class="navbarUsuarioNombre" to="/cuenta/">
          {{ nombreUsuario || "Iniciar sesión" }}
        </RouterLink>

        <RouterLink class="navbarUsuarioAvatar" to="/cuenta/">
          <img 
            v-if="sessionStore.avatarUrl" 
            :src="sessionStore.avatarUrl" 
            alt="Usuario" 
          />
          <img 
            v-else 
            src="../assets/img/usuarioPH.jpg" 
            alt="Usuario"
          />
        </RouterLink>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbarContenedor {
  background: linear-gradient(120deg, #101d4f 0%, #4e0e78 50%, #730979 100%);
  padding: 0.8rem 1.5rem;
  box-shadow: 0 4px 12px rgba(116, 9, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
  color: #fff;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.navbarContenido {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
}

.navbarLogo img {
  height: 60px; /* Aumentado de 45px */
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.navbarLogo img:hover {
  transform: scale(1.08) rotate(-2deg);
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));

/* Animación de cambio de color (hue-rotate) al pasar el ratón */
transition: filter 0.6s infinite;
animation: rotarColores 1.5s linear;
animation-iteration-count: infinite;
}

@keyframes rotarColores {
from {
    filter: hue-rotate(0deg) drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
}
to {
    filter: hue-rotate(360deg) drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
}

}

.menuBoton {
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 110;
}

.menuBoton img {
  width: 28px;
  height: 28px;
  filter: brightness(0) invert(1);
  transition: transform 0.3s ease;
}

.menuBoton:hover img {
  transform: scale(1.1);
}

.navbarLinks {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.navEnlace {
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.6rem 1rem;
  position: relative;
  overflow: hidden;
  transition: color 0.3s ease;
  letter-spacing: 0.5px;
  border-radius: 8px;
}

.navEnlace::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #9c27b0, #3f51b5);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
  border-radius: 3px;
}

.navEnlace:hover {
  color: #e0d2ff;
}

.navEnlace:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}

.router-link-active {
  background-color: rgba(255, 255, 255, 0.12);
}

.router-link-active::before {
  transform: scaleX(1);
}

.navbarLogo.router-link-active {
  background-color: transparent;
}


.navbarSesion {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.navbarUsuarioNombre {
  text-decoration: none;
  color: #fff;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  white-space: nowrap;
}

.navbarUsuarioNombre:hover {
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  color: #e0d2ff;
}

.navbarUsuarioAvatar {
  flex-shrink: 0;
  margin-left: 0.5rem;
}

.navbarUsuarioAvatar img {
  width: 50px; /* Aumentado de 38px */
  height: 50px; /* Aumentado de 38px */
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.5);
  transition: all 0.4s ease;
  box-shadow: 0 0 0 rgba(255, 255, 255, 0);
}

.navbarUsuarioAvatar:hover img {
  border-color: white;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.4);
  transform: scale(1.1);
}

/* Modificar selector para excluir logo y enlaces de cuenta */
.navEnlace.router-link-active:not(.navbarLogo):not(.navbarUsuarioNombre):not(.navbarUsuarioAvatar) {
  background-color: rgba(255, 255, 255, 0.12);
}

/* Asegurar que el logo y enlaces de cuenta no tengan fondo */
.navbarLogo.router-link-active,
.navbarUsuarioNombre.router-link-active,
.navbarUsuarioAvatar.router-link-active {
  background-color: transparent;
}

/* Eliminar línea decorativa para logo y cuenta */
.navbarLogo.router-link-active::before,
.navbarUsuarioNombre.router-link-active::before,
.navbarUsuarioAvatar.router-link-active::before {
  display: none;
}

/* Responsive Design */
@media (min-width: 992px) {
  .navEnlace {
    position: relative;
    transition: all 0.3s ease;
  }
  
  .navEnlace:hover {
    transform: translateY(-2px);
  }
}

@media (max-width: 992px) {
  .navbarLogo img {
    height: 45px; /* Aumentado de 40px */
  }
  
  .navbarUsuarioAvatar img {
    height: 38px; /* Aumentado de 35px */
    width: 38px; /* Aumentado de 35px */
  }
}

@media (max-width: 768px) {
  .navbarLogo img {
    height: 40px; /* Aumentado de 35px */
  }
}

@media (max-width: 480px) {
  .navbarContenedor {
    padding: 0.6rem 1rem;
  }
  
  .navbarLogo img {
    height: 35px; /* Aumentado de 32px */
  }
  
  .navbarUsuarioAvatar img {
    height: 35px; /* Aumentado de 32px */
    width: 35px; /* Aumentado de 32px */
  }
}
</style>
<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSessionStore } from '../stores/session.js';
import { RouterLink } from 'vue-router';
import { useObtenerNombreUsuario } from '../composables/obtenerNombreUsuario.js';

const sessionStore = useSessionStore();
const { obtenerUsername } = useObtenerNombreUsuario();
const menuAbierto = ref(false);

const toggleMenu = () => {
  menuAbierto.value = !menuAbierto.value;
  if (menuAbierto.value) {
    document.body.style.overflow = 'hidden'; // Previene scroll cuando el menú está abierto
  } else {
    document.body.style.overflow = 'auto';
  }
};

// Cerrar el menú si se hace clic fuera
const cerrarMenuSiClickFuera = (event) => {
  if (menuAbierto.value && !event.target.closest('.menuBoton') && !event.target.closest('.navbarLinks')) {
    menuAbierto.value = false;
    document.body.style.overflow = 'auto';
  }
};

onMounted(async () => {
  await sessionStore.recuperarSesion();
  await obtenerUsername();

  // Agregar listener para cerrar menú al hacer clic fuera
  document.addEventListener('click', cerrarMenuSiClickFuera);

  // Agregar listener para cambios en el tamaño de la ventana
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && menuAbierto.value) {
      menuAbierto.value = false;
      document.body.style.overflow = 'auto';
    }
  });
});
</script>

<template>
  <header class="cabecera">
    <nav class="navbarPrincipal">
      <!-- Logo -->
      <RouterLink to="/" class="navbarLogo">
        <img src="../assets/img/logo/PixelRift-Logo-Colores.png" alt="PixelRift Logo" />
      </RouterLink>

      <!-- Overlay para fondo oscuro cuando el menú móvil está activo -->
      <div v-if="menuAbierto" class="menuOverlay" @click="menuAbierto = false"></div>

      <!-- Links navegación -->
      <div class="navbarLinksContenedor" :class="{ 'menuAbierto': menuAbierto }">
        <div class="navbarLinks">
          <RouterLink class="navEnlace" to="/" @click="menuAbierto = false">
            <span class="textoEnlace">INICIO</span>
          </RouterLink>
          <RouterLink class="navEnlace" to="/catalogo/" @click="menuAbierto = false">
            <span class="textoEnlace">CATÁLOGO</span>
          </RouterLink>
          <RouterLink class="navEnlace" to="/coleccion/" @click="menuAbierto = false">
            <span class="textoEnlace">COLECCIONES</span>
          </RouterLink>
          <RouterLink class="navEnlace" to="/cuenta/" @click="menuAbierto = false">
            <span class="textoEnlace">CUENTA</span>
          </RouterLink>
        </div>

        <!-- Datos de sesión visibles en móvil dentro del menú -->
        <div class="navbarSesionMovil">
          <RouterLink class="navbarUsuarioMovil" to="/cuenta/" @click="menuAbierto = false">
            <div class="usuarioAvatarMovil">
              <img v-if="sessionStore.avatarUrl" :src="sessionStore.avatarUrl" alt="Usuario" />
              <img v-else src="../assets/img/usuarioPH.jpg" alt="Usuario" />
            </div>
            <template v-if="!sessionStore.isLoadingUsername">
              <span class="nombreUsuarioMovil">{{ sessionStore.username || "Iniciar sesión" }}</span>
            </template>
            <template v-else>
              <span class="nombreUsuarioMovil cargando">Cargando...</span>
            </template>
          </RouterLink>
        </div>
      </div>

      <!-- Botón hamburguesa para móvil -->
      <button class="menuBoton" @click="toggleMenu" :class="{ 'activo': menuAbierto }">
        <span class="linea"></span>
        <span class="linea"></span>
        <span class="linea"></span>
      </button>

      <!-- Datos de la sesión (visible solo en desktop) -->
      <div class="navbarSesion">
        <RouterLink class="navbarUsuario" to="/cuenta/">
          <template v-if="!sessionStore.isLoadingUsername">
            <span class="usuarioNombre">{{ sessionStore.username || "Iniciar sesión" }}</span>
          </template>
          <template v-else>
            <span class="usuarioNombre cargando">Cargando...</span>
          </template>
          <div class="usuarioAvatar">
            <img v-if="sessionStore.avatarUrl" :src="sessionStore.avatarUrl" alt="Usuario" />
            <img v-else src="../assets/img/usuarioPH.jpg" alt="Usuario" />
          </div>
        </RouterLink>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.cabecera {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: linear-gradient(120deg, #101d4f 0%, #4e0e78 50%, #730979 100%);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.navbarPrincipal {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  background: transparent;
}

/* Logo */
.navbarLogo {
  display: flex;
  z-index: 100;
}

.navbarLogo img {
  height: 50px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.navbarLogo img:hover {
  transform: scale(1.08) rotate(-2deg);
  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
  animation: rotarColores 1.5s linear infinite;
}

@keyframes rotarColores {
  from {
    filter: hue-rotate(0deg) drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
  }

  to {
    filter: hue-rotate(360deg) drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
  }
}

/* Navegación Links */
.navbarLinksContenedor {
  display: flex;
  flex-direction: column;
}

.navbarLinks {
  display: flex;
  gap: 1rem;
}

.navEnlace {
  position: relative;
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.navEnlace .textoEnlace {
  position: relative;
  z-index: 2;
}

.navEnlace::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ff6b6b, #7b68ee);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s ease;
  border-radius: 3px;
}

.navEnlace:hover {
  transform: translateY(-2px);
  color: #f0f0f0;
}

.navEnlace:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}

/* Enlaces activos */
.navEnlace.router-link-active {
  background-color: rgba(255, 255, 255, 0.1);
}

.navEnlace.router-link-active::before {
  transform: scaleX(1);
}

/* Datos de sesión */
.navbarSesion {
  display: flex;
  align-items: center;
}

.navbarUsuario {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  text-decoration: none;
  padding: 0.4rem 0.8rem;
  border-radius: 30px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
}

.navbarUsuario:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.usuarioNombre {
  color: white;
  font-weight: 500;
  font-size: 0.95rem;
}

.usuarioAvatar {
  display: flex;
  align-items: center;
}

.usuarioAvatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.navbarUsuario:hover .usuarioAvatar img {
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.1);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
}

/* Botón hamburguesa */
.menuBoton {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 28px;
  height: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 100;
}

.menuBoton .linea {
  width: 100%;
  height: 3px;
  background-color: white;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.menuBoton.activo .linea:nth-child(1) {
  transform: translateY(8.5px) rotate(45deg);
}

.menuBoton.activo .linea:nth-child(2) {
  opacity: 0;
}

.menuBoton.activo .linea:nth-child(3) {
  transform: translateY(-8.5px) rotate(-45deg);
}

/* Overlay para el menú móvil */
.menuOverlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 50;
  backdrop-filter: blur(5px);
}

/* Componentes móviles ocultos por defecto */
.navbarSesionMovil {
  display: none;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .navEnlace {
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
  }

  .usuarioNombre {
    font-size: 0.85rem;
  }

  .usuarioAvatar img {
    width: 38px;
    height: 38px;
  }
}

@media (max-width: 768px) {
  .navbarPrincipal {
    padding: 0.6rem 1.2rem;
  }

  .menuBoton {
    display: flex;
  }

  .navbarLinksContenedor {
    position: fixed;
    top: 0;
    right: -100%;
    width: 75%;
    max-width: 300px;
    height: 100vh;
    background: linear-gradient(135deg, #1e1e3f 0%, #4e0e78 100%);
    z-index: 90;
    box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
    padding: 6rem 1.5rem 2rem;
    transition: right 0.3s ease;
    overflow-y: auto;
  }

  .navbarLinksContenedor.menuAbierto {
    right: 0;
  }

  .navbarLinks {
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .navEnlace {
    width: 100%;
    text-align: left;
    padding: 1rem;
    font-size: 1.1rem;
    border-radius: 8px;
  }

  .navEnlace:hover {
    transform: none;
    background-color: rgba(255, 255, 255, 0.1);
  }

  .navbarSesion {
    display: none;
  }

  .navbarSesionMovil {
    display: block;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .navbarUsuarioMovil {
    display: flex;
    align-items: center;
    gap: 1rem;
    text-decoration: none;
    padding: 1rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.08);
  }

  .usuarioAvatarMovil img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.3);
  }

  .nombreUsuarioMovil {
    color: white;
    font-weight: 500;
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .navbarLogo img {
    height: 40px;
  }

  .navbarPrincipal {
    padding: 0.5rem 1rem;
  }

  .navbarLinksContenedor {
    width: 85%;
  }

  .navEnlace {
    font-size: 1rem;
    padding: 0.8rem;
  }

  .usuarioAvatarMovil img {
    width: 40px;
    height: 40px;
  }
}

.cargando {
  opacity: 0.7;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.7;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    opacity: 0.7;
  }
}
</style>
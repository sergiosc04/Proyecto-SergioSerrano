<script setup>
import { ref, computed } from 'vue'

import logoImg from '../assets/img/logo/PixelRift-LogoBasico-Blanco.png'  // Añadir esta línea

import imgCorreo from '../assets/img/footer/mail.png'
import imgTelefono from '../assets/img/footer/tlf.png'
import imgFacebook from '../assets/img/footer/facebook.png'
import imgTwitter from '../assets/img/footer/twitter.png'
import imgInstagram from '../assets/img/footer/instagram.png'


const imagenes = ref({
  correo: imgCorreo,
  telefono: imgTelefono,
  facebook: imgFacebook,
  twitter: imgTwitter,
  instagram: imgInstagram,
  logo: logoImg
})

const anioActual = computed(() => {
  return new Date().getFullYear()
})
</script>

<template>
  <footer class="piePagina">
    <div class="contenidoPie">
      <div class="seccionPie">
        <h4>Contacto</h4>
        <p><img :src="imagenes.correo" alt="correo" class="iconoPie"> info@ejemplo.com</p>
        <p><img :src="imagenes.telefono" alt="telefono" class="iconoPie"> +34 123 456 789</p>
      </div>
      <div class="seccionPie">
        <h4>Síguenos</h4>
        <div class="redesSociales">
          <a href="#"><img :src="imagenes.facebook" alt="facebook" class="iconoRed"></a>
          <a href="#"><img :src="imagenes.twitter" alt="twitter" class="iconoRed"></a>
          <a href="#"><img :src="imagenes.instagram" alt="instagram" class="iconoRed"></a>
        </div>
      </div>
      <div class="seccionPie">
        <h4>Enlaces Rápidos</h4>
        <ul>
          <li><router-link to="/">Inicio</router-link></li>
          <li><router-link to="/catalogo">Ver catálogo</router-link></li>
          <li><router-link to="/cuenta">Ver cuenta</router-link></li>
        </ul>
      </div>
    </div>
    <div class="pieInferior">
      <img :src="imagenes.logo" alt="PixelRift Logo" class="logoFooter">
      <p>&copy; {{ anioActual }} Todos los derechos reservados.</p>
    </div>
  </footer>
</template>


<style scoped>
.piePagina {
  background-color: var(--color-primario);
  color: var(--color-texto);
  padding: 2rem 0;
  margin-top: auto;
}

.contenidoPie {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.seccionPie h4 {
  margin-bottom: 1rem;
  color: var(--color-texto);
  font-weight: 600;
}

.seccionPie ul {
  list-style: none;
  padding: 0;
}

.seccionPie ul li {
  margin-bottom: 0.5rem;
}

.seccionPie a {
  color: var(--color-texto-secundario);
  text-decoration: none;
  transition: color 0.3s ease;
}

.seccionPie a:hover {
  color: var(--color-texto-hover);
}

.redesSociales {
  display: flex;
  gap: 1rem;
}

.iconoPie {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-right: 8px;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

.iconoPie:hover {
  opacity: 1;
}

.iconoRed {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
  opacity: 0.8;
}

.iconoRed:hover {
  transform: scale(1.1);
  opacity: 1;
}

.pieInferior {
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid var(--color-borde);
  color: var(--color-texto-terciario);
}

.logoFooter {
  height: 80px;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

.logoFooter:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .contenidoPie {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .redesSociales {
    justify-content: center;
  }
}
</style>
<script setup>
// Importa funciones reactivas y computadas de Vue
import { ref, computed } from 'vue'

// Importa imágenes para el footer, incluido el logo
import logoImg from '../assets/img/logo/PixelRift-LogoBasico-Blanco.png'

import imgCorreo from '../assets/img/footer/mail.png'
import imgTelefono from '../assets/img/footer/tlf.png'
import imgFacebook from '../assets/img/footer/facebook.png'
import imgTwitter from '../assets/img/footer/twitter.png'
import imgInstagram from '../assets/img/footer/instagram.png'

// Objeto reactivo que almacena las rutas de las imágenes usadas en el footer
const imagenes = ref({
  correo: imgCorreo,
  telefono: imgTelefono,
  facebook: imgFacebook,
  twitter: imgTwitter,
  instagram: imgInstagram,
  logo: logoImg
})

// Computed para obtener el año actual dinámicamente
const anioActual = computed(() => {
  return new Date().getFullYear()
})
</script>

<template>
  <!-- Footer con contacto, redes sociales y enlaces rápidos -->
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
/* Estilo del footer principal */
.piePagina {
  background-color: var(--color-primario);
  color: var(--color-texto);
  padding: 2rem 0;
  margin-top: auto;
}

/* Contenedor de las secciones dentro del footer */
.contenidoPie {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

/* Estilo para los títulos de las secciones */
.seccionPie h4 {
  margin-bottom: 1rem;
  color: var(--color-texto);
  font-weight: 600;
}

/* Lista sin estilo predeterminado */
.seccionPie ul {
  list-style: none;
  padding: 0;
}

/* Separación entre elementos de la lista */
.seccionPie ul li {
  margin-bottom: 0.5rem;
}

/* Enlaces sin subrayado y con transición de color */
.seccionPie a {
  color: var(--color-texto-secundario);
  text-decoration: none;
  transition: color 0.3s ease;
}

/* Cambio de color al pasar el cursor */
.seccionPie a:hover {
  color: var(--color-texto-hover);
}

/* Contenedor horizontal para las redes sociales */
.redesSociales {
  display: flex;
  gap: 1rem;
}

/* Iconos pequeños usados en contacto */
.iconoPie {
  width: 20px;
  height: 20px;
  vertical-align: middle;
  margin-right: 8px;
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

/* Efecto hover para iconos pequeños */
.iconoPie:hover {
  opacity: 1;
}

/* Iconos para redes sociales */
.iconoRed {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
  opacity: 0.8;
}

/* Efecto hover para iconos de redes sociales */
.iconoRed:hover {
  transform: scale(1.1);
  opacity: 1;
}

/* Pie inferior con logo y texto centrado */
.pieInferior {
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid var(--color-borde);
  color: var(--color-texto-terciario);
}

/* Logo en el footer con transición de opacidad */
.logoFooter {
  height: 80px;
  opacity: 0.9;
  transition: opacity 0.3s ease;
}

/* Opacidad máxima al hacer hover en el logo */
.logoFooter:hover {
  opacity: 1;
}

/* Adaptación responsive para pantallas pequeñas */
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

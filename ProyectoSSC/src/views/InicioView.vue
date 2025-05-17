<script setup>
import { onMounted } from 'vue';
import tarjetaJuego from '../components/tarjetaJuego.vue';
import Paginacion from '../components/paginacion.vue';
import { getJuegos } from '../compostables/obtenerJuegos';
import SpinnerCarga from '@/components/SpinnerCarga.vue';
import { useSessionStore } from '../stores/session.js';
import BannerJuego from '@/components/bannerJuego.vue';
import { useObtenerNombreUsuario } from '../compostables/obtenerNombreUsuario';
import { obtenerColecciones } from '../compostables/obtenerColecciones';

const sessionStore = useSessionStore();
const { nombreUsuario, obtenerUsername } = useObtenerNombreUsuario();
const { colecciones, loading: loadingColecciones, getIdAuth } = obtenerColecciones();

const {
  juegos,
  cargando,
  obtenerJuegos,
} = getJuegos();

// Cargar los juegos cuando se monte el componente
onMounted(async () => {
  sessionStore.recuperarSesion();
  await obtenerJuegos();
  await obtenerUsername();
  await getIdAuth();

  if (sessionStore.session) {
    console.log('Sesión recuperada:', sessionStore.session);
  } else {
    console.log('No hay sesión activa.');
  }
});
</script>

<template>
  <main>
    <!-- Estado de carga inicial -->
    <div v-if="cargando" class="contenedorCarga">
      <SpinnerCarga />
      <br>
      <strong>Cargando inicio...</strong>
    </div>

    <!-- Contenido principal cuando ya cargó -->
    <div v-else>
      <!-- Sección del Banner destacado -->
      <BannerJuego v-if="juegos?.length" :juegos="juegos" />

      <!-- Contenedor principal de juegos -->
      <div class="contenedorJuegos">
        <!-- Título condicional según autenticación -->
        <div class="titulos">
          <div v-if="sessionStore.session" class="titulo">
            ¡Bienvenido de vuelta, <strong>{{ nombreUsuario || "usuario" }}!</strong>

            <div class="barraDegradado" />

            <p class="subtitulo">Aquí tienes una selección aleatoria de juegos para ti:</p>
          </div>

          <div v-else>
            <div class="titulo">¡Bienvenido a <strong>PixelRift!</strong></div>

            <div class="barraDegradado" />

            <router-link to="/cuenta/" class="subtitulo" align="center">
              <strong>Regístrate o Inicia Sesión</strong>
            </router-link>
            para acceder a tu cuenta y guardar tus juegos favoritos.

            <p>Mientras tanto, echa un vistazo a nuestro catálogo:</p>
          </div>
        </div>

        <!-- Listado de juegos -->
        <div v-if="cargando" class="carga-juegos">
          <SpinnerCarga />
          <br>
          <strong>Cargando juegos...</strong>
        </div>

        <div v-else class="listadoJuegos">
          <tarjetaJuego v-for="juego in juegos.slice(0, 10)" :key="juego.id" :juego="juego" />
        </div>
      </div>

      <!-- Separador visual -->
   <div class="barraDegradadoCorta" />

      <!-- Sección de colecciones -->
      <div class="contenedorColecciones">
        <div class="titulo">
          Tus <strong>Colecciones</strong>

          
        </div>

        <div class="subtitulo" v-if="colecciones.length">
          <p>Tienes <strong>{{ colecciones.length }} </strong> colecciones.</p>
        </div>

        <!-- Contenido condicional de colecciones -->
        <div v-if="sessionStore.session" class="vistaPrevia">


          <!-- Estado de carga de colecciones -->
          <div v-if="loadingColecciones">
            <SpinnerCarga />
            <p>Cargando colecciones...</p>
          </div>

          <!-- Listado de colecciones -->
          <div v-else-if="colecciones?.length" class="listaColecciones">
            <div v-for="coleccion in colecciones" :key="coleccion.idcoleccion" class="elementoColeccion">
              <h3>{{ coleccion.nombreColeccion }}</h3>
              <h5 v-if="coleccion.datosentrada.juegos.length" >
                <p align="center">Esta colección tiene {{ coleccion.datosentrada.juegos.length }} juegos.</p>
              </h5>
              <h5 v-else>
                <p align="center">Esta colección no tiene juegos aún.</p>
              </h5>
              <router-link to="/coleccion">
                <button class="botonSecundario">Ver colección</button>
              </router-link>
            </div>
          </div>
           <router-link to="/coleccion/" align="center" class="botonVerTodo">
            <button class="botonPrimario3">Ver todas las colecciones</button>
          </router-link>
        </div>

        <!-- Mensaje para usuarios no autenticados -->
        <div v-else class="sinColecciones">
          <p>Inicia sesión para ver y crear colecciones.</p>
          <router-link to="/cuenta/">
            <button class="botonPrimario3">Iniciar sesión</button>
          </router-link>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.iconoInput {
    position: absolute;
    left: 12px;
    width: 20px;
    height: 20px;
    opacity: 0.7;
}

.barraDegradado{
  height: 4px;
  background: var(--gradiente-acento);
  margin: 1.5rem 0;
  border-radius: 2px;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.2);
}
 .barraDegradadoCorta {
  height: 4px;
  width:70%;
  background: var(--gradiente-acento);
  margin: 1.5rem 0;
  justify-self: center;
  border-radius: 2px;
  box-shadow: 0 2px 12px rgba(99, 102, 241, 0.2);
}

.titulo {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

.contenedorJuegos {
  background: rgba(30, 32, 50, 0.95);
  border-radius: 24px;
  padding: 2.5rem;
  margin: 3rem auto;
  max-width: 1400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.1);
  backdrop-filter: blur(10px);
}

.contenedorColecciones {
  background: #1e2032;
  border-radius: 24px;
  padding: 3rem;
  margin: 3rem auto;
  max-width: 1400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.elementoColeccion {
  background: #141623;
  border-radius: 20px;
  padding: 1.8rem;
  border: 1px solid rgba(99, 102, 241, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.sinColecciones {
  background: #1e2032;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  border: 1px solid rgba(99, 102, 241, 0.1);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.botonPrimario3 {
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 1rem 2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.botonPrimario3:hover {
  background: #4f46e5;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
}

.contenedorCarga {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.titulos {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 2rem;
}

.listaColecciones {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
  padding: 0 1rem;
}

.elementoColeccion {
  background: linear-gradient(145deg, #141623, #1a1c2d);
  border-radius: 20px;
  padding: 1.8rem;
  border: 1px solid rgba(99, 102, 241, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.elementoColeccion:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.3);
}

@media (max-width: 768px) {
  .contenedorColecciones {
    margin: 1rem;
    padding: 1rem;
  }

  .listaColecciones {
    grid-template-columns: 1fr;
  }
}
</style>
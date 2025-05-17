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

            <div class="barraDegradado2" />

            <router-link to="/cuenta/" class="subtitulo" align="center">
              Regístrate o Inicia Sesión
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

          <div class="barraDegradado2" />
        </div>

        <div class="subtitulo">
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
            <button class="botonPrimario">Ver todas las colecciones</button>
          </router-link>
        </div>

        <!-- Mensaje para usuarios no autenticados -->
        <div v-else class="sinColecciones">
          <p>Inicia sesión para ver y crear colecciones.</p>
          <router-link to="/cuenta/">
            <button class="botonPrimario">Iniciar sesión</button>
          </router-link>

         

          <br><br><br><br>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.barraDegradado {
  height: 3px;
  width: 100%;
  background: linear-gradient(45deg, #d000ff, #00d9ff);
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.barraDegradadoCorta {
  height: 3px;
  width: 100%;
  background: linear-gradient(45deg, #d000ff, #00d9ff);
  margin-top: 1rem;
  margin-bottom: 1rem;
}

.sinColecciones {
  text-align: center;
  padding: 2rem;
  background: #252744;
  border-radius: 12px;
  color: #a4a8e0;
  border: 1px solid #333654;
}

.botonVerTodo {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
}

.titulos {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 2rem;
}

.contenedorColecciones {
  background-color: #1f2136;
  border-radius: 12px;
  padding: 2rem;
  margin: 2rem 13%;
  border: 1px solid #333654;
}

.vistaPrevia {
  margin-top: 1.5rem;
}

.preguntas {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 1rem;
}

.listaColecciones {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
  padding: 0 1rem;
}

.elementoColeccion {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #131520;
  color: #e9e9ec;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2), 0 2px 8px rgba(79, 70, 229, 0.15);
  padding: 1.2rem;
}

.elementoColeccion:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3), 0 4px 10px rgba(79, 70, 229, 0.2);
}

.elementoColeccion h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  color: #ffffff;
  line-height: 1.3;
  letter-spacing: 0.02em;
  padding: 0.5rem;
}

.elementoColeccion h5 {
  color: #a1a1b5;
  font-weight: 500;
  margin: 0.5rem 0 1rem 0;
  font-size: 0.9rem;
  padding: 0.5rem;
}

.botonPrimario {
  background-color: #5d5fef;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  font-weight: 500;
}

.botonPrimario:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.botonSecundario {
  background-color: #5d5fef;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 0;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  width: 100%;
}

.botonSecundario:hover {
  background-color: #4b4aca;
  transform: translateY(-2px);
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

.contenedorCarga {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>
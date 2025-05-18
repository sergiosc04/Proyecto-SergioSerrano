<script setup>
import { onMounted } from 'vue';
import tarjetaJuego from '../components/tarjetaJuego.vue';
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
  <!-- Estado de carga inicial -->
  <div v-if="cargando" class="contenedorCarga">
    <SpinnerCarga />
    <p>Cargando inicio...</p>
  </div>


  <!-- Contenido principal cuando ya cargó -->
  <div v-else>
    <BannerJuego v-if="juegos?.length" :juegos="juegos" />
    <div class="contenedorPrincipal">
      <!-- Sección del Banner destacado -->


      <!-- Cabecera de bienvenida -->
      <section class="cabeceraJuego">
        <div v-if="sessionStore.session" class="tituloJuego">
          ¡Bienvenido de vuelta, <strong>{{ nombreUsuario || "usuario" }}</strong>!
        </div>
        <div v-else class="tituloJuego">
          ¡Bienvenido a <strong>PixelRift!</strong>
        </div>

        <p v-if="sessionStore.session" class="subtituloJuego">Aquí tienes una selección aleatoria de juegos para ti:</p>

        <div v-else class="subtituloJuego">
          <router-link to="/cuenta/" class="enlaceExterno">
            <strong>Regístrate o Inicia Sesión</strong>
          </router-link>
          para acceder a tu cuenta y guardar tus juegos favoritos.
          <p>Mientras tanto, echa un vistazo a estos juegos:</p>
        </div>


        <!-- Estado de carga de juegos -->
        <div v-if="cargando" class="contenedorCarga">
          <SpinnerCarga />
          <p>Cargando juegos...</p>
        </div>

        <!-- Listado de juegos -->
        <div v-else class="listadoJuegos">
          <tarjetaJuego v-for="juego in juegos.slice(0, 12)" :key="juego.id" :juego="juego" />
        </div>
      </section>

      <!-- Sección de colecciones -->

        <div class="cabeceraJuego">
          <h2 class="tituloSeccion">Tus Colecciones</h2>

          <div class="subtituloInfo" v-if="colecciones?.length">
            <p>Tienes <strong>{{ colecciones.length }}</strong> colecciones.</p>
          </div>

          <!-- Contenido condicional de colecciones -->
          <div v-if="sessionStore.session" class="vistaPrevia">
            <!-- Estado de carga de colecciones -->
            <div v-if="loadingColecciones" class="contenedorCarga">
              <SpinnerCarga />
              <p>Cargando colecciones...</p>
            </div>

            <!-- Listado de colecciones -->
            <div v-else-if="colecciones?.length" class="listaColecciones">
              <div v-for="coleccion in colecciones" :key="coleccion.idcoleccion" class="elementoColeccion">
                <h3>{{ coleccion.nombreColeccion }}</h3>
                <div class="valorEstadistica" v-if="coleccion.datosentrada.juegos.length">
                  Esta colección tiene {{ coleccion.datosentrada.juegos.length }} juegos.
                </div>
                <div class="valorEstadistica" v-else>
                  Esta colección no tiene juegos aún.
                </div>
                <router-link to="/coleccion" class="botonTienda">
                  Ver colección
                </router-link>
              </div>
            </div>

            <div class="contenedorBotonVerTodo">
              <router-link to="/coleccion/" class="botonControl">
                Ver todas las colecciones
              </router-link>
            </div>
          </div>

          <!-- Mensaje para usuarios no autenticados -->
          <div v-else class="sinColecciones">
            <p>Inicia sesión para ver y crear colecciones.</p>
            <router-link to="/cuenta/">
              <button class="botonControl">Iniciar sesión</button>
            </router-link>
          </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  background-color: #1a1c2e;
  min-height: 100vh;
  width: 100%;
}

/* Estilos principales */
.contenedorPrincipal {
  min-height: 100vh;
  width: 100%;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #1a1c2e;
  padding: 2rem;
}

.cabeceraJuego {
  text-align: center;
  margin: 0 auto 2rem auto;
  max-width: 1400px;
  background: linear-gradient(90deg, #1f2136, #252744, #1f2136);
  padding: 1.5rem;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  border: 1px solid #333654;
}

.cabeceraJuego::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(45deg, #d000ff, #00d9ff);
}

.tituloJuego {
  margin-top: 1rem;
  margin-bottom: 1rem;
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 0 0 15px rgba(208, 0, 255, 0.3);
}

.subtituloJuego {
  color: #a4a8e0;
  margin-top: 2rem;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.seccionInfo {
  background-color: #1f2136;
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid #333654;
  max-width: 1400px;
  margin: 0 auto 2rem auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.seccionColecciones {
  background: linear-gradient(145deg, #1f2136, #252744);
}

.tituloSeccion {
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  position: relative;
  text-align: center;
}


.contenedorCarga {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: #ffffff;
}

.listaColecciones {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.elementoColeccion {
  background: linear-gradient(145deg, #141623, #1a1c2d);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(99, 102, 241, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.elementoColeccion:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 30px rgba(99, 102, 241, 0.2);
  border-color: rgba(99, 102, 241, 0.3);
}

.elementoColeccion h3 {
  color: #ffffff;
  margin-top: 0;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.valorEstadistica {
  font-size: 0.9rem;
  color: #a4a8e0;
  margin-bottom: 1rem;
  text-align: center;
}

.botonTienda {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: linear-gradient(90deg, #2c2e48, #252744);
  color: #00d9ff;
  text-decoration: none;
  padding: 0.75rem;
  border-radius: 6px;
  text-align: center;
  border: 1px solid #333654;
  transition: all 0.2s;
}

.botonTienda:hover {
  background: linear-gradient(90deg, #252744, #2c2e48);
  transform: translateY(-2px);
  border-color: #00d9ff;
}

.botonControl {
  background: linear-gradient(90deg, #d000ff, #00d9ff);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.2s;
  display: inline-block;
  text-decoration: none;
  font-weight: 600;
}

.botonControl:hover {
  opacity: 0.9;
  transform: scale(1.05);
}

.contenedorBotonVerTodo {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.subtituloInfo {
  color: #a4a8e0;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1rem;
}

.sinColecciones {
  background: #1a1c2e;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  border: 1px solid rgba(99, 102, 241, 0.1);
  margin-top: 1rem;
  color: #a4a8e0;
}

.enlaceExterno {
  color: #00d9ff;
  text-decoration: none;
  transition: color 0.2s;
}

.enlaceExterno:hover {
  color: #d000ff;
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .contenedorPrincipal {
    padding: 1rem;
  }

  .tituloJuego {
    font-size: 1.75rem;
  }

  .listadoJuegos {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }

  .listaColecciones {
    grid-template-columns: 1fr;
  }
}
</style>
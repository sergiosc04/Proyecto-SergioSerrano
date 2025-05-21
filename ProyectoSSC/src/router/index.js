import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/InicioView.vue'),
    },
    {
      //el :slug significa que recibe un valor mediante la URL, en este caso, el slug del juego
      path: '/juego/:slug',
      name: 'juego',
      component: () => import('../views/DetallesJuegoView.vue'),
    },
    {
      path: '/catalogo/',
      name: 'catalogo',
      component: () => import('../views/BuscarView.vue'),
    },
    {
      path: '/coleccion/',
      name: 'coleccion',
      component: () => import('../views/ColeccionView.vue'),
    },
    {
      path: '/cuenta/',
      name: 'cuenta',
      component: () => import('../views/CuentaView.vue'),
    }, {
      path: '/registro/',
      name: 'registro',
      component: () => import('../views/RegistroView.vue'),
    }, {
      path: '/login/',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      // Ruta wildcard para manejar todas las URLs no encontradas
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    })
    return {
      top: 0,
      left: 0,
      behavior: 'auto'
    }
  }
})

//para que el scroll vuelva al inicio de la pagina al cambiar de ruta
router.afterEach(() => {
  setTimeout(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, 50);
})

export default router

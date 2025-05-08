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
    },
  ],
})

export default router;

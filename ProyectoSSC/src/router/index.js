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
      //el :id significa que recibe un valor ID mediante la URL
      path: '/juego/:id',
      name: 'juego',
      component: () => import('../views/DetallesJuegoView.vue'),
    },
    {
      path: '/buscar/',
      name: 'buscar',
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
    }
  ],
})

export default router;

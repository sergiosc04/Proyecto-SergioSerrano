import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/ListadoJuegosView.vue'),
    },
    {
      //el :id significa que recibe un valor ID mediante la URL
      path: '/juego/:id',
      name: 'juego',
      component: () => import('../views/DetallesJuegoView.vue'),
    },
    {
      path: '/buscar',
      name: 'buscar',
      component: () => import('../views/BuscarJuegosView.vue'),
    },
    {
      path: '/deseados',
      name: 'deseado',
      component: () => import('../views/ListaDeseadosView.vue'),
    },
    {
      path: '/perfil:id',
      name: 'perfil',
      component: () => import('../views/PerfilView.vue'),
    },
  ],
})

export default router

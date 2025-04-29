
//Apartado para crear el sistema de pinia, el sistema de vue, y el sistema de router
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';

const app = createApp(App);

app.use(createPinia());

app.use(router);

app.mount('#app');

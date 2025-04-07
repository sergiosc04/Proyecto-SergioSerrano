// stores/session.js
import { defineStore } from 'pinia'  // Importa la función `defineStore` de Pinia

// Definimos el store llamado 'session'
export const useSessionStore = defineStore('session', {

    // El objeto `state` define los datos que vamos a almacenar en el store
    state: () => ({
        user: null,        // Inicializamos `user` como null. Aquí almacenamos los datos del usuario.
        session: null      // Inicializamos `session` como null. Aquí almacenamos la sesión completa.
    }),

    // `actions` son métodos que permiten modificar el estado
    actions: {
        // Este método establece la sesión y el usuario en el store
        setSession(sessionData) {
            this.session = sessionData;    // Asignamos los datos de la sesión al estado `session`
            this.user = sessionData?.user || null; // Si hay datos de usuario en `sessionData`, los asignamos, si no, lo dejamos en null
        },

        // Este método limpia los datos de la sesión y el usuario (se usa cuando el usuario cierra sesión)
        logout() {
            this.session = null;  // Eliminamos la sesión
            this.user = null;     // Eliminamos el usuario
        }
    }
})

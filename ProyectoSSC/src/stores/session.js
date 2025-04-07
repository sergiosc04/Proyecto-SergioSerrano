// stores/session.js
import { defineStore } from 'pinia'  //importa la función "defineStore" de Pinia

//Definimos el store llamado "session"
export const useSessionStore = defineStore('session', {

    //El objeto "state" define los datos que vamos a almacenar en el store
    state: () => ({
        user: null,
        session: null
    }),

    //"actions" son métodos que permiten modificar el estado
    actions: {
        //Este método establece la sesión y el usuario en el store
        setSession(sessionData) {
            this.session = sessionData;    //asigna los datos de la sesión al estado "session"
            this.user = sessionData?.user || null; //si hay datos en "sessionData", los asignamos, si no, lo dejamos en null
        },

        //Este método limpia los datos de la sesión y el usuario (se usa cuando el usuario cierra sesión)
        logout() {
            this.session = null;
            this.user = null;
        }
    }
})

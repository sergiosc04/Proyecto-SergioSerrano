import { defineStore } from 'pinia'
import { supabase } from '../supabase'

//Definimos el store llamado "session"
export const useSessionStore = defineStore('session', {

    //El objeto "state" define los datos que vamos a almacenar en el store
    state: () => ({
        user: null,
        session: null,
        avatarUrl: null,
        username: '',
        isLoadingUsername: false
    }),

    actions: {

        //Este método establece la sesión y el usuario en el store
        setSession(sessionData) {
            this.session = sessionData;
            this.user = sessionData?.user || null;
        },

        //Este método limpia los datos de la sesión y el usuario (se usa cuando se cierra sesión)
        logout() {
            this.session = null;
            this.user = null;
            this.avatarUrl = null;
            this.username = '';
        },

        // Nuevo método para recuperar la sesión
        async recuperarSesion() {
            try {
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Error al recuperar la sesión:', error.message);
                    return false;
                }

                if (data?.session) {
                    this.setSession(data.session);

                    // Recuperar el avatar y username después de establecer la sesión
                    await Promise.all([
                        this.recuperarAvatar(),
                        this.recuperarUsername()
                    ]);

                    console.log('Sesión, avatar y username recuperados correctamente');

                    return true;
                } else {
                    console.warn('No hay sesión activa');
                    return false;
                }
            } catch (error) {
                console.error('Error inesperado:', error);
                return false;
            }
        },

        async recuperarAvatar() {
            if (!this.user?.id) {
                console.warn("Usuario no disponible");
                return null;
            }

            const { data: usuario, error } = await supabase
                .from('usuarios')
                .select('avatar_url')
                .eq('idauth', this.user.id)
                .single();

            if (error) {
                console.error("Error al conseguir el avatar:", error.message);
                return null;
            }

            this.avatarUrl = usuario?.avatar_url || null;
            return this.avatarUrl;
        },

        setUsername(newUsername) {
            this.username = newUsername;
        },

        setLoadingUsername(status) {
            this.isLoadingUsername = status;
        },

        async recuperarUsername() {
            if (!this.user?.id) {
                console.warn("Usuario no disponible");
                return null;
            }

            try {
                this.setLoadingUsername(true);
                const { data: usuario, error } = await supabase
                    .from('usuarios')
                    .select('username')
                    .eq('idauth', this.user.id)
                    .single();

                if (error) throw error;
                
                this.setUsername(usuario?.username || '');
                return this.username;
                
            } catch (error) {
                console.error('Error al obtener nombre de usuario:', error);
                this.setUsername('');
                return null;
            } finally {
                this.setLoadingUsername(false);
            }
        },
    }
    //Las sesiones duran 1 hora, por lo que la sesion se cierra automaticamente al pasar este tiempo
})

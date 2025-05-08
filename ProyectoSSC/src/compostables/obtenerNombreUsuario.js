import { ref } from 'vue'
import { useSessionStore } from '../stores/session'
import { supabase } from '../supabase'

export function useObtenerNombreUsuario() {
    const sessionStore = useSessionStore()
    const nombreUsuario = ref()

    const obtenerUsername = async () => {
        const sesionRecuperada = await sessionStore.recuperarSesion()
        if (sesionRecuperada && sessionStore.session?.user) {
            console.log('Inicio: UID de la sesión:', sessionStore.session.user.id)

            const { data, error } = await supabase
                .from('usuarios')
                .select('username')
                .eq('idauth', sessionStore.session.user.id)
                .single()

            if (error) {
                console.error('Error al recoger nombre de usuario: ', error)
                return null
            }

            nombreUsuario.value = data.username
            console.log('Nombre de usuario:', nombreUsuario.value)
            return nombreUsuario.value
        } else {
            console.warn('La sesión del usuario no está disponible, prueba a iniciar sesión')
            return null
        }
    }

    return {
        nombreUsuario,
        obtenerUsername
    }
}
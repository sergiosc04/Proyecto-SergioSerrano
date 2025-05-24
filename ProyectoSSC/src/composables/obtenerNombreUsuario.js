import { supabase } from '../supabase'
import { useSessionStore } from '../stores/session'

export function useObtenerNombreUsuario() {
    const sessionStore = useSessionStore()

    const obtenerUsername = async () => {
        if (!sessionStore.session?.user?.id) {
            console.warn("No hay usuario autenticado")
            return
        }

        try {
            sessionStore.setLoadingUsername(true)
            const { data: usuario, error } = await supabase
                .from('usuarios')
                .select('username')
                .eq('idauth', sessionStore.session.user.id)
                .single()

            if (error) throw error
            
            sessionStore.setUsername(usuario?.username || '')
            
        } catch (error) {
            console.error('Error al obtener nombre de usuario:', error)
            sessionStore.setUsername('')
        } finally {
            sessionStore.setLoadingUsername(false)
        }
    }

    return {
        obtenerUsername
    }
}
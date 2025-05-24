import { ref } from 'vue'
import { supabase } from '../supabase'

export function obtenerColecciones() {
    const idauth = ref(null)
    const idusuario = ref(null)
    const colecciones = ref([])
    const loading = ref(false)
    const error = ref(null)
    const mostrarModal = ref(false)
    const mensajeModal = ref('')

    // Obtener el ID de autenticación
    const getIdAuth = async () => {
        try {
            const { data, error } = await supabase.auth.getSession();
            if (error) throw error;

            idauth.value = data.session.user.id;
            console.log('IDAUTH:', idauth.value);

            await getIdUsuario(idauth.value)
        } catch (err) {
            console.error('Error obteniendo sesión:', err)
            error.value = 'Sin sesión activa';
            return null;
        }
    }

    // Obtener el ID de usuario interno
    const getIdUsuario = async (uuid) => {
        try {
            const { data, error } = await supabase
                .from('usuarios')
                .select('idusuario')
                .eq('idauth', uuid);

            if (error) throw error;

            if (data && data.length > 0) {
                idusuario.value = data[0].idusuario;
                console.log('IDUSUARIO:', idusuario.value);
                await getColeccion(idusuario.value);
            } else {
                error.value = 'Usuario no registrado en la base de datos.';
            }
        } catch (err) {
            console.error('Error obteniendo ID de usuario:', err);
            error.value = 'Error al obtener ID de usuario';
        }
    }

    // Obtener colecciones
    const getColeccion = async (idUsuario) => {
        try {
            loading.value = true
            const { data, error } = await supabase
                .from('coleccion')
                .select('datosentrada, nombreColeccion, idcoleccion')
                .eq('idusuario', idUsuario);

            if (error) throw error;

            colecciones.value = data;
            console.log('Colecciones obtenidas:', colecciones.value);
        } catch (err) {
            error.value = 'Error al cargar las colecciones';
            console.error('Error al obtener las colecciones:', err);
        } finally {
            loading.value = false;
        }
    }

    // Crear nueva colección
    const crearColeccion = async (nombreColeccion) => {
        if (nombreColeccion) {
            if (!idusuario.value) {
                error.value = "Regístrate o inicia sesión para crear colecciones.";
                return false;
            }

            loading.value = true;
            try {
                const { data, error } = await supabase
                    .from('coleccion')
                    .insert([{
                        idusuario: idusuario.value,
                        nombreColeccion: nombreColeccion
                    }]);

                if (error) throw error;

                await getColeccion(idusuario.value);
                return true;
            } catch (err) {
                console.error('Error al crear colección:', err);
                error.value = 'No se pudo crear la colección.';
                return false;
            } finally {
                loading.value = false;
            }
        } else {
            error.value = "Introduce un nombre para la colección";
            return false;
        }
    }

    return {
        idauth,
        idusuario,
        colecciones,
        loading,
        error,
        mostrarModal,
        mensajeModal,
        getIdAuth,
        getColeccion,
        crearColeccion
    }
}
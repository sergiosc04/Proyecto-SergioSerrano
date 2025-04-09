<script setup>
import { ref } from 'vue'
import { supabase } from '../supabase'

const cargando = ref(false);
const email = ref('');
const password = ref('');

//Función que registra un usuario en auth, luego coge el uid de ese usuario y lo añade en la tabla public.usuarios, Tras esto, se crea una coleccion en la tabla public.coleccion.
//Despues, se añade el idColeccion a la tabla public.usuarios, junto con el uid del usuario que se acaba de registrar.

const manejarRegistro = async () => {
    try {
        cargando.value = true;

        // Paso 1: Registrar en auth
        const { data, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
        });

        if (error) throw error;

        const user = data.user;
        const idauth = user?.id;

        if (!idauth) throw new Error('No se pudo obtener el idauth del usuario');

        // Paso 2: Crear colección primero
        const { data: coleccion, error: errorColeccion } = await supabase
            .from('coleccion')
            .insert({})
            .select('idcoleccion')
            .single();

        if (errorColeccion) throw errorColeccion;

        const idcoleccion = coleccion.idcoleccion;

        // Paso 3: Insertar en usuarios con idauth + idcoleccion (sin incluir idusuario)
        const { error: errorUsuario } = await supabase
            .from('usuarios')
            .insert({ idauth, idcoleccion });

        if (errorUsuario) throw errorUsuario;

        alert('¡Registrado correctamente! Verifica tu correo electrónico.');

    } catch (error) {
        if (error instanceof Error) {
            alert(error.message);
        }
    } finally {
        cargando.value = false;
    }
}



const emit = defineEmits(['cambiarALogin']);

const cambiarALogin = () => {
    emit('cambiarALogin');
}
</script>

<template>
    <div>
        <form @submit.prevent="manejarRegistro">
            <div>
                <h1 class="header">Registro</h1>
                <p class="description">Crea una nueva cuenta.</p>
                <div>
                    <input class="inputField" required type="email" placeholder="Email:" v-model="email" />
                </div>
                <div>
                    <input class="inputField" required type="password" placeholder="Contraseña:" v-model="password" />
                </div>
                <div>
                    <input type="submit" class="button block" :value="cargando ? 'Cargando' : 'Registrarse'"
                        :disabled="cargando" />
                </div><br>
                <div>
                    <button type="button" class="button secondary" @click="cambiarALogin">
                        ¿Ya tienes una cuenta? Inicia sesión.
                    </button>
                </div>
            </div>
        </form>
    </div>
</template>

<style>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
}
</style>
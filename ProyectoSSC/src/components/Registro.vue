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

        //1. Registrarse en auth
        const { data, error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
        });

        if (error) throw error;

        const user = data.user;
        const idauth = user?.id;

        if (!idauth) throw new Error('No se pudo obtener el idauth del usuario');

        //2. Crear colección
        const { data: coleccion, error: errorColeccion } = await supabase
            .from('coleccion')
            .insert({})
            .select('idcoleccion')
            .single();

        if (errorColeccion) throw errorColeccion;

        const idcoleccion = coleccion.idcoleccion;

        //3. Insertar en usuarios con idauth + idcoleccion (sin incluir idusuario, es autoincremental)
        const { data: usuario, error: errorUsuario } = await supabase
            .from('usuarios')
            .insert({ idauth, idcoleccion })
            .select('idusuario') //recoger el idusuario para añadirlo luego en la tabla coleccion
            .single();

        if (errorUsuario) throw errorUsuario;

        const idusuario = usuario.idusuario; //se asigna valor del idusuario generado automáticamente

        //4. Actualizar la tabla coleccion con el idusuario generado
        const { error: errorActualizarColeccion } = await supabase
            .from('coleccion')
            .update({ idusuario }) // Se actualiza la tupla idusuario para asociar idusuario a coleccion
            .eq('idcoleccion', idcoleccion);

        if (errorActualizarColeccion) throw errorActualizarColeccion;

        alert('¡Registrado correctamente! Comprueba tu correo electrónico para verificar la cuenta.');

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
    <div class="header">
        <h1>Registro</h1>
        <p>Crea una nueva cuenta.</p>
    </div>

    <div class="container">
        <div v-if="!cargando" class="form">
            <form @submit.prevent="manejarRegistro">

                <div class="inputForm">
                    <input class="inputField" required type="email" placeholder="Email:" v-model="email" />
                    <input class="inputField" required type="password" placeholder="Contraseña:" v-model="password" />
                </div>

                <div class="botonesForm">
                    <button type="submit">Registrarse</button>
                    <button type="button" class="button secondary" @click="cambiarALogin">
                        ¿Ya tienes una cuenta? Inicia sesión.
                    </button>
                </div>
            </form>
        </div>
        <div v-else>
            <p>Cargando...</p>
        </div>
    </div>
</template>

<style></style>
<script setup>
import { supabase } from '../supabase';
import { onMounted, ref, toRefs } from 'vue';

const props = defineProps(['session']);
const { session } = toRefs(props);

const loading = ref(true);
const username = ref('');
const website = ref('');
const avatar_url = ref('');

onMounted(() => {
    getProfile();
})


//Funcion que sirve para obtener los datos del perfil
async function getProfile() {
    try {
        //Asignamos verdadero a la variable de carga
        loading.value = true;
        const { user } = session.value;


        //Consulta a la bbdd, coge de la tabla profiles los datos username, website, avatar_url.
        const { data, error, status } = await supabase
            .from('profiles')
            .select(`username, website, avatar_url`)
            .eq('id', user.id)
            .single()

        if (error && status !== 406) throw error;

        //Si existen datos, los asigna a las variables definidas anteriormente
        if (data) {
            username.value = data.username;
            website.value = data.website;
            avatar_url.value = data.avatar_url;
        }

    } catch (error) {
        alert(error.message);
    }
    //Cuando termina se cambia el estado a la variable de carga 
    finally {
        loading.value = false;
    }
}
//Funcion para actualizar los datos del perfil
async function updateProfile() {
    try {
        loading.value = true;
        const { user } = session.value;

        //Crea una clase con los datos a actualizar
        const updates = {
            id: user.id,
            username: username.value,
            website: website.value,
            avatar_url: avatar_url.value,
            updated_at: new Date(),
        }

        //Ejecuta la orden Upsert (inserta o actualiza dependiendo de si existe la entrada)
        const { error } = await supabase.from('profiles').upsert(updates);

        if (error) throw error;

    } catch (error) {
        alert(error.message);

    } finally {
        loading.value = false;
    }
}

//Funcion para cerrar sesion
async function signOut() {
    try {
        loading.value = true

        //Ejecuta la orden de cerrar sesion
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

    } catch (error) {
        alert(error.message);
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <!-- Submit.prevent: Cuando se haga submit, evita el comportamiento por defecto (como recargar la página) -->

    <form class="form-widget" @submit.prevent="updateProfile">
        <div>
            <label for="email">Email</label>
            <input id="email" type="text" :value="session.user.email" disabled />
        </div>

        <div>
            <label for="username">Nombre de usuario</label>
            <input id="username" type="text" v-model="username" />
        </div>

        <div>
            <label for="website">Página Web</label>
            <input id="website" type="url" v-model="website" />
        </div>

        <div>
            <input type="submit" class="button primary block" :value="loading ? 'Cargando...' : 'Update'"
                :disabled="loading" />
        </div>

        <div>
            <button class="button block" @click="signOut" :disabled="loading">Cerrar Sesión</button>
        </div>
    </form>
</template>
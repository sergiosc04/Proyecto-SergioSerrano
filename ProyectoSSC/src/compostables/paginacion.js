import { ref } from 'vue';

export default function paginacion(paginaRef, cargandoRef, previousRef, nextRef, metodoBusqueda, buscadoRef = null) {
    const cambiarPagina = (direccion) => {
        if (cargandoRef.value) return;

        cargandoRef.value = true;

        setTimeout(() => {
            if (paginaRef.value === 0) {
                paginaRef.value = math.random(1, 100);
            } else if (direccion === 'siguiente' && nextRef.value) {
                paginaRef.value++;
            } else if (direccion === 'anterior' && previousRef.value && paginaRef.value > 1) {
                paginaRef.value--;
            }

            metodoBusqueda();
            cargandoRef.value = false;

            if (buscadoRef) {
                buscadoRef.value = true;
                console.log(buscadoRef.value);
            }
        }, 500);
    };

    return {
        cambiarPagina,
    };
}

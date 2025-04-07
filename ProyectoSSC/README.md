# ProyectoSSC

Pasos para configurar el IDE para que funcione al desarrollar la web

## Configuración IDE (Desactivar Vetur si está instalado)

[VSCode](https://code.visualstudio.com/) + [Extensión Vue Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Configuración de vite (Aquí no he tocado nada)

See [Vite Configuration Reference](https://vite.dev/config/).

## Preparar proyecto. En la ruta del proyecto creado

```sh
npm install
```

### Instalar AXIOS para procesar los datos de la API

```sh
npm install axios@latest
```

### Instalar PINIA y SUPABASE para gestionar las sesiones

```sh
npm install pinia
```

```sh
npm install @supabase/supabase-js
```

### Compilar y recarga en caliente para desarrollo

```sh
npm run dev
```

### Compilar y minificar para producción

```sh
npm run build
```

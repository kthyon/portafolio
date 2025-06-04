# Proyecto Portafolio

Sitio web construido con [Astro](https://astro.build/) para mostrar mi hoja de vida y trabajos destacados.

## Desarrollo local

Instala las dependencias y levanta un servidor de desarrollo:

```bash
npm install
npm run dev
```

## Construcción

Para generar la versión de producción ejecuta:

```bash
npm run build
```

Luego puedes previsualizar el resultado con:

```bash
npm run preview
```

## Despliegue

El flujo de trabajo en `.github/workflows/deploy.yml` compila el proyecto y lo publica en GitHub Pages.
Habilita GitHub Pages en la configuración del repositorio y realiza un push a la rama `main` para
desencadenar el despliegue. La URL resultante se mostrará en la pestaña **Actions** una vez que el
workflow finalice.

Si prefieres subirlo manualmente, ejecuta `npm run build` y carga la carpeta `dist` en tu servidor.


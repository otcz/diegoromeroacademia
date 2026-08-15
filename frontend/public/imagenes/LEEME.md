# Imágenes de la aplicación

Todo lo que hay aquí lo sirve Angular tal cual, en la raíz del sitio. Un archivo
`heroe-diego-vertical.webp` queda accesible en `/imagenes/heroe-diego-vertical.webp`.

## Convención

- **kebab-case, sin tildes ni eñes.** Un acento en un nombre de archivo se convierte en
  `%C3%B3` en la URL y rompe cachés y auditorías.
- **Nombre descriptivo**, no el que traía el móvil: `heroe-diego-vertical.webp`, nunca
  `IMG_20260815_0042.jpg`.
- **WebP** para fotos y capturas. Un JPEG de 800 kB tarda segundos en la conexión móvil desde
  la que llega la mayoría del tráfico.
- **Nada de secretos ni material sin licencia.** Esta carpeta es pública por definición.

## Huecos que la página espera

Las rutas se declaran en `src/app/disenio/activos.ts`. Hoy están todas en `null` y cada hueco
lo pinta un degradado del sistema. Poner una foto es dejar el archivo aquí y cambiar el `null`
por su ruta.

| Clave en `activos.ts` | Para qué | Formato |
|---|---|---|
| `heroe` | Fondo del héroe | 16:9 · mínimo 2400 px |
| `simulador` | Captura del simulador en su marco de ventana | 16:10 |
| `cursoCompleto` | Portada del curso por niveles | 3:2 · mínimo 800 px |
| `laGotaFria` | Portada del tutorial | 3:2 · mínimo 800 px |
| `losCaminosDeLaVida` | Portada del tutorial | 3:2 · mínimo 800 px |

Los avatares de los testimonios **no necesitan foto**: `<adr-avatar>` degrada a iniciales.

Ver también `activos/referencia/LEEME.md`, donde está el material descartado y el porqué.

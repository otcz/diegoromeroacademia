# Originales de material fotográfico

Aquí viven los archivos **tal como llegaron**, sin recortar ni tratar. Nunca se publican
directos: `frontend/scripts/tratar-imagenes.mjs` los recorta, iguala y tiñe, y deja el
resultado en `frontend/public/imagenes/`.

```bash
cd frontend && npm run imagenes:tratar && npm run imagenes:optimizar
```

Se conservan los originales porque el tratamiento **destruye información**: al recortar a 3:2
se tira la mitad de una vertical, y de un JPEG ya tratado no se puede volver atrás. Si mañana
hace falta el mismo motivo en 16:9, se parte de aquí.

---

## Registro de procedencia y licencia

Esta tabla es obligatoria. Es un sitio **comercial**: si una imagen no puede justificar su
derecho de uso, no se publica. Ninguna imagen entra a `public/imagenes/` sin una fila aquí.

| Archivo | Origen | Licencia | ¿Atribución? | Estado |
|---|---|---|---|---|
| `practica-dedos-botonadura.jpg` | Pexels | Licencia Pexels — uso comercial libre | No | **En uso** → `practica-botonadura.webp` |
| `practica-mano-acordeon-rojo.jpg` | Pexels | Licencia Pexels — uso comercial libre | No | Descartada (instrumento) |
| `practica-manos-tocando.jpg` | Pexels | Licencia Pexels — uso comercial libre | No | Descartada (instrumento) |
| `commons-acordeon-vallenato.jpg` | Wikimedia Commons, «Acordeón vallenato.jpg» | **Dominio público** | No | Reserva |

---

## Por qué se descartaron dos de las tres

El vallenato se toca con **acordeón diatónico de botones** (el Hohner Corona es el estándar
del género). No es un detalle de aficionado: es el instrumento que la academia enseña y el que
el simulador de pisadas reproduce.

- `practica-mano-acordeon-rojo.jpg` — acordeón **cromático europeo**: botonera blanca de
  filas, guantes sin dedos, calle. Otro género.
- `practica-manos-tocando.jpg` — acordeón **de piano**: teclas blancas y negras a la vista.
  Otro instrumento.

Publicarlas costaba credibilidad justo con el público que más importa: el alumno que ya sabe
qué acordeón quiere aprender lo detecta en la primera pantalla. Se quedan aquí tratadas y
listas por si alguna vez hace falta una imagen genérica de «música», no de «vallenato».

`commons-acordeon-vallenato.jpg` sí es un Hohner Corona III y está en dominio público, pero
es una instantánea con flash a 1034x751: no da el ancho para ningún hueco de la página. Sirve
de reserva o de apoyo pequeño, no de protagonista.

---

## Lo que falta

Nada de esto sustituye una **sesión de fotos con Diego y su acordeón**. Las fotos de banco
resuelven el hueco, no construyen la marca: ninguna de estas imágenes puede aparecer en el
héroe, porque el héroe tiene que ser él. Ver la decisión pendiente en `docs/00-contexto.md`.

## Material sin verificar

Las pinturas al óleo de temática vallenata que se recibieron el 2026-08-15 **no están aquí**
y no se han usado. Son obra firmada de otros pintores («Ru…», «momo/2016») y hasta que no
conste por escrito la compra, el encargo o la cesión de derechos, no entran al repositorio ni
al sitio. Culturalmente son las que mejor representan el género — uno de los cuadros muestra
un Hohner Corona junto a sombrero vueltiao, caja y guacharaca — así que vale la pena
conseguir el permiso en vez de descartarlas.

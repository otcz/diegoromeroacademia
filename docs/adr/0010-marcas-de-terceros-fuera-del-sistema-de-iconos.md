# ADR 0010 · Las marcas de terceros viven fuera del sistema de iconos

**Estado:** aceptado
**Fecha:** 2026-08-15
**Deciden:** Oscar Tomás Carrillo Zuleta

---

## Contexto

La pantalla de acceso dibujaba el botón «Continuar con Google» con `<adr-icono nombre="google-logo">`,
es decir con la «G» de **Phosphor duotone**: un glifo monocromo que se tiñe con `currentColor`
como cualquier otro icono del sistema.

Eso incumple dos cosas a la vez:

1. **La identidad de Google.** Sus normas para «Iniciar sesión con Google» exigen su logotipo
   de cuatro colores, sin recolorear, sin deformar y sin sustituir por una versión parecida.
2. **La confianza del visitante.** Un logotipo aproximado en una pantalla que pide credenciales
   es exactamente la señal que enseña a desconfiar. El dueño lo describió como que «no se ve
   profesional» antes de saber por qué, que es justo como funciona esa señal: se nota sin
   poder señalarla.

La regla 12 del proyecto y el [ADR 0005](0005-iconografia-phosphor.md) dicen «Phosphor duotone,
exclusivamente». Aplicada al pie de la letra, esa regla obliga a incumplir la norma de Google.
Hay que resolver la contradicción por escrito y no caso por caso.

## Decisión

**Un icono y una marca son cosas distintas, y se guardan en sitios distintos.**

- Un **icono** comunica una idea (candado, reloj, certificado). Es nuestro, sale solo de
  Phosphor duotone, se tiñe con `currentColor` y se consume por `<adr-icono>`. El ADR 0005
  sigue vigente sin excepciones.
- Una **marca** identifica a su titular (Google, Facebook). No es nuestra: su forma, sus
  colores y su rejilla los fija su dueño. Vive en `disenio/iconos/marcas.ts`, se escribe a
  mano, no pasa por `npm run iconos:generar` y se consume por `<adr-marca>`.

`<adr-marca>` es un componente aparte **a propósito**. Si las marcas entraran en el registro de
iconos, `<adr-icono>` tendría que aprender cuándo *no* heredar el color — y esa excepción se
olvidaría en el primer icono nuevo. Separados, la regla se cumple sola: por el camino de los
iconos no hay forma de meter un color, y por el de las marcas no hay forma de perderlo.

Es también el único punto del proyecto donde se escriben colores literales en vez de tokens
(regla 15). El azul de Google no es de nuestra paleta y no puede seguirla.

## Alternativas consideradas

| Alternativa | A favor | En contra | Por qué se descartó |
|---|---|---|---|
| **Marcas aparte, en `<adr-marca>`** (elegida) | Cumple la norma de cada titular; deja el ADR 0005 intacto; la separación hace imposible el error | Un componente más en el catálogo | — |
| Dejar la «G» de Phosphor | Cero trabajo; una sola gramática visual | Incumple la norma de Google; y un logotipo aproximado en una pantalla de credenciales destruye la confianza que esa pantalla necesita | El ahorro no compra nada y el costo es el peor posible |
| Meter las marcas en el registro de iconos con un color propio | Un solo componente | Obliga a `<adr-icono>` a saber cuándo no teñir; la excepción se pierde en el siguiente icono | Convierte una regla que se cumple sola en una que hay que recordar |
| Usar el botón que publica Google (su script) | Siempre al día con su norma | Un tercero pinta dentro de nuestra página y decide su tipografía y su tamaño; una petición más antes de poder entrar | Rompe la coherencia del catálogo (regla 11) por un problema que no tenemos |

## Consecuencias

**Positivas**

- El botón de ingreso cumple la norma del proveedor sin retocar el sistema de iconos.
- La lista de marcas ajenas usadas en el producto está en **un solo archivo**, con el titular
  declarado en cada una: se puede rendir cuentas de todas de un vistazo.
- La variante `proveedor` de `<adr-boton>` no invierte al pasar el ratón, cosa que `secundario`
  sí hacía — y que habría dejado la «G» de cuatro colores sobre fondo oscuro.

**Negativas — lo que se acepta pagar**

- Dos componentes donde antes había uno; hay que saber cuál pedir.
- Las marcas se actualizan **a mano**: si un titular cambia su logotipo, nadie nos avisa.

**Qué obligaría a revisar esta decisión**

- Que se sumen muchos proveedores y mantener los SVG a mano deje de ser razonable.
- Que Google pase a exigir su propio widget en vez de permitir un botón propio.

## Nota relacionada: `color-scheme`

Al medir esto se destapó otra cosa. El navegador del dueño aplicaba el **tema oscuro automático
de Chrome**: sin declarar nada, Chrome invierte los colores de una página cuando el sistema
está en oscuro. Eso repintaba el panel niebla como azul noche y la tinta como blanco — y se
llevaba por delante las medidas de contraste del [ADR 0009](0009-contraste-aa-de-las-tintas-de-texto.md),
tomadas sobre los colores reales. Sobre un logotipo ajeno de cuatro colores el problema es peor,
porque esos colores no son nuestros para alterarlos.

`global.scss` declara ahora `color-scheme: only light`, que es la única forma de renunciar a ese
repintado. **No cierra la puerta a un modo oscuro propio**: el día que exista, se diseña, se mide
y se cambia esa línea. Lo que no se acepta es que lo decida un algoritmo del navegador.

# 03 · Parametrización y configuración

**Cubre las reglas 4 y 5 del proyecto.**

> Ningún valor de negocio se escribe dentro del código. Si un número puede cambiar, no es
> código: es configuración o es un dato.

---

## 1. Los tres destinos posibles de un valor

Antes de escribir cualquier número o texto, se decide a cuál de estos tres pertenece. Esta es
la regla que evita tanto el código rígido como la configuración inmanejable.

| Destino | Cuándo | Cambia mediante | Ejemplos |
|---|---|---|---|
| **Base de datos** | Lo decide el negocio y puede cambiar en caliente, sin desplegar | Panel de administración | Precio del plan anual, cupones, puntaje mínimo de un examen, stock mínimo de un producto |
| **Configuración de entorno** | Cambia entre ambientes o es un límite técnico/de política | Variable de entorno + redespliegue | URL de la pasarela, expiración del token, límite de dispositivos, tamaño máximo de archivo |
| **Constante en código** | Es una ley invariable del dominio | Cambio de código y ADR | `MILISEGUNDOS_POR_SEGUNDO`, longitud del código de certificado, patrón de correo |

**Prueba de decisión:** si Diego puede querer cambiarlo un martes cualquiera, va en base de
datos. Si cambia solo al mover el sistema de ambiente, va en configuración. Si cambiarlo
significaría que el negocio es otro, es constante.

**Nada queda fuera de estas tres categorías.** Un literal suelto en medio de un método es un
defecto, no un detalle.

---

## 2. Cómo se declara la configuración

Siempre con `record` + `@ConfigurationProperties` + `@Validated`. Nunca con `@Value` disperso
por las clases: eso esconde la configuración y hace imposible saber qué necesita el sistema
para arrancar.

```java
// Reúne todos los límites de seguridad de sesión en un solo lugar. Se valida al arrancar
// para que un valor mal puesto falle en el despliegue y no a mitad de la noche.
@Validated
@ConfigurationProperties(prefix = "academia.seguridad")
public record SeguridadConfiguracion(
        @NotNull @Positive Duration expiracionTokenAcceso,
        @NotNull @Positive Duration expiracionTokenRefresco,
        @Min(1) @Max(10) int dispositivosSimultaneosMaximos,
        @Min(1) int intentosLoginMaximos,
        @NotNull Duration bloqueoTrasIntentosFallidos
) {}
```

**Reglas:**

1. Un `record` de configuración **por área**, no uno gigante ni uno por clase.
2. Toda propiedad lleva anotación de validación. **La aplicación no arranca con configuración
   inválida** — fallar al arrancar es infinitamente más barato que fallar en producción.
3. Los tiempos son `Duration`, nunca `int` de milisegundos sueltos.
4. El dinero es `BigDecimal` con moneda explícita. **Nunca `double`.**
5. Todo valor tiene un valor por defecto seguro documentado en `application.yml`.
6. **Sin rutas absolutas** en ningún lado (especificación §16.2).

---

## 3. Inventario de parámetros

Este es el catálogo vivo. Todo parámetro nuevo se agrega aquí en el mismo commit que lo crea.

### Seguridad y sesión

| Parámetro | Defecto | Origen |
|---|---|---|
| `academia.seguridad.expiracion-token-acceso` | `PT15M` | Especificación §5.3 |
| `academia.seguridad.expiracion-token-refresco` | `P30D` | Especificación §5.3 |
| `academia.seguridad.dispositivos-simultaneos-maximos` | `2` | Especificación §5.3 |
| `academia.seguridad.expiracion-token-recuperacion` | `PT1H` | Especificación §5.3 |
| `academia.seguridad.intentos-login-maximos` | `5` | Política de seguridad |
| `academia.seguridad.bloqueo-tras-intentos-fallidos` | `PT15M` | Política de seguridad |

### Contenido y video

| Parámetro | Defecto | Origen |
|---|---|---|
| `academia.video.expiracion-url-firmada` | `PT5M` | Especificación §12.2 |
| `academia.video.marca-agua-habilitada` | `true` | Especificación §12.2 |
| `academia.video.dominios-autorizados` | — | Especificación §12.2 |
| `academia.video.proveedor` | — | Decisión pendiente #3 |

### Aprendizaje y evaluación

| Parámetro | Defecto | Origen |
|---|---|---|
| `academia.evaluacion.peso-teoria` | `0.40` | Especificación §7.3 |
| `academia.evaluacion.peso-practica` | `0.60` | Especificación §7.3 |
| `academia.evaluacion.intentos-maximos` | `3` | Por definir con Diego |
| `academia.evaluacion.tamanio-maximo-video-mb` | `200` | Límite técnico |
| `academia.evaluacion.formatos-video-permitidos` | `mp4,mov` | Límite técnico |

> `peso-teoria` y `peso-practica` deben sumar 1.0. Se valida al arrancar con
> `@AssertTrue`. Un examen calificado con pesos que no suman 1 es un fallo silencioso
> que solo se descubre cuando un alumno reclama.

### Práctica y simulador

| Parámetro | Defecto | Origen |
|---|---|---|
| `academia.practica.bpm-minimo` | `40` | Especificación §8.1 |
| `academia.practica.bpm-maximo` | `200` | Especificación §8.1 |
| `academia.practica.afinaciones-soportadas` | `FBE,GCF,ADG` | Especificación §8.2 |

### Comercio

| Parámetro | Defecto | Origen |
|---|---|---|
| `academia.comercio.moneda` | `COP` | Mercado principal |
| `academia.comercio.pais-por-defecto` | `CO` | Mercado principal |
| `academia.comercio.pasarela` | — | Decisión pendiente #1 |
| `academia.comercio.reintentos-webhook` | `5` | Política de integración |

### Plataforma

| Parámetro | Defecto | Origen |
|---|---|---|
| `academia.api.tamanio-pagina-por-defecto` | `20` | Regla de escala |
| `academia.api.tamanio-pagina-maximo` | `100` | Regla de escala |
| `academia.api.limite-peticiones-por-minuto` | `120` | Política de seguridad |
| `academia.whatsapp.numero` | — | Configuración de marca |
| `academia.whatsapp.mensaje-plantilla` | — | Configuración de marca |

---

## 4. Banderas de funcionalidad

Las fases 2 a 5 se construyen detrás de banderas. Permiten integrar código a la rama principal
sin publicarlo, que es lo que evita las ramas de larga vida y sus fusiones dolorosas.

```yaml
academia:
  funcionalidades:
    examenes-habilitados: false        # fase 2
    certificados-habilitados: false    # fase 2
    simulador-habilitado: false        # fase 3
    tienda-habilitada: false           # fase 4
    login-facebook-habilitado: false   # prioridad media, especificación §5.1
```

La bandera se consulta **en una sola capa** (el caso de uso o la guarda de ruta), nunca
salpicada por todo el código. Cuando una funcionalidad se estabiliza, **la bandera se borra**:
las banderas viejas son deuda técnica que acumula ramas muertas.

---

## 5. Secretos

**Ningún secreto en el repositorio.** Ni en `application.yml`, ni en un `.env` versionado,
ni en un comentario, ni en un test.

| Ambiente | Mecanismo |
|---|---|
| Local | `.env` **ignorado por Git**, más `.env.ejemplo` versionado con claves vacías y comentadas |
| Producción | Google Secret Manager, inyectado como variable de entorno en Cloud Run |

Secretos del proyecto: credenciales de PostgreSQL, secreto de firma JWT, claves de la pasarela
(pública y privada), secreto de validación de webhook, credenciales OAuth de Google y Facebook,
API key del proveedor de video, API key de SendGrid, token de WhatsApp Business, credenciales
de Google Cloud Storage.

**Si un secreto se filtra a un commit, se rota — no basta con borrarlo.** Queda en el
historial de Git para siempre.

Se activa detección de secretos (`gitleaks`) como hook de pre-commit y como paso de CI.

---

## 6. Ambientes

| Ambiente | Perfil Spring | Base de datos | Notas |
|---|---|---|---|
| Local | `local` | PostgreSQL en Docker | Logs legibles, banderas de fases activables |
| Pruebas | `test` | Testcontainers | Efímera, se crea y destruye por ejecución |
| Producción | `prod` | Cloud SQL | Logs JSON, `min-instances=1`, todas las validaciones activas |

El código **nunca pregunta en qué ambiente está**. Un `if (esProduccion)` es una fuga de
configuración hacia el código: lo que cambia es el valor del parámetro, no la lógica.

---

## 7. Configuración del frontend

- Los valores de ambiente viven en `frontend/src/environments/`.
- **El frontend nunca contiene secretos.** Todo lo que llega al navegador es público, sin
  excepción, aunque esté minificado.
- Los textos visibles se centralizan desde el día uno para permitir traducción futura, aunque
  hoy solo exista español.
- Las banderas de funcionalidad llegan desde el backend en el arranque de sesión: una sola
  fuente de verdad para las dos puntas.

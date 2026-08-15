# 06 · Ciberseguridad

**Cubre la regla 16 del proyecto.**

> Los permisos se validan **en cada capa**, nunca solo en el front. Todo lo que llega del
> cliente es hostil hasta que se demuestre lo contrario — incluido lo que envía nuestra
> propia aplicación Angular.

Este proyecto maneja tres cosas que lo vuelven un objetivo real: **dinero** (pasarela de
pagos), **datos personales de menores potencialmente** (documento de identidad para los
certificados) y **contenido de pago** (videos que otros quieren gratis).

---

## 1. Autenticación

| Medida | Detalle |
|---|---|
| Métodos | Google OAuth 2.0, Facebook Login, correo y contraseña |
| **Unificación por correo** | Un correo resuelve siempre al mismo `Usuario`. La tabla `identidad_externa` vincula proveedores a esa cuenta única |
| Contraseñas | **BCrypt** con factor ≥ 12. Jamás en texto plano, jamás con MD5 o SHA sueltos |
| Verificación de correo | Obligatoria en el registro tradicional antes de dar acceso a contenido |
| Recuperación | Token de un solo uso, expiración configurable (1h), invalidado al usarse |
| Tokens de sesión | JWT de vida corta (15 min) + refresh token rotativo persistido |
| Dispositivos | Máximo configurable (2 por defecto), para frenar el préstamo de credenciales |
| Fuerza bruta | Bloqueo temporal tras 5 intentos fallidos, contado por cuenta **y** por IP |

**Riesgo específico del OAuth:** al vincular una identidad externa se exige que el proveedor
declare el correo como **verificado**. Un proveedor que devuelve un correo sin verificar
permitiría apropiarse de la cuenta de otro simplemente registrando ese correo en el proveedor.
Es el fallo clásico de la unificación por correo, y hay que cerrarlo desde el primer día.

**Rotación de refresh token:** cada uso emite uno nuevo e invalida el anterior. Si un token ya
usado vuelve a aparecer, se revoca la sesión completa — es la señal de que fue robado.

---

## 2. Autorización

Cuatro controles independientes, todos en el backend:

1. **¿Está autenticado?** Filtro de seguridad.
2. **¿Tiene el rol?** `@PreAuthorize` a nivel de caso de uso, no de controlador.
3. **¿Tiene acceso a ese recurso concreto?** Consulta a `acceso_recurso`. Es el control que
   distingue a un alumno que pagó de uno que no.
4. **¿Cumple la regla de progresión?** El nivel N+1 exige el examen del nivel N aprobado.

**Las guardas de ruta de Angular son solo experiencia de usuario.** Ocultar un botón no es
control de acceso (no negociable #4). Todo endpoint asume que el cliente puede ser `curl`.

**Referencias directas inseguras:** ningún endpoint entrega un recurso por su id sin verificar
que pertenece a quien lo pide. `GET /api/inscripciones/42` debe comprobar que la inscripción 42
es del usuario autenticado. Es la vulnerabilidad número uno de las plataformas educativas.

---

## 3. Protección del contenido de video

Del documento maestro §12, con la advertencia honesta que debe repetirse:

> **El blindaje total no existe.** Quien graba pantalla siempre puede. La marca de agua no
> impide la copia: **identifica al que filtró**, que es lo que realmente disuade.

| Medida | Estado |
|---|---|
| Streaming HLS segmentado | Fase 1 |
| URL firmada de vida corta (5 min), validada contra la sesión | Fase 1 |
| Marca de agua dinámica con nombre y documento, en posición variable | Fase 1 |
| Validación de origen: el reproductor solo funciona desde el dominio autorizado | Fase 1 |
| Límite de sesiones simultáneas | Fase 1 |
| DRM (Widevine / FairPlay) | Fase posterior — encarece la infraestructura de forma considerable |

La URL firmada **se emite por petición y por usuario**, nunca se cachea ni se comparte entre
alumnos. Si se cachea, un solo enlace filtrado abre el catálogo entero.

---

## 4. Pagos

| Regla | Motivo |
|---|---|
| **El webhook es la única fuente de verdad** | El frontend puede ser manipulado. La redirección de retorno también |
| Firma del webhook verificada siempre | Sin verificar firma, cualquiera puede simular un pago con un `POST` |
| **Idempotencia obligatoria** | Las pasarelas reintentan. Se guarda `referencia_externa` con índice único |
| El monto se recalcula en el backend | Nunca se confía en el precio que envía el cliente |
| Nunca se almacenan datos de tarjeta | Se delega íntegramente en la pasarela |
| El `payload` crudo se guarda cifrado o sin datos sensibles | Sirve para auditoría; no debe volverse un depósito de datos personales |
| Toda transición de pago queda en bitácora | Quién, cuándo, desde dónde, resultado |

---

## 5. OWASP Top 10 aplicado a este proyecto

| Riesgo | Dónde aparece aquí | Control |
|---|---|---|
| Control de acceso roto | Ver clase sin pagar, saltarse niveles, ver pedidos ajenos | §2, cuatro controles + tests obligatorios |
| Fallas criptográficas | Contraseñas, tokens, secretos | BCrypt ≥12, TLS obligatorio, Secret Manager |
| Inyección | Búsqueda de catálogo, filtros del panel | **Solo consultas parametrizadas.** Nunca concatenar SQL |
| Diseño inseguro | Unificación de cuentas, acceso permanente vs temporal | Modelado explícito y probado |
| Configuración insegura | Cabeceras, CORS, mensajes de error | §6 |
| Componentes vulnerables | Dependencias de Maven y npm | `dependency-check` y `npm audit` en CI |
| Fallas de identificación | Fuerza bruta, sesiones, OAuth | §1 |
| Fallas de integridad | Webhooks falsificados, subidas de archivo | Firma verificada, validación de tipo real de archivo |
| Fallas de registro y monitoreo | Detección tardía de abuso | Bitácora de eventos de seguridad + alertas |
| SSRF | Video del examen por URL, importación de recursos | Lista blanca de destinos, sin seguir redirecciones |

---

## 6. Configuración de la plataforma

**Cabeceras HTTP obligatorias:**

```
Content-Security-Policy      (estricta; sin 'unsafe-inline' en scripts)
Strict-Transport-Security    max-age=31536000; includeSubDomains
X-Content-Type-Options       nosniff
X-Frame-Options              DENY
Referrer-Policy              strict-origin-when-cross-origin
Permissions-Policy           (cámara y micrófono denegados salvo donde se necesiten)
```

**CORS:** lista blanca explícita de orígenes. **Nunca `*`**, nunca reflejar el `Origin`
recibido.

**Límite de peticiones (rate limiting):** obligatorio en login, registro, recuperación de
contraseña, webhook y firma de URL de video. Configurable en `academia.api.limite-peticiones-por-minuto`.

**Subida de archivos** (video del examen, recursos del panel):

- Tamaño máximo configurable.
- Tipo verificado por **contenido real**, no por la extensión ni por el `Content-Type` que
  envía el cliente.
- Nombre saneado y regenerado; jamás se usa el nombre original en el sistema de archivos.
- Almacenamiento fuera del servidor de aplicación (Cloud Storage), sin permiso de ejecución.

**Mensajes de error:** al cliente va un mensaje genérico y un código; el detalle va al log.
Un `stack trace` en la respuesta revela la estructura interna del sistema.

---

## 7. Datos personales

Colombia — **Ley 1581 de 2012 (Habeas Data)** y su decreto reglamentario. Aplica de verdad,
porque se recolecta documento de identidad para los certificados.

| Obligación | Cómo se cumple |
|---|---|
| Autorización previa e informada | Casilla explícita en el registro, **no premarcada**, con enlace a la política |
| Finalidad declarada | Política de tratamiento publicada en el sitio |
| Derechos del titular | Canal para consultar, actualizar, rectificar y suprimir datos |
| Minimización | Solo se pide el documento **cuando se emite el certificado**, no en el registro |
| Seguridad | Cifrado en tránsito y en reposo; acceso restringido por rol |
| Menores de edad | Requieren autorización del representante legal. Hay que definir cómo se maneja — el público de acordeón incluye adolescentes |

**El documento de identidad nunca aparece completo en logs, reportes ni respuestas de API**
salvo en el PDF del certificado y en el perfil del propio titular. En cualquier otro lugar va
enmascarado.

**Página pública de verificación** `/verificar/{codigo}`: muestra validez, nombre y curso.
**No expone** el documento, ni el correo, ni ningún otro dato — es una página pública indexable.

---

## 8. Secretos y dependencias

- Ningún secreto en el repositorio (ver `docs/03 §5`). `gitleaks` en pre-commit y en CI.
- Un secreto filtrado a un commit **se rota**; borrarlo del archivo no lo borra del historial.
- Dependencias auditadas en cada PR (`dependency-check`, `npm audit`) y actualizadas
  semanalmente. Una vulnerabilidad crítica bloquea el despliegue.
- Imágenes de contenedor escaneadas antes de publicar.
- Se fijan versiones exactas: sin rangos abiertos que traigan código nuevo sin revisar.

---

## 9. Registro de seguridad y respuesta

**Eventos que siempre quedan registrados** (sin datos sensibles): inicio de sesión exitoso y
fallido, cambio de contraseña, vinculación de identidad externa, cambio de rol, acceso
otorgado o revocado, pago confirmado o rechazado, emisión de certificado, acceso denegado por
autorización.

**Alertas configuradas:** picos de login fallido, un mismo video servido a un número anómalo
de IPs distintas (señal de credenciales compartidas), webhooks con firma inválida, y errores
5xx sostenidos.

**Si se detecta una filtración de credenciales:** revocar todas las sesiones del usuario,
forzar cambio de contraseña, y revisar la bitácora de accesos de esa cuenta. El procedimiento
completo se documenta en `docs/procesos/` cuando se implemente la fase 1.

---

## 10. Revisión de seguridad

Antes de cada despliegue a producción:

- [ ] Ningún endpoint nuevo sin control de autorización
- [ ] Ninguna consulta construida por concatenación de cadenas
- [ ] Ningún dato personal nuevo en logs
- [ ] Dependencias sin vulnerabilidades críticas
- [ ] Secretos fuera del código y del historial
- [ ] Cabeceras de seguridad activas
- [ ] Límite de peticiones cubriendo los endpoints sensibles

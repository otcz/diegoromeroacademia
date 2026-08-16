-- V002 - Contrasenas y verificacion de correo.
--
-- Dos cosas que van juntas por una razon de seguridad, no de comodidad.
--
-- `usuario.correo_verificado` es lo que hace SEGURA la unificacion del no negociable #1.
-- Sin esa marca, cualquiera podria registrar el correo de otra persona con una contrasena y
-- quedarse con su cuenta el dia que esa persona entrara por Google: el sistema las uniria y
-- el atacante conoceria la clave. Con la marca, una cuenta sin verificar no puede usarse, y
-- si un proveedor externo prueba despues que el correo es de otro, esa contrasena se descarta.
--
-- Se crea en TRUE para las filas existentes: las cuentas que hay hoy nacieron por Google, que
-- ya verifico el correo. El DEFAULT queda en FALSE para que lo que venga despues, no.

BEGIN;

ALTER TABLE usuario
    ADD COLUMN correo_verificado BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE usuario SET correo_verificado = TRUE
 WHERE id IN (SELECT usuario_id FROM identidad_externa WHERE proveedor <> 'CORREO');

COMMENT ON COLUMN usuario.correo_verificado IS
    'Si ALGUIEN probo que el correo es suyo. Sin esto, la unificacion por correo es apropiacion de cuenta.';


CREATE TABLE credencial (
    usuario_id       UUID        PRIMARY KEY,

    -- BCrypt con factor >= 12 (docs/06). Nunca la contrasena en claro, nunca MD5 ni SHA.
    -- El formato de BCrypt ya lleva dentro su sal y su factor de coste, asi que no hacen
    -- falta columnas aparte y se puede subir el coste sin migrar los hashes viejos.
    cifrada          TEXT        NOT NULL,

    -- Freno de fuerza bruta (especificacion §5.3): cinco fallos y bloqueo temporal.
    -- El bloqueo caduca solo; uno permanente convertiria el ataque en una denegacion de
    -- servicio contra el alumno, que es peor que el ataque.
    fallos_seguidos  INTEGER     NOT NULL DEFAULT 0,
    bloqueada_hasta  TIMESTAMPTZ,

    actualizada_en   TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT credencial_usuario_fk
        FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,
    CONSTRAINT credencial_fallos_no_negativos CHECK (fallos_seguidos >= 0),
    CONSTRAINT credencial_hash_es_bcrypt CHECK (cifrada LIKE '$2%')
);

COMMENT ON TABLE credencial IS
    'Contrasena de un usuario. Tabla aparte de `usuario` porque casi ninguna consulta la necesita y asi no se lee sin querer.';
COMMENT ON CONSTRAINT credencial_hash_es_bcrypt ON credencial IS
    'Red de seguridad: si alguna vez se intenta guardar texto plano, la base lo rechaza.';

-- Sin indice adicional: la clave primaria es `usuario_id` y toda consulta entra por ahi.

COMMIT;

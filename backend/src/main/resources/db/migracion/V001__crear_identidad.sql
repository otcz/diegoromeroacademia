-- V001 — Identidad: usuarios y sus formas de entrar.
--
-- Sostiene el no negociable #1 («un correo = una cuenta») con una restriccion de la base y
-- no solo con codigo: aunque dos peticiones simultaneas de Google pasen a la vez por el caso
-- de uso, la unicidad de `correo` impide que nazcan dos cuentas. La carrera se resuelve con
-- un error de clave duplicada, que es recuperable; una cuenta duplicada, no.
--
-- Aplicar con:
--   psql "$BD_URL" -v ON_ERROR_STOP=1 -f src/main/resources/db/migracion/V001__crear_identidad.sql

BEGIN;

CREATE TABLE usuario (
    id             UUID         PRIMARY KEY,

    -- Guardado SIEMPRE en minusculas: lo normaliza el objeto de valor Correo al construirse.
    -- CITEXT haria el trabajo, pero exige una extension y esconderia la regla en la base en
    -- vez de dejarla en el dominio, donde se puede probar sin PostgreSQL.
    correo         TEXT         NOT NULL,

    nombre         TEXT         NOT NULL,

    -- Texto y no un ENUM de PostgreSQL: anadir un valor a un ENUM exige ALTER TYPE, que en
    -- PostgreSQL no se puede revertir dentro de una transaccion. Con TEXT + CHECK, agregar
    -- un rol es una migracion normal.
    rol            TEXT         NOT NULL,

    activo         BOOLEAN      NOT NULL DEFAULT TRUE,
    registrado_en  TIMESTAMPTZ  NOT NULL,

    CONSTRAINT usuario_correo_unico UNIQUE (correo),
    CONSTRAINT usuario_rol_valido CHECK (rol IN ('ALUMNO', 'INSTRUCTOR', 'ADMINISTRADOR')),
    CONSTRAINT usuario_correo_normalizado CHECK (correo = lower(correo))
);

COMMENT ON TABLE usuario IS
    'Persona con cuenta. El correo es la identidad: no negociable #1.';
COMMENT ON CONSTRAINT usuario_correo_normalizado ON usuario IS
    'Red de seguridad: si alguna vez se inserta sin pasar por el objeto de valor Correo, falla aqui.';


CREATE TABLE identidad_externa (
    id          UUID   PRIMARY KEY,
    usuario_id  UUID   NOT NULL,

    proveedor   TEXT   NOT NULL,

    -- Identificador estable del proveedor (el `sub` de Google). NO es el correo: una persona
    -- puede cambiar su correo en Google conservando la cuenta, y el sujeto sigue igual.
    sujeto      TEXT   NOT NULL,

    CONSTRAINT identidad_externa_usuario_fk
        FOREIGN KEY (usuario_id) REFERENCES usuario (id) ON DELETE CASCADE,

    -- Un mismo sujeto no puede apuntar a dos usuarios: es lo que hace que reconocer a quien
    -- vuelve sea determinista.
    CONSTRAINT identidad_externa_unica UNIQUE (proveedor, sujeto),

    -- Y un usuario no acumula dos identidades del mismo proveedor.
    CONSTRAINT identidad_externa_una_por_proveedor UNIQUE (usuario_id, proveedor),

    CONSTRAINT identidad_externa_proveedor_valido
        CHECK (proveedor IN ('GOOGLE', 'FACEBOOK', 'CORREO'))
);

COMMENT ON TABLE identidad_externa IS
    'Como reconoce cada proveedor a un usuario. Varias filas cuelgan del mismo usuario: es lo que evita las cuentas duplicadas.';

-- La busqueda por identidad es la primera consulta de CADA ingreso. La restriccion UNIQUE ya
-- crea su indice, asi que no se anade otro: seria peso muerto en cada escritura.

COMMIT;

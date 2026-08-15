# Academia Diego Romero

Plataforma web de formación musical en línea (acordeón vallenato) construida sobre la marca
personal de Diego Romero. Suscripción a cursos por niveles, venta suelta de tutoriales y
tienda de instrumentos.

**Diferenciador:** simulador de pisadas de botones sincronizado con video.

---

## Estado

**Fase 0 — fundamentos.** Están el marco de buenas prácticas, la especificación funcional, el
sistema visual aprobado y el andamiaje de backend y frontend. No hay todavía reglas de negocio
implementadas.

| Parte | Estado |
|---|---|
| Documentación y reglas | Completa |
| Frontend | Verificado: compila, lint limpio, 33 pruebas, 100% de cobertura |
| Backend | Verificado: 41 pruebas, 100% de cobertura, las cinco puertas de calidad en verde |
| Contenedores | Imágenes construidas; la API arranca y responde `UP` conectada a PostgreSQL |
| Entorno de demostración | Pendiente del túnel de Cloudflare ([ADR 0007](docs/adr/0007-uso-del-servidor-fisico.md)) |

---

## Stack

Java 21 · Spring Boot 4.1 · Maven · PostgreSQL · Angular 21 · arquitectura hexagonal modular

Las versiones de la especificación (Spring Boot 3, Angular 18) están fuera de soporte y se
corrigieron en el [ADR 0006](docs/adr/0006-versiones-vigentes-framework.md).

---

## Arranque

Requisitos: **JDK 21**, **Node 20+**, **Docker**.

```bash
docker compose up -d
```

```bash
cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=local
```

```bash
cd frontend && npm install && npm start
```

---

## Estructura

```
├── CLAUDE.md                    contexto operativo — leer primero en cada sesión
├── docker-compose.yml           PostgreSQL de desarrollo
├── .env.ejemplo                 plantilla de variables de entorno
├── docs/
│   ├── 00-contexto.md           estado, glosario, decisiones abiertas
│   ├── 01-estandares-codigo.md  SOLID, código limpio, nomenclatura, comentarios
│   ├── 02-arquitectura.md       módulos, capas, reglas de dependencia
│   ├── 03-configuracion.md      parametrización, secretos, banderas
│   ├── 04-frontend-y-componentes.md  tokens visuales y catálogo de componentes
│   ├── 05-testing.md            estrategia de pruebas y umbral del 80%
│   ├── 06-seguridad.md          ciberseguridad y datos personales
│   ├── 07-proceso.md            ramas, PRs, documentación, CI
│   ├── especificacion-maestra.md    fuente de verdad funcional
│   ├── adr/                     decisiones técnicas y su porqué
│   ├── procesos/                un documento por proceso implementado
│   └── handoff-disenio/         sistema visual «Azul rey» aprobado
├── backend/                     Spring Boot — hexagonal modular
└── frontend/                    Angular — catálogo de componentes y tokens
```

---

## Por dónde empezar

1. **[CLAUDE.md](CLAUDE.md)** — las reglas del proyecto y los ocho no negociables.
2. **[docs/00-contexto.md](docs/00-contexto.md)** — en qué punto está todo y qué falta decidir.
3. **[docs/especificacion-maestra.md](docs/especificacion-maestra.md)** — qué hay que construir.

---

## Documentos de diseño

Los archivos `.dc.html` de `docs/handoff-disenio/` son **referencias de diseño**, no código de
producción. Se recrean en Angular; no se copian. El sistema visual vigente es «Azul rey»,
documentado en [docs/04](docs/04-frontend-y-componentes.md) e implementado como tokens en
`frontend/src/app/disenio/_tokens.scss`.

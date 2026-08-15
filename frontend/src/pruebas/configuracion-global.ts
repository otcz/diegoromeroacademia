import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { beforeEach } from 'vitest';

/**
 * Configuración que reciben TODAS las pruebas de componente.
 *
 * <p>`<adr-boton>` dibuja los destinos internos con `routerLink`, y esa directiva inyecta
 * `ActivatedRoute`. Sin enrutador en el banco de pruebas, cualquier componente que contenga
 * un botón con enlace revienta al crearse — reventaron 42 de golpe al hacer el cambio.
 *
 * <p>Va aquí y no repetido en cada `.spec`: veinte archivos declarando el mismo proveedor es
 * justo la duplicación que la regla 11 evita en los componentes, y el día que haga falta otro
 * proveedor transversal habría que tocar los veinte.
 *
 * <p>La tabla de rutas va VACÍA a propósito. `RouterLink` solo necesita el enrutador para
 * calcular el `href`, no para resolver el destino, así que pasarle las rutas reales
 * dispararía las importaciones diferidas de cada pantalla en cada prueba sin comprobar nada
 * a cambio. Que los destinos existan lo verifica su propia prueba, contra `RUTAS_INTERNAS`.
 */
beforeEach(() => {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
});

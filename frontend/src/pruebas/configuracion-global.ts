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
 * <p>NO se pasan las rutas reales: dispararían las importaciones diferidas de cada pantalla
 * en cada prueba sin comprobar nada a cambio. Que los destinos existan lo verifica su propia
 * prueba, contra `RUTAS_INTERNAS`.
 *
 * <p>Pero tampoco va vacía. Con una tabla vacía, un clic que `RouterLink` intercepta lanza una
 * navegación que no resuelve, y su promesa se rechaza DESPUÉS de que la prueba termine y el
 * inyector se destruya: Vitest lo reporta como error no gestionado y advierte de que puede
 * producir falsos positivos. Un comodín que no lleva a ninguna parte deja que la navegación
 * termine en silencio, que es justo lo que estas pruebas necesitan — les importa si el clic
 * se interceptó, no a dónde fue.
 */
beforeEach(() => {
  TestBed.configureTestingModule({ providers: [provideRouter([{ path: '**', children: [] }])] });
});

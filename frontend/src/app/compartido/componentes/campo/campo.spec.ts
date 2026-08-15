import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { describe, expect, it } from 'vitest';
import { Campo } from './campo';

describe('Campo', () => {
  async function crear(control: FormControl, entradas: Record<string, unknown> = {}) {
    const fixture = TestBed.createComponent(Campo);
    fixture.componentRef.setInput('control', control);
    fixture.componentRef.setInput('etiqueta', 'Correo electrónico');
    for (const [clave, valor] of Object.entries(entradas)) {
      fixture.componentRef.setInput(clave, valor);
    }
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture;
  }

  async function refrescar(fixture: Awaited<ReturnType<typeof crear>>) {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('debe unir el rotulo con el control para que al pulsarlo enfoque el campo', async () => {
    const fixture = await crear(new FormControl(''));

    const rotulo: HTMLLabelElement = fixture.nativeElement.querySelector('label');
    const entrada: HTMLInputElement = fixture.nativeElement.querySelector('input');

    expect(rotulo.getAttribute('for')).toBe(entrada.id);
    expect(rotulo.textContent).toContain('Correo electrónico');
  });

  it('no debe mostrar error mientras el alumno no haya tocado el campo', async () => {
    const control = new FormControl('', Validators.required);
    const fixture = await crear(control);

    expect(control.invalid).toBe(true);
    expect(fixture.nativeElement.querySelector('.adr-campo__error')).toBeNull();
  });

  it('debe mostrar el error una vez tocado el campo', async () => {
    const control = new FormControl('', Validators.required);
    const fixture = await crear(control);

    control.markAsTouched();
    await refrescar(fixture);

    const error: HTMLElement = fixture.nativeElement.querySelector('.adr-campo__error');
    expect(error.textContent).toContain('obligatorio');
    expect(error.getAttribute('role')).toBe('alert');
  });

  it('debe traducir el error de correo y el de longitud minima', async () => {
    const correo = new FormControl('sinarroba', Validators.email);
    correo.markAsTouched();
    const conCorreo = await crear(correo);
    expect(conCorreo.nativeElement.querySelector('.adr-campo__error').textContent).toContain(
      'correo válido',
    );

    const clave = new FormControl('123', Validators.minLength(8));
    clave.markAsTouched();
    const conClave = await crear(clave);
    expect(conClave.nativeElement.querySelector('.adr-campo__error').textContent).toContain(
      'al menos 8',
    );
  });

  it('debe permitir un mensaje propio del formulario sobre el de por defecto', async () => {
    const control = new FormControl('', Validators.required);
    control.markAsTouched();
    const fixture = await crear(control, { mensajes: { required: 'Necesitamos tu correo' } });

    expect(fixture.nativeElement.querySelector('.adr-campo__error').textContent).toContain(
      'Necesitamos tu correo',
    );
  });

  it('debe anunciar el estado invalido y apuntar al mensaje de error', async () => {
    const control = new FormControl('', Validators.required);
    const fixture = await crear(control);
    const entrada: HTMLInputElement = fixture.nativeElement.querySelector('input');

    expect(entrada.getAttribute('aria-invalid')).toBe('false');

    control.markAsTouched();
    await refrescar(fixture);

    const error: HTMLElement = fixture.nativeElement.querySelector('.adr-campo__error');
    expect(entrada.getAttribute('aria-invalid')).toBe('true');
    expect(entrada.getAttribute('aria-describedby')).toBe(error.id);
  });

  it('debe mostrar el texto de ayuda cuando no hay error', async () => {
    const fixture = await crear(new FormControl(''), { ayuda: 'Usaremos este correo para todo' });

    expect(fixture.nativeElement.querySelector('.adr-campo__ayuda').textContent).toContain(
      'Usaremos este correo',
    );
  });

  it('debe reenviar el tipo y el autocompletado al control nativo', async () => {
    const fixture = await crear(new FormControl(''), {
      tipo: 'password',
      autocompletado: 'current-password',
    });

    const entrada: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(entrada.type).toBe('password');
    expect(entrada.getAttribute('autocomplete')).toBe('current-password');
  });

  it('debe mostrar un mensaje generico ante un error sin traduccion conocida', async () => {
    const control = new FormControl('x', () => ({ afinacionInvalida: true }));
    control.markAsTouched();
    const fixture = await crear(control);

    expect(fixture.nativeElement.querySelector('.adr-campo__error').textContent).toContain(
      'no es válido',
    );
  });
});

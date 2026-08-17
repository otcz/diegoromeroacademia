import { describe, expect, it } from 'vitest';
import { formatearDuracion, formatearMinutos, formatearPesos, iniciales } from './formato';

describe('formatearPesos', () => {
  it('debe convertir centavos a pesos con separador de miles', () => {
    // 5.990.000 centavos son $59.900. El precio del plan Intermedio del handoff.
    expect(formatearPesos(5_990_000)).toBe('$59.900');
  });

  it('debe redondear y NO arrastrar decimales', () => {
    // En pesos colombianos no se cobran centavos: «$59.900,00» en cada tarjeta es ruido.
    expect(formatearPesos(3_490_050)).toBe('$34.901');
    expect(formatearPesos(0)).toBe('$0');
  });

  it('debe usar el punto como separador de miles, como en Colombia', () => {
    // Con la localizacion del navegador, un alumno en Espana veria otro separador y el
    // numero dejaria de coincidir con lo que cobra la pasarela.
    expect(formatearPesos(485_000_000)).toBe('$4.850.000');
  });
});

describe('formatearDuracion', () => {
  it('debe rellenar los segundos a dos digitos', () => {
    // Sin el relleno la barra salta de ancho en cada tic: «7:9» y luego «7:10».
    expect(formatearDuracion(429)).toBe('7:09');
    expect(formatearDuracion(430)).toBe('7:10');
  });

  it('debe pasar a horas cuando corresponde', () => {
    expect(formatearDuracion(3_725)).toBe('1:02:05');
  });

  it('debe tratar el cero y los negativos como cero', () => {
    // Un tiempo negativo llega si alguien retrocede al principio: no puede dibujar «-1:-5».
    expect(formatearDuracion(0)).toBe('0:00');
    expect(formatearDuracion(-12)).toBe('0:00');
  });
});

describe('formatearMinutos', () => {
  it('debe redondear al minuto', () => {
    expect(formatearMinutos(2_520)).toBe('42 min');
    expect(formatearMinutos(500)).toBe('8 min');
  });
});

describe('iniciales', () => {
  it('debe tomar la primera letra del nombre y del apellido', () => {
    expect(iniciales('Andrés Villa Restrepo')).toBe('AV');
  });

  it('debe funcionar con una sola palabra', () => {
    expect(iniciales('Diego')).toBe('D');
  });

  it('debe devolver cadena vacia cuando no hay nombre', () => {
    // Pasa de verdad: un producto sin nombre en el catalogo no puede reventar el carrito.
    expect(iniciales('   ')).toBe('');
    expect(iniciales('')).toBe('');
  });

  it('debe ignorar los espacios de sobra', () => {
    expect(iniciales('  Hohner   Corona  ')).toBe('HC');
  });
});

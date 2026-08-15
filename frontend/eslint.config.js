// @ts-check
// Reglas de ESLint de la Academia Diego Romero.
// Hace cumplir docs/01-estandares-codigo.md §8 y §1.
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = defineConfig([
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      // Prefijo de marca: todo componente y directiva del proyecto es adr-*.
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'adr', style: 'camelCase' },
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'adr', style: 'kebab-case' },
      ],

      // docs/01 §8: `any` esta prohibido. Si no se conoce el tipo se usa `unknown`
      // y se estrecha, para que el compilador siga atrapando los errores.
      '@typescript-eslint/no-explicit-any': 'error',

      // Rendimiento por defecto, no como optimizacion posterior (regla 13).
      '@angular-eslint/prefer-on-push-component-change-detection': 'error',

      // docs/01 §10: el registro va por un servicio, no por consola.
      'no-console': ['error', { allow: ['warn', 'error'] }],

      // Limites de docs/01 §1 trasladados a TypeScript.
      'max-lines': ['error', { max: 400, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 40, skipBlankLines: true, skipComments: true }],
      'max-params': ['error', 4],
      'max-depth': ['error', 3],
      complexity: ['error', 10],

      // Inmutabilidad por defecto (docs/01 §3).
      'prefer-const': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      eqeqeq: ['error', 'always'],
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      // Un test descriptivo puede pasar de 40 lineas sin que sea un problema.
      'max-lines-per-function': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [angular.configs.templateRecommended, angular.configs.templateAccessibility],
    rules: {
      // Se usa @if / @for en vez de las directivas estructurales antiguas.
      '@angular-eslint/template/prefer-control-flow': 'error',

      // NOTA: no se activa `no-call-expression`. Leer un signal es sintacticamente una
      // llamada, asi que la regla marcaria `nombre()` y `tamanio()` en cada plantilla y
      // seria incompatible con el modelo de Angular moderno. El principio de docs/01 §8
      // —cero logica en plantillas, lo calculado va en un computed()— sigue vigente y se
      // verifica en revision de codigo, que es donde se puede distinguir una lectura de
      // signal de una llamada costosa.
    },
  },
]);

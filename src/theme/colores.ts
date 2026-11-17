/**
 * PALETA DE COLORES DE LA APP
 */
export const colores = {
  // Fondo base (azul noche casi negro)
  fondo: '#060B18',
  fondoSecundario: '#0B1530',

  // Acentos principales
  blanco: '#FFFFFF',
  azul: '#3B82F6',
  azulClaro: '#60A5FA',
  verde: '#22C55E',
  verdeClaro: '#4ADE80',
  dorado: '#F5C451',
  doradoOscuro: '#D4A12A',

  // Textos
  texto: '#F8FAFC',
  textoSecundario: 'rgba(248, 250, 252, 0.68)',
  textoTenue: 'rgba(248, 250, 252, 0.45)',

  // Efecto vidrio
  vidrio: 'rgba(255, 255, 255, 0.08)',
  vidrioFuerte: 'rgba(255, 255, 255, 0.14)',
  bordeVidrio: 'rgba(255, 255, 255, 0.18)',
} as const;

/** Intensidad del desenfoque (blur) de las tarjetas de vidrio: 0 a 100 */
export const intensidadBlur = 30;

/** Radios de borde reutilizables */
export const radios = {
  pequeno: 12,
  medio: 20,
  grande: 28,
} as const;

import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

import { colores } from '../theme/colores';

type NombreIcono = ComponentProps<typeof Ionicons>['name'];

export type Nivel = {
  /** Nombre del archivo de la pantalla dentro de src/app (sin .tsx) */
  ruta: 'nave' | 'cargando-partida' | 'mapa' | 'golpe-critico' | 'plataformas' | 'terremoto';
  numero: number;
  nombre: string;
  mision: string;
  icono: NombreIcono;
  color: string;
  /** Dificultad de 1 a 3 (estrellas que se muestran en el selector) */
  dificultad: 1 | 2 | 3;
};

/**
 * NIVELES DE LA ARENA
 * 
 */
export const niveles: Nivel[] = [
  {
    ruta: 'nave',
    numero: 1,
    nombre: 'Piloto de nave',
    mision: 'Toma el control y pilota la nave por el sector. Se inclina hacia donde viras.',
    icono: 'rocket',
    color: colores.azul,
    dificultad: 1,
  },
  {
    ruta: 'cargando-partida',
    numero: 2,
    nombre: 'Cargando partida',
    mision: 'El mundo se está generando. Aguanta mientras cargan los enemigos y el mapa.',
    icono: 'hourglass',
    color: colores.verde,
    dificultad: 1,
  },
  {
    ruta: 'mapa',
    numero: 3,
    nombre: 'Explorador de mapas',
    mision: 'Acerca, aleja, gira y recorre el mapa del mundo con tus dedos.',
    icono: 'map',
    color: colores.dorado,
    dificultad: 2,
  },
  {
    ruta: 'golpe-critico',
    numero: 4,
    nombre: 'Golpe crítico',
    mision: 'Carga el núcleo de poder y suéltalo para lanzar un golpe crítico.',
    icono: 'flash',
    color: colores.azulClaro,
    dificultad: 2,
  },
  {
    ruta: 'plataformas',
    numero: 5,
    nombre: 'Elige tu plataforma',
    mision: 'Recorre las consolas y descubre el juegazo que define a cada una.',
    icono: 'game-controller',
    color: colores.verdeClaro,
    dificultad: 3,
  },
  {
    ruta: 'terremoto',
    numero: 6,
    nombre: 'Terremoto',
    mision: 'Agita tu celular para despertar a la gema ancestral.',
    icono: 'diamond',
    color: colores.dorado,
    dificultad: 3,
  },
];

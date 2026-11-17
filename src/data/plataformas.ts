import type { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';

type NombreIcono = ComponentProps<typeof Ionicons>['name'];

export type Plataforma = {
  nombre: string;
  /** Texto pequeño sobre el nombre (empresa, consola de la foto, año) */
  detalle: string;
  /** Foto de la consola (URL). Si es null o no carga, se muestra el ícono. */
  foto: string | null;
  icono: NombreIcono;
  juegazo: string;
  porQue: string;
  /** Degradado del FONDO de la pantalla cuando esta tarjeta está al centro */
  degradado: [string, string, string];
  /** Color de acento: brillo de la tarjeta, puntos indicadores, etiquetas */
  acento: string;
};


const WIKIMEDIA = 'https://upload.wikimedia.org/wikipedia/commons/thumb';

/**
 * TARJETAS DE "ELIGE TU PLATAFORMA" (NIVEL 5)
 */
export const plataformas: Plataforma[] = [
  {
    nombre: 'Xbox',
    detalle: 'MICROSOFT · XBOX ONE X',
    foto: `${WIKIMEDIA}/8/81/Microsoft-Xbox-One-X-Console-Set.jpg/960px-Microsoft-Xbox-One-X-Console-Set.jpg`,
    icono: 'game-controller',
    juegazo: 'Gears of War',
    porQue:
      'Acción pura en tercera persona: coberturas, el rifle Lancer con motosierra y una guerra brutal contra la Horda Locust. Definió lo que es un shooter en Xbox.',
    degradado: ['#1DB954', '#107C10', '#04240A'],
    acento: '#4ADE80',
  },
  {
    nombre: 'PlayStation',
    detalle: 'SONY · PLAYSTATION 4 PRO',
    foto: `${WIKIMEDIA}/8/86/Sony-PlayStation4-Pro-Console-FL.png/960px-Sony-PlayStation4-Pro-Console-FL.png`,
    icono: 'disc',
    juegazo: 'The Last of Us Part I',
    porQue:
      'Joel y Ellie cruzando un mundo destruido. Tensión en cada esquina, personajes que se sienten reales y una historia que no se olvida nunca.',
    degradado: ['#1E7BFF', '#0046D5', '#00134D'],
    acento: '#5B9BFF',
  },
  {
    nombre: 'Steam',
    detalle: 'VALVE · STEAM DECK',
    foto: `${WIKIMEDIA}/5/5d/Steam_Deck_%28front%29.png/960px-Steam_Deck_%28front%29.png`,
    icono: 'desktop',
    juegazo: 'Sekiro: Shadows Die Twice',
    porQue:
      'Combate de espadas al milímetro: bloqueos perfectos, jefes que te ponen a prueba una y otra vez, y la satisfacción enorme de por fin vencerlos.',
    degradado: ['#8B5CF6', '#5B21B6', '#1E0B3D'],
    acento: '#A78BFA',
  },
  {
    nombre: 'Nintendo Switch',
    detalle: 'NINTENDO · SWITCH',
    foto: `${WIKIMEDIA}/7/76/Nintendo-Switch-Console-Docked-wJoyConRB.jpg/960px-Nintendo-Switch-Console-Docked-wJoyConRB.jpg`,
    icono: 'tablet-landscape',
    juegazo: 'Zelda: Ocarina of Time',
    porQue:
      'Un clásico de leyenda: Link viajando en el tiempo por Hyrule, templos llenos de acertijos y melodías de ocarina que se quedan para siempre.',
    degradado: ['#FF3B47', '#E60012', '#3A0006'],
    acento: '#FF6B74',
  },
  {
    nombre: 'Epic Games',
    detalle: 'TIENDA DE PC',
    foto: null,
    icono: 'rocket',
    juegazo: 'Rocket League',
    porQue:
      'Fútbol con carros a propulsión. Fácil de aprender, difícil de dominar, y cada partido de cinco minutos se siente como una final.',
    degradado: ['#3A3A3A', '#1A1A1A', '#000000'],
    acento: '#F5C451',
  },
];

/** Encabezado para descargar las fotos (Wikimedia pide identificar la app) */
export const encabezadosFoto = {
  'User-Agent': 'ArenaGamer/1.0 (app educativa React Native)',
};

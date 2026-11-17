# Arena Gamer

Aplicación móvil de retos gamer en **español**. Seis niveles, cada uno con su propio desafío interactivo, más un recorrido por las grandes plataformas de videojuegos y el juegazo que define a cada una.

Diseño oscuro con efecto vidrio (*glassmorphism*) en blanco, azul, verde y dorado.

## Niveles

| Nivel | Nombre | De qué se trata | Qué hay detrás |
|---|---|---|---|
| 1 | **Piloto de nave** | Pilota la nave por el sector. Se inclina hacia el lado al que viras. | Arrastrar y soltar con rotación según la dirección del movimiento |
| 2 | **Cargando partida** | Pantalla de carga de videojuego con mensajes de progreso y consejos. | Spinner infinito que arranca al montar + barra de progreso animada |
| 3 | **Explorador de mapas** | Recorre el mapa del mundo: acércalo, aléjalo, gíralo y muévelo. | Gestos multitáctiles simultáneos (pellizcar, rotar, arrastrar) |
| 4 | **Golpe crítico** | Carga el núcleo de poder y suéltalo para lanzar el golpe. | Se encoge al presionar y vuelve con animación de rebote (spring) |
| 5 | **Elige tu plataforma** | Xbox, PlayStation, Steam, Nintendo Switch y Epic Games, cada una con su juegazo. | Carrusel con escala, rotación 3D, parallax y fondo con transición de degradado |
| 6 | **Terremoto** | Agita el celular para despertar a la gema ancestral. | Sensor acelerómetro + animación de sacudida + vibración |

La navegación entre niveles se hace con un **menú lateral (Drawer)**, con la **flecha de volver** del encabezado o con el **botón Atrás** del celular.

## Salón de juegazos

| Plataforma | Juegazo |
|---|---|
| Xbox | Gears of War |
| PlayStation | The Last of Us Part I |
| Steam | Sekiro: Shadows Die Twice |
| Nintendo Switch | The Legend of Zelda: Ocarina of Time |
| Epic Games | Rocket League |

## Tecnologías

- [Expo](https://expo.dev) (SDK 58) + [Expo Router](https://docs.expo.dev/router/introduction/) con Drawer
- [React Native Reanimated 4](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Gesture Handler 3](https://docs.swmansion.com/react-native-gesture-handler/)
- `expo-sensors` (acelerómetro), `expo-haptics` (vibración)
- `expo-blur` y `expo-linear-gradient` (efecto vidrio y degradados)
- TypeScript

## Cómo ejecutar

Requisitos: [Node.js](https://nodejs.org) LTS y la app **Expo Go** en el celular (Android o iOS).

```bash
git clone https://github.com/<tu-usuario>/arena-gamer.git
cd arena-gamer
npm install
npx expo start
```

Escanea el código QR con Expo Go (Android) o con la cámara (iOS). El celular y el computador deben estar en la misma red Wi-Fi. Si no lo están, usa `npx expo start --tunnel`.

> El nivel Terremoto necesita un celular real. En un emulador puedes usar el botón **"Simular terremoto"**.
> Las fotos de las consolas se cargan desde internet.

## Estructura

```
src/
├── app/                      ← cada archivo es una pantalla
│   ├── _layout.tsx           ← menú lateral, flecha de volver y encabezado
│   ├── index.tsx             ← Selector de niveles (inicio)
│   ├── nave.tsx              ← Nivel 1
│   ├── cargando-partida.tsx  ← Nivel 2
│   ├── mapa.tsx              ← Nivel 3
│   ├── golpe-critico.tsx     ← Nivel 4
│   ├── plataformas.tsx       ← Nivel 5
│   └── terremoto.tsx         ← Nivel 6
├── components/               ← piezas reutilizables (vidrio, fondo, menú…)
├── data/
│   ├── niveles.ts            ← nombres, misiones e íconos de los niveles
│   └── plataformas.ts        ← consolas, fotos y juegazos
└── theme/
    └── colores.ts            ← paleta de colores de toda la app
assets/images/mapa-mundo.png  ← imagen del Nivel 3
```



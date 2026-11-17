import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  GestureDetector,
  usePanGesture,
  usePinchGesture,
  useRotationGesture,
  useSimultaneousGestures,
  useTapGesture,
} from 'react-native-gesture-handler';
import Animated, {
  clamp,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { EncabezadoPantalla } from '../components/EncabezadoPantalla';
import { Pantalla } from '../components/Pantalla';
import { colores } from '../theme/colores';

/* ─────────── AJUSTES DEL NIVEL 3 ─────────── */
// Para cambiar el mapa, reemplaza este archivo (o cambia la ruta):
const IMAGEN = require('../../assets/images/mapa-mundo.png');
const ESCALA_MINIMA = 0.5;
const ESCALA_MAXIMA = 4;
const TAMANO_IMAGEN = 280;
/* ─────────────────────────────────────────────── */

/**
 * NIVEL 3 — EXPLORADOR DE MAPAS (gestos multitáctiles)
 */
export default function ExploradorDeMapas() {
  // Valores actuales
  const escala = useSharedValue(1);
  const rotacion = useSharedValue(0); // radianes
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  // Valores guardados al terminar cada gesto
  const escalaGuardada = useSharedValue(1);
  const rotacionGuardada = useSharedValue(0);
  const xGuardada = useSharedValue(0);
  const yGuardada = useSharedValue(0);

  const [lectura, setLectura] = useState({ zoom: 100, grados: 0 });

  const pellizco = usePinchGesture({
    onUpdate: (e) => {
      'worklet';
      escala.value = clamp(escalaGuardada.value * e.scale, ESCALA_MINIMA, ESCALA_MAXIMA);
    },
    onDeactivate: () => {
      'worklet';
      escalaGuardada.value = escala.value;
    },
  });

  const giro = useRotationGesture({
    onUpdate: (e) => {
      'worklet';
      rotacion.value = rotacionGuardada.value + e.rotation;
    },
    onDeactivate: () => {
      'worklet';
      rotacionGuardada.value = rotacion.value;
    },
  });

  const arrastre = usePanGesture({
    onUpdate: (e) => {
      'worklet';
      x.value = xGuardada.value + e.translationX;
      y.value = yGuardada.value + e.translationY;
    },
    onDeactivate: () => {
      'worklet';
      xGuardada.value = x.value;
      yGuardada.value = y.value;
    },
  });

  const restablecerWorklet = () => {
    'worklet';
    escala.value = withSpring(1);
    rotacion.value = withSpring(0);
    x.value = withSpring(0);
    y.value = withSpring(0);
    escalaGuardada.value = 1;
    rotacionGuardada.value = 0;
    xGuardada.value = 0;
    yGuardada.value = 0;
  };

  const dobleToque = useTapGesture({
    numberOfTaps: 2,
    onActivate: () => {
      'worklet';
      restablecerWorklet();
    },
  });

  const gestos = useSimultaneousGestures(pellizco, giro, arrastre, dobleToque);

  const estiloImagen = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: escala.value },
      { rotate: `${rotacion.value}rad` },
    ],
  }));

  // Lectura en vivo de zoom y rotación
  useAnimatedReaction(
    () => ({
      zoom: Math.round(escala.value * 100),
      grados: Math.round((rotacion.value * 180) / Math.PI),
    }),
    (actual, previo) => {
      if (!previo || actual.zoom !== previo.zoom || actual.grados !== previo.grados) {
        scheduleOnRN(setLectura, actual);
      }
    },
  );

  return (
    <Pantalla>
      <EncabezadoPantalla
        titulo="Explorador de mapas"
        instrucciones="Pellizca con dos dedos para acercar o alejar el mapa, gíralo para orientarte y arrástralo para recorrerlo. Doble toque para centrarlo."
      />

      <View style={styles.chips}>
        <View style={styles.chip}>
          <Ionicons name="expand" size={14} color={colores.azulClaro} />
          <Text style={styles.textoChip}>Zoom {lectura.zoom}%</Text>
        </View>
        <View style={styles.chip}>
          <Ionicons name="refresh" size={14} color={colores.verdeClaro} />
          <Text style={styles.textoChip}>Rotación {lectura.grados}°</Text>
        </View>
      </View>

      <GestureDetector gesture={gestos}>
        <View style={styles.area}>
          <Animated.Image source={IMAGEN} style={[styles.imagen, estiloImagen]} />
        </View>
      </GestureDetector>

      <Pressable style={styles.boton} onPress={() => restablecerWorklet()}>
        <Ionicons name="scan" size={18} color={colores.fondo} />
        <Text style={styles.textoBoton}>Centrar mapa</Text>
      </Pressable>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colores.vidrio,
    borderWidth: 1,
    borderColor: colores.bordeVidrio,
  },
  textoChip: {
    color: colores.texto,
    fontSize: 13,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  area: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imagen: {
    width: TAMANO_IMAGEN,
    height: TAMANO_IMAGEN,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(245, 196, 81, 0.6)',
  },
  boton: {
    flexDirection: 'row',
    alignSelf: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colores.dorado,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
    marginBottom: 28,
  },
  textoBoton: {
    color: colores.fondo,
    fontWeight: '800',
    fontSize: 15,
  },
});

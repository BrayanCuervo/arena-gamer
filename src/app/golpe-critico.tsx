import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureDetector, useTapGesture } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { EncabezadoPantalla } from '../components/EncabezadoPantalla';
import { Pantalla } from '../components/Pantalla';
import { TarjetaVidrio } from '../components/TarjetaVidrio';
import { colores } from '../theme/colores';

/* ─────────── AJUSTES DEL NIVEL 4 ─────────── */
const TAMANO_FIGURA = 170;
const ESCALA_PRESIONADO = 0.78; // tamaño al presionar (0.78 = 78 %)
// Rebote al soltar: menos "damping" = rebota más veces
const REBOTE = { damping: 5, stiffness: 260, mass: 0.9 };
/* ─────────────────────────────────────────────── */

function vibrar() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
}

/**
 * NIVEL 4 — GOLPE CRÍTICO (animación de rebote)
 */
export default function GolpeCritico() {
  const escala = useSharedValue(1);
  const onda = useSharedValue(0);
  const [toques, setToques] = useState(0);

  const sumarToque = () => setToques((t) => t + 1);

  const gesto = useTapGesture({
    maxDuration: 60_000, // permite mantener presionado sin cancelar
    maxDistance: 10_000,
    onBegin: () => {
      'worklet';
      // Presionado: se encoge
      escala.value = withTiming(ESCALA_PRESIONADO, { duration: 140 });
    },
    onFinalize: () => {
      'worklet';
      // Soltado: vuelve con rebote + onda expansiva + vibración
      escala.value = withSpring(1, REBOTE);
      onda.value = withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: 650 }));
      scheduleOnRN(vibrar);
      scheduleOnRN(sumarToque);
    },
  });

  const estiloFigura = useAnimatedStyle(() => ({
    transform: [{ scale: escala.value }],
  }));

  // Texto "¡CRÍTICO!" que aparece, sube y se desvanece al soltar
  const estiloCritico = useAnimatedStyle(() => ({
    opacity: interpolate(onda.value, [0, 0.15, 0.7, 1], [0, 1, 1, 0]),
    transform: [
      { translateY: interpolate(onda.value, [0, 1], [0, -70]) },
      { scale: interpolate(onda.value, [0, 0.15, 1], [0.6, 1.15, 1]) },
    ],
  }));

  const estiloOnda = useAnimatedStyle(() => ({
    opacity: interpolate(onda.value, [0, 0.1, 1], [0, 0.6, 0]),
    transform: [{ scale: interpolate(onda.value, [0, 1], [0.9, 1.8]) }],
  }));

  return (
    <Pantalla>
      <EncabezadoPantalla
        titulo="Golpe crítico"
        instrucciones="Mantén presionado el núcleo de poder para cargarlo (se comprime). Suéltalo para lanzar el golpe: rebota con toda su energía."
      />

      <View style={styles.centro}>
        <View style={styles.contenedorFigura}>
          <Animated.View style={[styles.onda, estiloOnda]} />
          <Animated.Text style={[styles.critico, estiloCritico]} pointerEvents="none">
            ¡CRÍTICO!
          </Animated.Text>
          <GestureDetector gesture={gesto}>
            <Animated.View style={[styles.figura, estiloFigura]}>
              <LinearGradient
                colors={[colores.dorado, colores.doradoOscuro]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.degradado}
              >
                <Ionicons name="flash" size={60} color={colores.fondo} />
              </LinearGradient>
            </Animated.View>
          </GestureDetector>
        </View>

        <TarjetaVidrio style={styles.contador}>
          <Text style={styles.etiqueta}>Golpes críticos</Text>
          <Text style={styles.numero}>x{toques}</Text>
        </TarjetaVidrio>
      </View>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 60,
  },
  contenedorFigura: {
    width: TAMANO_FIGURA,
    height: TAMANO_FIGURA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  critico: {
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
    color: colores.dorado,
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 2,
    textShadowColor: 'rgba(245,196,81,0.6)',
    textShadowRadius: 16,
    zIndex: 2,
  },
  onda: {
    position: 'absolute',
    width: TAMANO_FIGURA,
    height: TAMANO_FIGURA,
    borderRadius: TAMANO_FIGURA / 2,
    borderWidth: 3,
    borderColor: colores.dorado,
  },
  figura: {
    width: TAMANO_FIGURA,
    height: TAMANO_FIGURA,
    borderRadius: TAMANO_FIGURA / 2,
    shadowColor: colores.dorado,
    shadowOpacity: 0.5,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 14,
  },
  degradado: {
    flex: 1,
    borderRadius: TAMANO_FIGURA / 2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  contador: {
    paddingHorizontal: 36,
    paddingVertical: 14,
    alignItems: 'center',
  },
  etiqueta: {
    color: colores.textoSecundario,
    fontSize: 13,
    fontWeight: '600',
  },
  numero: {
    color: colores.texto,
    fontSize: 32,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
});

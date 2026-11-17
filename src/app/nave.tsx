import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { EncabezadoPantalla } from '../components/EncabezadoPantalla';
import { Pantalla } from '../components/Pantalla';
import { colores } from '../theme/colores';

/* ─────────── AJUSTES DEL NIVEL 1 ─────────── */
const TAMANO_FIGURA = 120; // tamaño de la nave en px
const ROTACION_MAXIMA = 35; // grados máximos de inclinación
const SENSIBILIDAD = 45; // más alto = rota menos con la misma velocidad
const RESORTE = { damping: 14, stiffness: 140 }; // "elasticidad" del regreso
/* ─────────────────────────────────────────────── */

/**
 * NIVEL 1 — PILOTO DE NAVE (arrastrar y rotar)
 */
export default function PilotoDeNave() {
  // Posición actual y posición al iniciar el arrastre
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const inicioX = useSharedValue(0);
  const inicioY = useSharedValue(0);
  const rotacion = useSharedValue(0);
  const arrastrando = useSharedValue(0);

  // Límites del área (se calculan al medir el contenedor)
  const limiteX = useSharedValue(0);
  const limiteY = useSharedValue(0);

  const alMedir = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    limiteX.value = (width - TAMANO_FIGURA) / 2;
    limiteY.value = (height - TAMANO_FIGURA) / 2;
  };

  const gestoArrastre = usePanGesture({
    onActivate: () => {
      'worklet';
      inicioX.value = x.value;
      inicioY.value = y.value;
      arrastrando.value = withSpring(1);
    },
    onUpdate: (e) => {
      'worklet';
      x.value = clamp(inicioX.value + e.translationX, -limiteX.value, limiteX.value);
      y.value = clamp(inicioY.value + e.translationY, -limiteY.value, limiteY.value);
      // La velocidad horizontal decide hacia dónde y cuánto rota
      const objetivo = clamp(e.velocityX / SENSIBILIDAD, -ROTACION_MAXIMA, ROTACION_MAXIMA);
      rotacion.value = withSpring(objetivo, RESORTE);
    },
    onFinalize: () => {
      'worklet';
      rotacion.value = withSpring(0, RESORTE);
      arrastrando.value = withSpring(0);
    },
  });

  const estiloFigura = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { rotate: `${rotacion.value}deg` },
      { scale: interpolate(arrastrando.value, [0, 1], [1, 1.08]) },
    ],
    shadowOpacity: interpolate(arrastrando.value, [0, 1], [0.3, 0.7]),
  }));

  // Indicadores de dirección que se iluminan según la rotación
  const estiloIzquierda = useAnimatedStyle(() => ({
    opacity: interpolate(rotacion.value, [-ROTACION_MAXIMA, -3, 0], [1, 0.25, 0.25], 'clamp'),
  }));
  const estiloDerecha = useAnimatedStyle(() => ({
    opacity: interpolate(rotacion.value, [0, 3, ROTACION_MAXIMA], [0.25, 0.25, 1], 'clamp'),
  }));

  const reiniciar = () => {
    x.value = withSpring(0, RESORTE);
    y.value = withSpring(0, RESORTE);
    rotacion.value = withSpring(0, RESORTE);
  };

  return (
    <Pantalla>
      <EncabezadoPantalla
        titulo="Piloto de nave"
        instrucciones="Arrastra la nave por el sector. Al virar a la izquierda se inclina a la izquierda; al virar a la derecha, a la derecha."
      />

      <View style={styles.indicadores}>
        <Animated.View style={[styles.indicador, estiloIzquierda]}>
          <Ionicons name="arrow-back" size={16} color={colores.azulClaro} />
          <Text style={[styles.textoIndicador, { color: colores.azulClaro }]}>Virando a la izquierda</Text>
        </Animated.View>
        <Animated.View style={[styles.indicador, estiloDerecha]}>
          <Text style={[styles.textoIndicador, { color: colores.verdeClaro }]}>Virando a la derecha</Text>
          <Ionicons name="arrow-forward" size={16} color={colores.verdeClaro} />
        </Animated.View>
      </View>

      <View style={styles.area} onLayout={alMedir}>
        {/* Decoración del sector */}
        <Text style={styles.sector}>SECTOR 7-G</Text>
        <Ionicons name="planet" size={46} color="rgba(96,165,250,0.25)" style={styles.planeta} />
        <Ionicons name="ellipse" size={14} color="rgba(245,196,81,0.35)" style={styles.asteroide1} />
        <Ionicons name="ellipse" size={22} color="rgba(255,255,255,0.12)" style={styles.asteroide2} />
        <Ionicons name="star" size={10} color="rgba(255,255,255,0.35)" style={styles.estrella1} />
        <Ionicons name="star" size={8} color="rgba(255,255,255,0.3)" style={styles.estrella2} />

        <GestureDetector gesture={gestoArrastre}>
          <Animated.View style={[styles.figura, estiloFigura]}>
            <LinearGradient
              colors={[colores.azul, colores.verde]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.degradado}
            >
              {/* Ícono de cohete girado para que apunte hacia arriba */}
              <Ionicons name="rocket" size={48} color={colores.blanco} style={{ transform: [{ rotate: '-45deg' }] }} />
            </LinearGradient>
          </Animated.View>
        </GestureDetector>
      </View>

      <Pressable style={styles.boton} onPress={reiniciar}>
        <Ionicons name="refresh" size={18} color={colores.fondo} />
        <Text style={styles.textoBoton}>Volver a la base</Text>
      </Pressable>
    </Pantalla>
  );
}

const styles = StyleSheet.create({
  indicadores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  indicador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  textoIndicador: {
    fontWeight: '700',
    fontSize: 14,
  },
  area: {
    flex: 1,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colores.bordeVidrio,
  },
  sector: {
    position: 'absolute',
    top: 14,
    left: 16,
    color: colores.textoTenue,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  planeta: { position: 'absolute', top: 40, right: 30 },
  asteroide1: { position: 'absolute', bottom: 60, left: 40 },
  asteroide2: { position: 'absolute', bottom: 120, right: 60 },
  estrella1: { position: 'absolute', top: 120, left: 70 },
  estrella2: { position: 'absolute', bottom: 40, right: 120 },
  figura: {
    width: TAMANO_FIGURA,
    height: TAMANO_FIGURA,
    borderRadius: 28,
    shadowColor: colores.azul,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 24,
    elevation: 12,
  },
  degradado: {
    flex: 1,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
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

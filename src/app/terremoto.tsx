import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Accelerometer } from 'expo-sensors';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { EncabezadoPantalla } from '../components/EncabezadoPantalla';
import { Pantalla } from '../components/Pantalla';
import { TarjetaVidrio } from '../components/TarjetaVidrio';
import { colores } from '../theme/colores';

/* ─────────── AJUSTES DEL NIVEL 6 ─────────── */
const UMBRAL_SACUDIDA = 1.6; // fuerza mínima (en "g") para contar como sacudida. Más bajo = más sensible
const ESPERA_ENTRE_SACUDIDAS = 900; // ms mínimos entre una sacudida y otra
const INTERVALO_SENSOR = 60; // cada cuántos ms se lee el acelerómetro
const TAMANO_FIGURA = 150;
/* ─────────────────────────────────────────────── */

type Lectura = { x: number; y: number; z: number };

/**
 * NIVEL 6 — TERREMOTO (acelerómetro)
 */
export default function Terremoto() {
  const enfocada = useIsFocused(); // solo escuchamos el sensor si la pantalla está visible
  const [disponible, setDisponible] = useState<boolean | null>(null);
  const [lectura, setLectura] = useState<Lectura>({ x: 0, y: 0, z: 0 });
  const [sacudidas, setSacudidas] = useState(0);
  const ultimaSacudida = useRef(0);

  const desplazamiento = useSharedValue(0);
  const giro = useSharedValue(0);
  const energia = useSharedValue(0);

  /** Animación de temblor de la figura */
  const sacudir = useCallback(() => {
    const t = { duration: 55, easing: Easing.linear };
    desplazamiento.value = withSequence(
      withTiming(-22, t),
      withTiming(22, t),
      withTiming(-18, t),
      withTiming(18, t),
      withTiming(-10, t),
      withTiming(10, t),
      withSpring(0, { damping: 6, stiffness: 300 }),
    );
    giro.value = withSequence(
      withTiming(-12, t),
      withTiming(12, t),
      withTiming(-9, t),
      withTiming(9, t),
      withTiming(-4, t),
      withSpring(0, { damping: 6, stiffness: 300 }),
    );
    energia.value = withSequence(withTiming(1, { duration: 80 }), withTiming(0, { duration: 700 }));
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setSacudidas((s) => s + 1);
  }, [desplazamiento, giro, energia]);

  useEffect(() => {
    Accelerometer.isAvailableAsync().then(setDisponible);
  }, []);

  // Suscripción al acelerómetro (se limpia al salir de la pantalla)
  useEffect(() => {
    if (!enfocada || !disponible) return;

    Accelerometer.setUpdateInterval(INTERVALO_SENSOR);
    const suscripcion = Accelerometer.addListener(({ x, y, z }) => {
      setLectura({ x, y, z });
      // Fuerza total. En reposo vale ~1 g (la gravedad)
      const fuerza = Math.sqrt(x * x + y * y + z * z);
      const ahora = Date.now();
      if (fuerza > UMBRAL_SACUDIDA && ahora - ultimaSacudida.current > ESPERA_ENTRE_SACUDIDAS) {
        ultimaSacudida.current = ahora;
        sacudir();
      }
    });

    return () => suscripcion.remove();
  }, [enfocada, disponible, sacudir]);

  const estiloFigura = useAnimatedStyle(() => ({
    transform: [
      { translateX: desplazamiento.value },
      { rotate: `${giro.value}deg` },
      { scale: interpolate(energia.value, [0, 1], [1, 1.08]) },
    ],
  }));

  const estiloResplandor = useAnimatedStyle(() => ({
    opacity: interpolate(energia.value, [0, 1], [0.15, 0.8]),
    transform: [{ scale: interpolate(energia.value, [0, 1], [1, 1.35]) }],
  }));

  return (
    <Pantalla>
      <EncabezadoPantalla
        titulo="Terremoto"
        instrucciones="La gema ancestral duerme. Agita tu celular con fuerza para provocar un terremoto y despertarla."
      />

      <View style={styles.centro}>
        <View style={styles.contenedorFigura}>
          <Animated.View style={[styles.resplandor, estiloResplandor]} />
          <Animated.View style={[styles.figura, estiloFigura]}>
            <LinearGradient
              colors={[colores.dorado, colores.verde, colores.azul]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.degradado}
            >
              <Ionicons name="diamond" size={62} color={colores.blanco} />
            </LinearGradient>
          </Animated.View>
        </View>

        {disponible === false && (
          <Text style={styles.aviso}>
            Este dispositivo no tiene acelerómetro (por ejemplo, un emulador). Usa el botón para simular el terremoto.
          </Text>
        )}

        <TarjetaVidrio style={styles.tarjeta}>
          <Text style={styles.sismografo}>SISMÓGRAFO</Text>
          <View style={styles.fila}>
            <Dato etiqueta="X" valor={lectura.x} color={colores.azulClaro} />
            <Dato etiqueta="Y" valor={lectura.y} color={colores.verdeClaro} />
            <Dato etiqueta="Z" valor={lectura.z} color={colores.dorado} />
          </View>
          <View style={styles.separador} />
          <View style={styles.filaContador}>
            <Text style={styles.etiquetaContador}>Terremotos provocados</Text>
            <Text style={styles.contador}>{sacudidas}</Text>
          </View>
        </TarjetaVidrio>

        <Pressable style={styles.boton} onPress={sacudir}>
          <Ionicons name="pulse" size={18} color={colores.fondo} />
          <Text style={styles.textoBoton}>Simular terremoto</Text>
        </Pressable>
      </View>
    </Pantalla>
  );
}

function Dato({ etiqueta, valor, color }: { etiqueta: string; valor: number; color: string }) {
  return (
    <View style={styles.dato}>
      <Text style={[styles.etiquetaDato, { color }]}>{etiqueta}</Text>
      <Text style={styles.valorDato}>{valor.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingHorizontal: 24,
  },
  contenedorFigura: {
    width: TAMANO_FIGURA * 1.6,
    height: TAMANO_FIGURA * 1.6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resplandor: {
    position: 'absolute',
    width: TAMANO_FIGURA * 1.3,
    height: TAMANO_FIGURA * 1.3,
    borderRadius: TAMANO_FIGURA,
    backgroundColor: colores.verde,
  },
  figura: {
    width: TAMANO_FIGURA,
    height: TAMANO_FIGURA,
    borderRadius: 36,
  },
  degradado: {
    flex: 1,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  aviso: {
    color: colores.dorado,
    textAlign: 'center',
    fontSize: 13,
  },
  tarjeta: {
    width: '100%',
    padding: 18,
  },
  sismografo: {
    color: colores.textoTenue,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 10,
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dato: {
    alignItems: 'center',
    gap: 2,
  },
  etiquetaDato: {
    fontSize: 13,
    fontWeight: '800',
  },
  valorDato: {
    color: colores.texto,
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  separador: {
    height: 1,
    backgroundColor: colores.bordeVidrio,
    marginVertical: 14,
  },
  filaContador: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  etiquetaContador: {
    color: colores.textoSecundario,
    fontSize: 14,
    fontWeight: '600',
  },
  contador: {
    color: colores.texto,
    fontSize: 26,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colores.dorado,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 999,
  },
  textoBoton: {
    color: colores.fondo,
    fontWeight: '800',
    fontSize: 15,
  },
});

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { EncabezadoPantalla } from '../components/EncabezadoPantalla';
import { Pantalla } from '../components/Pantalla';
import { TarjetaVidrio } from '../components/TarjetaVidrio';
import { colores } from '../theme/colores';

/* ─────────── AJUSTES DEL NIVEL 2 ─────────── */
const DURACION_VUELTA = 1100; // ms que tarda el spinner en dar una vuelta
const DURACION_CARGA = 5000; // ms que tarda la barra en llegar al 100 %
const TAMANO_SPINNER = 140;
const CAMBIO_DE_CONSEJO = 2600; // ms que dura cada consejo en pantalla

// Mensaje que se muestra según el porcentaje de carga
function mensajeDeCarga(porcentaje: number) {
  if (porcentaje >= 100) return '¡Partida lista!';
  if (porcentaje >= 75) return 'Guardando tu progreso…';
  if (porcentaje >= 50) return 'Afilando espadas…';
  if (porcentaje >= 25) return 'Despertando a los enemigos…';
  return 'Generando el mundo…';
}

// Consejos que van rotando mientras carga
const CONSEJOS = [
  'Guarda la partida antes de enfrentar al jefe final.',
  'Explora cada rincón: los mejores tesoros están escondidos.',
  'Un bloqueo a tiempo vale más que diez golpes.',
  'Si un jefe te gana, estudia su patrón y vuelve a intentarlo.',
  'Mejora tu equipo antes de entrar a una zona nueva.',
];
/* ─────────────────────────────────────────────── */

/**
 * NIVEL 2 — CARGANDO PARTIDA (animación de carga)
 * Al montarse la pantalla arrancan automáticamente:
 *  - un spinner infinito (dos anillos girando en sentidos opuestos)
 *  - una barra de progreso animada de 0 % a 100 %
 */
export default function CargandoPartida() {
  const giro = useSharedValue(0);
  const progreso = useSharedValue(0); // 0 a 1
  const brillo = useSharedValue(0);
  const [porcentaje, setPorcentaje] = useState(0);
  const [consejo, setConsejo] = useState(0);

  // Rota los consejos cada cierto tiempo
  useEffect(() => {
    const id = setInterval(() => setConsejo((c) => (c + 1) % CONSEJOS.length), CAMBIO_DE_CONSEJO);
    return () => clearInterval(id);
  }, []);

  const iniciarCarga = useCallback(() => {
    progreso.value = 0;
    progreso.value = withTiming(1, { duration: DURACION_CARGA, easing: Easing.inOut(Easing.cubic) });
  }, [progreso]);

  // Se ejecuta al montar el componente: arranca todo automáticamente
  useEffect(() => {
    giro.value = withRepeat(withTiming(360, { duration: DURACION_VUELTA, easing: Easing.linear }), -1, false);
    brillo.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.linear }), -1, false);
    iniciarCarga();

    // Al salir de la pantalla se detienen las animaciones
    return () => {
      cancelAnimation(giro);
      cancelAnimation(brillo);
      cancelAnimation(progreso);
    };
  }, [giro, brillo, progreso, iniciarCarga]);

  // Pasa el porcentaje del hilo de animación al texto de la pantalla
  useAnimatedReaction(
    () => Math.round(progreso.value * 100),
    (actual, previo) => {
      if (actual !== previo) scheduleOnRN(setPorcentaje, actual);
    },
  );

  const anilloExterior = useAnimatedStyle(() => ({
    transform: [{ rotate: `${giro.value}deg` }],
  }));
  const anilloInterior = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-giro.value * 1.5}deg` }],
  }));
  const barra = useAnimatedStyle(() => ({
    width: `${progreso.value * 100}%`,
  }));
  const reflejo = useAnimatedStyle(() => ({
    transform: [{ translateX: -120 + brillo.value * 480 }],
  }));

  const completo = porcentaje >= 100;

  return (
    <Pantalla>
      <EncabezadoPantalla
        titulo="Cargando partida"
        instrucciones="Tu próxima aventura se está preparando. Mientras tanto, lee los consejos del maestro."
      />

      <View style={styles.centro}>
        {/* Spinner */}
        <View style={styles.spinner}>
          <Animated.View style={[styles.anillo, styles.anilloExterior, anilloExterior]} />
          <Animated.View style={[styles.anillo, styles.anilloInterior, anilloInterior]} />
          <Ionicons name={completo ? 'checkmark' : 'game-controller'} size={36} color={colores.dorado} />
        </View>

        {/* Barra de progreso */}
        <TarjetaVidrio style={styles.tarjeta}>
          <View style={styles.filaTexto}>
            <Text style={styles.estado}>{mensajeDeCarga(porcentaje)}</Text>
            <Text style={styles.porcentaje}>{porcentaje}%</Text>
          </View>

          <View style={styles.pista}>
            <Animated.View style={[styles.relleno, barra]}>
              <LinearGradient
                colors={[colores.azul, colores.verde, colores.dorado]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
              <Animated.View style={[styles.reflejo, reflejo]}>
                <LinearGradient
                  colors={['transparent', 'rgba(255,255,255,0.55)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>
            </Animated.View>
          </View>
        </TarjetaVidrio>

        {/* Consejo que cambia con un fundido */}
        <View style={styles.consejo}>
          <Text style={styles.etiquetaConsejo}>CONSEJO</Text>
          <Animated.Text
            key={consejo}
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(250)}
            style={styles.textoConsejo}
          >
            {CONSEJOS[consejo]}
          </Animated.Text>
        </View>

        <Pressable style={styles.boton} onPress={iniciarCarga}>
          <Ionicons name="refresh" size={18} color={colores.fondo} />
          <Text style={styles.textoBoton}>Reiniciar partida</Text>
        </Pressable>
      </View>
    </Pantalla>
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
  spinner: {
    width: TAMANO_SPINNER,
    height: TAMANO_SPINNER,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anillo: {
    position: 'absolute',
    borderRadius: 999,
  },
  anilloExterior: {
    width: TAMANO_SPINNER,
    height: TAMANO_SPINNER,
    borderWidth: 6,
    borderColor: 'rgba(255,255,255,0.08)',
    borderTopColor: colores.azul,
    borderRightColor: colores.verde,
  },
  anilloInterior: {
    width: TAMANO_SPINNER * 0.68,
    height: TAMANO_SPINNER * 0.68,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.06)',
    borderBottomColor: colores.dorado,
    borderLeftColor: colores.dorado,
  },
  tarjeta: {
    width: '100%',
    padding: 20,
    gap: 14,
  },
  filaTexto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  estado: {
    color: colores.textoSecundario,
    fontSize: 15,
    fontWeight: '600',
  },
  porcentaje: {
    color: colores.texto,
    fontSize: 28,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  pista: {
    height: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  relleno: {
    height: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
  reflejo: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
  },
  consejo: {
    alignItems: 'center',
    gap: 6,
    minHeight: 64,
    paddingHorizontal: 8,
  },
  etiquetaConsejo: {
    color: colores.dorado,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  textoConsejo: {
    color: colores.textoSecundario,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
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

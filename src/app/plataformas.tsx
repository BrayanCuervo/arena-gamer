import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EncabezadoPantalla } from '../components/EncabezadoPantalla';
import { encabezadosFoto, plataformas, type Plataforma } from '../data/plataformas';
import { colores } from '../theme/colores';

/* ─────────── AJUSTES DEL NIVEL 5 ─────────── */
const PROPORCION_TARJETA = 0.72; // ancho de la tarjeta respecto a la pantalla
const ESPACIO = 16; // separación entre tarjetas
const ROTACION_LATERAL = 28; // grados de giro 3D de las tarjetas laterales
const ESCALA_LATERAL = 0.84; // tamaño de las tarjetas laterales
/* ─────────────────────────────────────────────── */

/**
 * NIVEL 5 — ELIGE TU PLATAFORMA (carrusel animado)
 */
export default function EligeTuPlataforma() {
  const { width, height } = useWindowDimensions();
  const altoTarjeta = Math.min(480, height * 0.6);
  const insets = useSafeAreaInsets();
  const anchoTarjeta = width * PROPORCION_TARJETA;
  const intervalo = anchoTarjeta + ESPACIO; // distancia entre una tarjeta y la siguiente
  const margenLateral = (width - intervalo) / 2;

  const scrollX = useSharedValue(0);
  const refScroll = useAnimatedRef<Animated.ScrollView>();

  const alDesplazar = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const irA = (indice: number) => {
    refScroll.current?.scrollTo({ x: indice * intervalo, animated: true });
  };

  return (
    <View style={styles.raiz}>
      {/* 1) Fondos degradados apilados: se mezclan según la posición */}
      {plataformas.map((p, i) => (
        <CapaFondo key={p.nombre} plataforma={p} indice={i} scrollX={scrollX} intervalo={intervalo} />
      ))}
      {/* 2) Capa de vidrio encima para suavizar */}
      <View style={[StyleSheet.absoluteFill, styles.velo]} pointerEvents="none" />

      <View style={{ paddingTop: insets.top + 56 }}>
        <EncabezadoPantalla
          titulo="Elige tu plataforma"
          instrucciones="Desliza para recorrer las consolas. Cada una tiene su color, su historia y un juegazo que la define."
        />
      </View>

      {/* 3) Carrusel */}
      <Animated.ScrollView
        ref={refScroll}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={intervalo}
        decelerationRate="fast"
        onScroll={alDesplazar}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: margenLateral, alignItems: 'center' }}
        style={styles.carrusel}
      >
        {plataformas.map((p, i) => (
          <Tarjeta
            key={p.nombre}
            plataforma={p}
            indice={i}
            scrollX={scrollX}
            intervalo={intervalo}
            ancho={anchoTarjeta}
            alto={altoTarjeta}
          />
        ))}
      </Animated.ScrollView>

      {/* 4) Puntos indicadores */}
      <View style={[styles.puntos, { paddingBottom: insets.bottom + 28 }]}>
        {plataformas.map((p, i) => (
          <Punto key={p.nombre} indice={i} scrollX={scrollX} intervalo={intervalo} onPress={() => irA(i)} />
        ))}
      </View>
    </View>
  );
}

/* ───────────── Capa de fondo de cada plataforma ───────────── */
type PropsCapa = {
  plataforma: Plataforma;
  indice: number;
  scrollX: SharedValue<number>;
  intervalo: number;
};

function CapaFondo({ plataforma, indice, scrollX, intervalo }: PropsCapa) {
  const estilo = useAnimatedStyle(() => {
    // Las capas están apiladas en orden: cada una aparece (fundido) ENCIMA de la
    // anterior a medida que su tarjeta llega al centro. Así la mezcla es suave y
    // nunca se ve un "hueco" oscuro entre dos colores. La primera siempre está visible.
    if (indice === 0) return { opacity: 1 };
    const centro = indice * intervalo;
    return {
      opacity: interpolate(scrollX.value, [centro - intervalo, centro], [0, 1], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View style={[StyleSheet.absoluteFill, estilo]} pointerEvents="none">
      <LinearGradient
        colors={plataforma.degradado}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

/* ───────────── Tarjeta del carrusel ───────────── */
type PropsTarjeta = PropsCapa & { ancho: number; alto: number };

function Tarjeta({ plataforma, indice, scrollX, intervalo, ancho, alto }: PropsTarjeta) {
  const rango = [(indice - 1) * intervalo, indice * intervalo, (indice + 1) * intervalo];
  // Si la foto no carga (sin internet, por ejemplo) se muestra el ícono
  const [fotoFallo, setFotoFallo] = useState(false);
  const mostrarFoto = plataforma.foto !== null && !fotoFallo;

  const estiloTarjeta = useAnimatedStyle(() => {
    const escala = interpolate(scrollX.value, rango, [ESCALA_LATERAL, 1, ESCALA_LATERAL], Extrapolation.CLAMP);
    const giroY = interpolate(scrollX.value, rango, [ROTACION_LATERAL, 0, -ROTACION_LATERAL], Extrapolation.CLAMP);
    const giroZ = interpolate(scrollX.value, rango, [4, 0, -4], Extrapolation.CLAMP);
    const bajada = interpolate(scrollX.value, rango, [24, 0, 24], Extrapolation.CLAMP);
    return {
      opacity: interpolate(scrollX.value, rango, [0.55, 1, 0.55], Extrapolation.CLAMP),
      transform: [
        { perspective: 900 },
        { translateY: bajada },
        { scale: escala },
        { rotateY: `${giroY}deg` },
        { rotateZ: `${giroZ}deg` },
      ],
    };
  });

  // Parallax: la foto se desplaza un poco más que la tarjeta y crece al centrarse
  const estiloFoto = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(scrollX.value, rango, [70, 0, -70], Extrapolation.CLAMP) },
      { scale: interpolate(scrollX.value, rango, [0.8, 1, 0.8], Extrapolation.CLAMP) },
      { rotate: `${interpolate(scrollX.value, rango, [-10, 0, 10], Extrapolation.CLAMP)}deg` },
    ],
  }));

  return (
    <View style={{ width: ancho + ESPACIO, alignItems: 'center' }}>
      <Animated.View
        style={[styles.tarjeta, { width: ancho, height: alto, shadowColor: plataforma.acento }, estiloTarjeta]}
      >
        <View style={[StyleSheet.absoluteFill, styles.vidrioTarjeta]} />
        <LinearGradient
          colors={[`${plataforma.acento}55`, 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.6, y: 0.6 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Foto de la consola (o ícono si no hay foto) */}
        <View style={styles.zonaFoto}>
          <Animated.View style={[styles.contenedorFoto, estiloFoto]}>
            {mostrarFoto ? (
              <Image
                source={{ uri: plataforma.foto!, headers: encabezadosFoto }}
                style={styles.foto}
                resizeMode="contain"
                onError={() => setFotoFallo(true)}
              />
            ) : (
              <View style={[styles.icono, { borderColor: `${plataforma.acento}88` }]}>
                <Ionicons name={plataforma.icono} size={54} color={plataforma.acento} />
              </View>
            )}
          </Animated.View>
        </View>

        <Text style={styles.detalle}>{plataforma.detalle}</Text>
        <Text style={styles.nombre} numberOfLines={1} adjustsFontSizeToFit>
          {plataforma.nombre}
        </Text>

        <View style={[styles.separador, { backgroundColor: `${plataforma.acento}66` }]} />

        <View style={styles.filaJuegazo}>
          <Ionicons name="trophy" size={14} color={colores.dorado} />
          <Text style={styles.etiquetaJuegazo}>JUEGAZO</Text>
        </View>
        <Text style={styles.juegazo} numberOfLines={2}>
          {plataforma.juegazo}
        </Text>
        <Text style={styles.porQue} numberOfLines={5}>
          {plataforma.porQue}
        </Text>
      </Animated.View>
    </View>
  );
}

/* ───────────── Punto indicador ───────────── */
type PropsPunto = {
  indice: number;
  scrollX: SharedValue<number>;
  intervalo: number;
  onPress: () => void;
};

function Punto({ indice, scrollX, intervalo, onPress }: PropsPunto) {
  const acentos = plataformas.map((p) => p.acento);
  const entradas = plataformas.map((_, i) => i * intervalo);

  const estilo = useAnimatedStyle(() => {
    const distancia = Math.abs(scrollX.value - indice * intervalo) / intervalo;
    return {
      width: interpolate(distancia, [0, 1], [28, 8], Extrapolation.CLAMP),
      opacity: interpolate(distancia, [0, 1], [1, 0.4], Extrapolation.CLAMP),
      // El punto activo toma el color de la plataforma actual
      backgroundColor: interpolateColor(scrollX.value, entradas, acentos),
    };
  });

  return (
    <Pressable onPress={onPress} hitSlop={10}>
      <Animated.View style={[styles.punto, estilo]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  raiz: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  velo: {
    backgroundColor: 'rgba(6, 11, 24, 0.35)',
  },
  carrusel: {
    flexGrow: 0,
    marginTop: 12,
  },
  tarjeta: {
    borderRadius: 28,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    gap: 4,
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  vidrioTarjeta: {
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  zonaFoto: {
    flex: 1,
    minHeight: 120,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contenedorFoto: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  foto: {
    width: '100%',
    height: '100%',
  },
  icono: {
    width: 110,
    height: 110,
    borderRadius: 30,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detalle: {
    color: colores.textoSecundario,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  nombre: {
    color: colores.blanco,
    fontSize: 28,
    fontWeight: '900',
  },
  separador: {
    height: 1,
    marginVertical: 8,
  },
  filaJuegazo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  etiquetaJuegazo: {
    color: colores.dorado,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  juegazo: {
    color: colores.texto,
    fontSize: 18,
    fontWeight: '800',
  },
  porQue: {
    color: colores.textoSecundario,
    fontSize: 13,
    lineHeight: 19,
  },
  puntos: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  punto: {
    height: 8,
    borderRadius: 4,
  },
});

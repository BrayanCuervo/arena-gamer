import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

import { Pantalla } from '../components/Pantalla';
import { TarjetaVidrio } from '../components/TarjetaVidrio';
import { niveles } from '../data/niveles';
import { plataformas } from '../data/plataformas';
import { colores } from '../theme/colores';

function Estrellas({ cantidad }: { cantidad: number }) {
  return (
    <View style={styles.estrellas}>
      {[1, 2, 3].map((i) => (
        <Ionicons key={i} name={i <= cantidad ? 'star' : 'star-outline'} size={12} color={colores.dorado} />
      ))}
    </View>
  );
}

/** SELECTOR DE NIVELES (pantalla de inicio) */
export default function SelectorNiveles() {
  const router = useRouter();

  return (
    <Pantalla>
      <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
        {/* Portada */}
        <Animated.View entering={FadeInDown.duration(500)}>
          <LinearGradient
            colors={['rgba(59,130,246,0.35)', 'rgba(34,197,94,0.25)', 'rgba(245,196,81,0.15)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.portada}
          >
            <Text style={styles.etiquetaPortada}>TEMPORADA 1</Text>
            <Text style={styles.titulo}>
              Bienvenido a la <Text style={styles.resaltado}>Arena</Text>
            </Text>
            <Text style={styles.subtitulo}>
              Seis niveles, cada uno con su propio reto. Pilota, explora, golpea y sacude hasta llegar al final.
            </Text>
            <View style={styles.estadisticas}>
              <Dato valor="6" etiqueta="Niveles" />
              <Dato valor="5" etiqueta="Plataformas" />
              <Dato valor="18" etiqueta="Estrellas" />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Niveles */}
        <Text style={styles.seccion}>Selecciona un nivel</Text>
        {niveles.map((n, i) => (
          <Animated.View key={n.ruta} entering={FadeInDown.delay(120 + i * 70).duration(450)}>
            <Pressable onPress={() => router.push(`/${n.ruta}`)}>
              {({ pressed }) => (
                <TarjetaVidrio style={[styles.tarjeta, pressed && styles.presionada]}>
                  <View style={[styles.icono, { backgroundColor: `${n.color}26`, borderColor: `${n.color}66` }]}>
                    <Ionicons name={n.icono} size={24} color={n.color} />
                  </View>
                  <View style={styles.textos}>
                    <View style={styles.filaNivel}>
                      <Text style={[styles.numero, { color: n.color }]}>NIVEL {n.numero}</Text>
                      <Estrellas cantidad={n.dificultad} />
                    </View>
                    <Text style={styles.tituloTarjeta}>{n.nombre}</Text>
                    <Text style={styles.descripcion}>{n.mision}</Text>
                  </View>
                  <Ionicons name="play-circle" size={28} color={colores.dorado} />
                </TarjetaVidrio>
              )}
            </Pressable>
          </Animated.View>
        ))}

        {/* Salón de juegazos */}
        <Text style={styles.seccion}>Salón de juegazos</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.juegazos}>
          {plataformas.map((p, i) => (
            <Animated.View key={p.nombre} entering={FadeInRight.delay(500 + i * 80).duration(450)}>
              <Pressable onPress={() => router.push('/plataformas')}>
                <LinearGradient
                  colors={[p.degradado[0], p.degradado[2]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.juegazo}
                >
                  <Ionicons name="trophy" size={18} color={colores.dorado} />
                  <Text style={styles.nombreJuegazo} numberOfLines={2}>
                    {p.juegazo}
                  </Text>
                  <Text style={styles.plataformaJuegazo}>{p.nombre}</Text>
                </LinearGradient>
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>

        <Text style={styles.pie}>Consejo: también puedes moverte entre niveles con el menú o con la flecha de volver.</Text>
      </ScrollView>
    </Pantalla>
  );
}

function Dato({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  return (
    <View style={styles.dato}>
      <Text style={styles.valorDato}>{valor}</Text>
      <Text style={styles.etiquetaDato}>{etiqueta}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenido: {
    padding: 20,
    gap: 12,
    paddingBottom: 40,
  },
  portada: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: colores.bordeVidrio,
    gap: 6,
  },
  etiquetaPortada: {
    color: colores.dorado,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  titulo: {
    color: colores.texto,
    fontSize: 30,
    fontWeight: '900',
  },
  resaltado: {
    color: colores.dorado,
  },
  subtitulo: {
    color: colores.textoSecundario,
    fontSize: 14,
    lineHeight: 20,
  },
  estadisticas: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  dato: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  valorDato: {
    color: colores.texto,
    fontSize: 20,
    fontWeight: '900',
  },
  etiquetaDato: {
    color: colores.textoTenue,
    fontSize: 11,
    fontWeight: '700',
  },
  seccion: {
    color: colores.texto,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 14,
  },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  presionada: {
    transform: [{ scale: 0.98 }],
    opacity: 0.85,
  },
  icono: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textos: {
    flex: 1,
    gap: 2,
  },
  filaNivel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  numero: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  estrellas: {
    flexDirection: 'row',
    gap: 2,
  },
  tituloTarjeta: {
    color: colores.texto,
    fontSize: 16,
    fontWeight: '700',
  },
  descripcion: {
    color: colores.textoSecundario,
    fontSize: 13,
  },
  juegazos: {
    gap: 12,
    paddingRight: 20,
  },
  juegazo: {
    width: 150,
    height: 130,
    borderRadius: 18,
    padding: 14,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  nombreJuegazo: {
    color: colores.blanco,
    fontSize: 15,
    fontWeight: '800',
  },
  plataformaJuegazo: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '600',
  },
  pie: {
    color: colores.textoTenue,
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
  },
});

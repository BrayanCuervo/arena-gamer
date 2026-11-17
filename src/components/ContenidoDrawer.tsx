import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { DrawerContentScrollView, type DrawerContentComponentProps } from 'expo-router/drawer';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { niveles } from '../data/niveles';
import { colores, radios } from '../theme/colores';

/**
 * MENÚ LATERAL (DRAWER) PERSONALIZADO
 * Muestra "Selector de niveles" + los 6 niveles. El ítem activo se resalta en dorado.
 */
export function ContenidoDrawer(props: DrawerContentComponentProps) {
  const rutaActiva = props.state.routes[props.state.index]?.name;

  const items = [
    { ruta: 'index', titulo: 'Selector de niveles', icono: 'grid' as const, numero: 0 },
    ...niveles.map((n) => ({ ruta: n.ruta, titulo: n.nombre, icono: n.icono, numero: n.numero })),
  ];

  return (
    <View style={styles.raiz}>
      <LinearGradient colors={[colores.fondoSecundario, colores.fondo]} style={StyleSheet.absoluteFill} />
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

      <DrawerContentScrollView {...props} contentContainerStyle={styles.scroll}>
        {/* Cabecera del menú */}
        <View style={styles.cabecera}>
          <LinearGradient
            colors={[colores.azul, colores.verde]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logo}
          >
            <Ionicons name="trophy" size={26} color={colores.blanco} />
          </LinearGradient>
          <Text style={styles.tituloApp}>Arena Gamer</Text>
          <Text style={styles.subtituloApp}>6 niveles · 1 jugador · 0 excusas</Text>
        </View>

        {/* Ítems */}
        {items.map((item) => {
          const activo = rutaActiva === item.ruta;
          return (
            <Pressable
              key={item.ruta}
              onPress={() => props.navigation.navigate(item.ruta)}
              style={({ pressed }) => [styles.item, activo && styles.itemActivo, pressed && styles.itemPresionado]}
            >
              <Ionicons
                name={item.icono}
                size={20}
                color={activo ? colores.dorado : colores.textoSecundario}
              />
              <View style={styles.textosItem}>
                {item.numero > 0 && (
                  <Text style={[styles.nivelItem, activo && styles.textoItemActivo]}>NIVEL {item.numero}</Text>
                )}
                <Text style={[styles.textoItem, activo && styles.textoItemActivo]}>{item.titulo}</Text>
              </View>
            </Pressable>
          );
        })}
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  raiz: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: colores.bordeVidrio,
  },
  scroll: {
    paddingHorizontal: 12,
  },
  cabecera: {
    paddingHorizontal: 8,
    paddingTop: 8,
    paddingBottom: 24,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colores.bordeVidrio,
  },
  logo: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  tituloApp: {
    color: colores.texto,
    fontSize: 22,
    fontWeight: '800',
  },
  subtituloApp: {
    color: colores.textoTenue,
    fontSize: 13,
    marginTop: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: radios.pequeno,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  itemActivo: {
    backgroundColor: 'rgba(245, 196, 81, 0.12)',
    borderColor: 'rgba(245, 196, 81, 0.35)',
  },
  itemPresionado: {
    backgroundColor: colores.vidrio,
  },
  textosItem: {
    flex: 1,
  },
  nivelItem: {
    color: colores.textoTenue,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  textoItem: {
    color: colores.textoSecundario,
    fontSize: 15,
    fontWeight: '600',
  },
  textoItemActivo: {
    color: colores.dorado,
  },
});

import { Ionicons } from '@expo/vector-icons';
import { DarkTheme, ThemeProvider } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ContenidoDrawer } from '../components/ContenidoDrawer';
import { niveles } from '../data/niveles';
import { colores } from '../theme/colores';

const temaOscuro = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colores.fondo,
    card: colores.fondo,
    primary: colores.dorado,
    text: colores.texto,
    border: colores.bordeVidrio,
  },
};

// En estos niveles se desactiva abrir el menú deslizando desde el borde,
// para que no "compita" con el gesto del nivel (se abre con el botón de menú).
const NIVELES_CON_GESTOS = ['nave', 'mapa', 'plataformas'];

function BotonEncabezado({ icono, onPress, etiqueta }: {
  icono: 'arrow-back' | 'menu';
  onPress: () => void;
  etiqueta: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityLabel={etiqueta}
      style={({ pressed }) => [styles.boton, pressed && styles.botonPresionado]}
    >
      <Ionicons name={icono} size={22} color={colores.texto} />
    </Pressable>
  );
}

/**
 * LAYOUT RAÍZ
 */
export default function LayoutRaiz() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colores.fondo }}>
      <ThemeProvider value={temaOscuro}>
        <StatusBar style="light" />
        <Drawer
          drawerContent={(props) => <ContenidoDrawer {...props} />}
          // "history": la flecha y el botón Atrás del celular regresan a la pantalla anterior
          backBehavior="history"
          screenOptions={({ navigation, route }) => ({
            headerStyle: { backgroundColor: colores.fondo },
            headerShadowVisible: false,
            headerTintColor: colores.texto,
            headerTitleStyle: { fontWeight: '700' },
            headerTitleAlign: 'center',
            drawerStyle: { backgroundColor: colores.fondo, width: 300 },
            overlayColor: 'rgba(0, 0, 0, 0.55)',
            sceneStyle: { backgroundColor: colores.fondo },
            swipeEdgeWidth: 40,
            // Flecha para volver (en todas menos en Inicio)
            headerLeft: () =>
              route.name === 'index' ? null : (
                <BotonEncabezado
                  icono="arrow-back"
                  etiqueta="Volver"
                  onPress={() => (navigation.canGoBack() ? navigation.goBack() : navigation.navigate('index'))}
                />
              ),
            // Botón de menú (en todas)
            headerRight: () => (
              <BotonEncabezado icono="menu" etiqueta="Abrir menú" onPress={() => navigation.toggleDrawer()} />
            ),
          })}
        >
          <Drawer.Screen name="index" options={{ title: 'Arena Gamer' }} />
          {niveles.map((n) => (
            <Drawer.Screen
              key={n.ruta}
              name={n.ruta}
              options={{
                title: `Nivel ${n.numero}`,
                swipeEnabled: !NIVELES_CON_GESTOS.includes(n.ruta),
                // En "Elige tu plataforma" el encabezado es transparente para que
                // el degradado de colores ocupe toda la pantalla.
                ...(n.ruta === 'plataformas' && {
                  headerTransparent: true,
                  headerStyle: { backgroundColor: 'transparent' },
                }),
              }}
            />
          ))}
        </Drawer>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  boton: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colores.vidrio,
    borderWidth: 1,
    borderColor: colores.bordeVidrio,
  },
  botonPresionado: {
    backgroundColor: colores.vidrioFuerte,
  },
});

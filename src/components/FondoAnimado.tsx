import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { colores } from '../theme/colores';

/**
 * Fondo oscuro con dos "manchas" de luz (azul y verde) que se mueven
 * lentamente. Se usa detrás de todas las pantallas.
 */
export function FondoAnimado() {
  const t = useSharedValue(0);

  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 9000, easing: Easing.inOut(Easing.sin) }), -1, true);
  }, [t]);

  const manchaAzul = useAnimatedStyle(() => ({
    transform: [{ translateX: -40 + t.value * 80 }, { translateY: t.value * 60 }, { scale: 1 + t.value * 0.15 }],
  }));

  const manchaVerde = useAnimatedStyle(() => ({
    transform: [{ translateX: 30 - t.value * 70 }, { translateY: -t.value * 50 }, { scale: 1.1 - t.value * 0.15 }],
  }));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient
        colors={[colores.fondoSecundario, colores.fondo, colores.fondo]}
        style={StyleSheet.absoluteFill}
      />
      <Animated.View style={[styles.mancha, styles.azul, manchaAzul]} />
      <Animated.View style={[styles.mancha, styles.verde, manchaVerde]} />
    </View>
  );
}

const styles = StyleSheet.create({
  mancha: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    opacity: 0.22,
  },
  azul: {
    top: -60,
    left: -80,
    backgroundColor: colores.azul,
  },
  verde: {
    bottom: 40,
    right: -100,
    backgroundColor: colores.verde,
  },
});

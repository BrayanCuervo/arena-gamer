import { BlurView } from 'expo-blur';
import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colores, intensidadBlur, radios } from '../theme/colores';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Intensidad del desenfoque (0-100). Por defecto usa la del tema. */
  intensidad?: number;
};

/**
 * Tarjeta reutilizable con efecto vidrio:
 * fondo desenfocado + capa blanca translúcida + borde suave.
 */
export function TarjetaVidrio({ children, style, intensidad = intensidadBlur }: Props) {
  return (
    <View style={[styles.contenedor, style]}>
      <BlurView intensity={intensidad} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, styles.capa]} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    overflow: 'hidden',
    borderRadius: radios.medio,
    borderWidth: 1,
    borderColor: colores.bordeVidrio,
  },
  capa: {
    backgroundColor: colores.vidrio,
  },
});

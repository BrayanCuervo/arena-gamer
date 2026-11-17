import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { FondoAnimado } from './FondoAnimado';

/** Contenedor base de cada pantalla: pone el fondo animado detrás. */
export function Pantalla({ children }: { children: ReactNode }) {
  return (
    <View style={styles.contenedor}>
      <FondoAnimado />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
  },
});

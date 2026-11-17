import { StyleSheet, Text, View } from 'react-native';

import { colores } from '../theme/colores';

type Props = {
  titulo: string;
  instrucciones: string;
};

/** Título + instrucciones que aparecen arriba de cada nivel. */
export function EncabezadoPantalla({ titulo, instrucciones }: Props) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>{titulo}</Text>
      <Text style={styles.instrucciones}>{instrucciones}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 6,
  },
  titulo: {
    color: colores.texto,
    fontSize: 24,
    fontWeight: '800',
  },
  instrucciones: {
    color: colores.textoSecundario,
    fontSize: 14,
    lineHeight: 20,
  },
});

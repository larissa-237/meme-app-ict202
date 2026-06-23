import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function EffectsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Effets visuels — En construction 🎨</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7', alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18, color: '#8e8e93' },
});

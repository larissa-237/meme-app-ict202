import React, { useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

export default function MemeCard({ topText = '', emoji = '😂', bottomText = '', onCapture }) {
  const viewShotRef = useRef(null);

  const saveToGallery = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', "Autorise l'accès à la galerie.");
        return;
      }
      const uri = await viewShotRef.current.capture();
      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('✅ Sauvegardé', 'Meme enregistré dans ta galerie !');
      if (onCapture) onCapture(uri);
    } catch (e) {
      Alert.alert('Erreur', e.message);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }}>
        <LinearGradient
          colors={['#6C63FF', '#FF6B9D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          {topText ? (
            <Text style={styles.topText}>{topText}</Text>
          ) : null}
          <Text style={styles.emoji}>{emoji}</Text>
          {bottomText ? (
            <Text style={styles.bottomText}>{bottomText}</Text>
          ) : null}
        </LinearGradient>
      </ViewShot>

      <TouchableOpacity style={styles.saveBtn} onPress={saveToGallery}>
        <Text style={styles.saveBtnText}>💾 Sauvegarder dans la galerie</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginVertical: 16 },
  card: {
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  topText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  emoji: {
    fontSize: 60,
    marginVertical: 8,
  },
  bottomText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  saveBtn: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 12,
  },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

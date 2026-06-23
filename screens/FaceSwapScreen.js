import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';

const BACKEND_URL = 'http://192.168.88.108:3000';

export default function FaceSwapScreen() {
  const [sticker, setSticker] = useState(null);
  const [face, setFace] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const viewShotRef = React.useRef(null);

  const pickSticker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission refusée'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, quality: 1,
    });
    if (!res.canceled) setSticker(res.assets[0].uri);
  };

  const pickFace = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission refusée'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, quality: 1,
    });
    if (!res.canceled) setFace(res.assets[0].uri);
  };

  const generateFaceSwap = async () => {
    if (!sticker || !face) {
      Alert.alert('Importe les deux images d\'abord.');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('sticker', { uri: sticker, type: 'image/jpeg', name: 'sticker.jpg' });
      formData.append('face', { uri: face, type: 'image/jpeg', name: 'face.jpg' });
      const response = await fetch(`${BACKEND_URL}/api/face-swap`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = await response.json();
      setResult(data.imageUrl || data.result || null);
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de joindre le backend.');
    }
    setLoading(false);
  };

  const exportSticker = async () => {
    if (!viewShotRef.current) return;
    try {
      const uri = await viewShotRef.current.capture();
      const available = await Sharing.isAvailableAsync();
      if (available) await Sharing.shareAsync(uri);
      else Alert.alert('Partage non disponible.');
    } catch (e) {
      Alert.alert('Erreur export', e.message);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Face Swap Sticker</Text>
      <Text style={styles.subtitle}>Mets ton visage sur un sticker via l'IA</Text>

      <TouchableOpacity style={styles.pickBtn} onPress={pickSticker}>
        <Text style={styles.pickBtnText}>🖼️ Importer le sticker</Text>
      </TouchableOpacity>
      {sticker && <Image source={{ uri: sticker }} style={styles.preview} resizeMode="contain" />}

      <TouchableOpacity style={[styles.pickBtn, { backgroundColor: '#FF6B9D' }]} onPress={pickFace}>
        <Text style={styles.pickBtnText}>🤳 Importer ton visage</Text>
      </TouchableOpacity>
      {face && <Image source={{ uri: face }} style={styles.preview} resizeMode="contain" />}

      <TouchableOpacity style={styles.generateBtn} onPress={generateFaceSwap} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.generateBtnText}>✨ Générer le Face Swap</Text>
        }
      </TouchableOpacity>

      {result && (
        <>
          <Text style={styles.sectionLabel}>Résultat</Text>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={styles.resultCard}>
            <Image source={{ uri: result }} style={styles.resultImage} resizeMode="contain" />
          </ViewShot>
          <TouchableOpacity style={styles.exportBtn} onPress={exportSticker}>
            <Text style={styles.exportBtnText}>📤 Exporter le sticker</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: '700', color: '#1c1c1e', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#8e8e93', marginBottom: 20 },
  pickBtn: {
    backgroundColor: '#6C63FF', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', marginBottom: 12,
  },
  pickBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  preview: { width: '100%', height: 180, borderRadius: 14, marginBottom: 16, backgroundColor: '#fff' },
  generateBtn: {
    backgroundColor: '#FF9500', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', marginBottom: 16,
  },
  generateBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  sectionLabel: {
    fontSize: 13, fontWeight: '600', color: '#8e8e93',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10,
  },
  resultCard: {
    backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden',
    marginBottom: 16, borderWidth: 0.5, borderColor: '#e0e0e0',
  },
  resultImage: { width: '100%', height: 300 },
  exportBtn: {
    backgroundColor: '#34C759', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
  },
  exportBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

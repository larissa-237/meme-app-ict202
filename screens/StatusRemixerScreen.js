import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';

const BACKEND_URL = 'http://192.168.88.108:3000';

export default function StatusRemixerScreen() {
  const [image, setImage] = useState(null);
  const [aiText, setAiText] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('none');
  const viewShotRef = React.useRef(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', "Autorise l'accès à la galerie.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setAiText('');
      setFilter('none');
    }
  };

  const sendToBackend = async () => {
    if (!image) { Alert.alert("Sélectionne une image d'abord."); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });
      const response = await fetch(`${BACKEND_URL}/api/status-remixer`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = await response.json();
      setAiText(data.meme || data.text || 'Meme généré !');
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de joindre le backend.');
    }
    setLoading(false);
  };

  const exportImage = async () => {
    if (!viewShotRef.current) return;
    try {
      const uri = await viewShotRef.current.capture();
      const available = await Sharing.isAvailableAsync();
      if (available) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Partage non disponible sur cet appareil.');
      }
    } catch (e) {
      Alert.alert('Erreur export', e.message);
    }
  };

  const getFilterStyle = () => {
    if (filter === 'luminosite') return { opacity: 0.6 };
    if (filter === 'nb') return { tintColor: 'gray' };
    return {};
  };

  const getOverlayFilter = () => {
    if (filter === 'luminosite') return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,200,0.35)' }]} />
    );
    if (filter === 'contraste') return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.25)' }]} />
    );
    return null;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Status Remixer</Text>
      <Text style={styles.subtitle}>Transforme une image en meme avec l'IA</Text>

      <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
        <Text style={styles.pickBtnText}>📁 Choisir une image</Text>
      </TouchableOpacity>

      {image && (
        <>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={styles.card}>
            <Image
              source={{ uri: image }}
              style={[styles.image, getFilterStyle()]}
              resizeMode="cover"
            />
            {getOverlayFilter()}
            {aiText ? (
              <View style={styles.textOverlay}>
                <Text style={styles.overlayText}>{aiText}</Text>
              </View>
            ) : null}
          </ViewShot>

          <Text style={styles.sectionLabel}>Filtres visuels</Text>
          <View style={styles.filterRow}>
            {['none', 'luminosite', 'contraste', 'nb'].map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
                onPress={() => setFilter(f)}
              >
                <Text style={[styles.filterBtnText, filter === f && styles.filterBtnTextActive]}>
                  {f === 'none' ? 'Original' : f === 'luminosite' ? '☀️ Luminosité' : f === 'contraste' ? '🔆 Contraste' : '⬛ N&B'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.aiBtn} onPress={sendToBackend} disabled={loading}>
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.aiBtnText}>✨ Générer texte IA</Text>
            }
          </TouchableOpacity>

          {aiText ? (
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Texte généré :</Text>
              <Text style={styles.resultText}>{aiText}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.exportBtn} onPress={exportImage}>
            <Text style={styles.exportBtnText}>📤 Exporter PNG</Text>
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
    paddingVertical: 14, alignItems: 'center', marginBottom: 20,
  },
  pickBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  card: {
    borderRadius: 14, overflow: 'hidden',
    backgroundColor: '#fff', marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.08,
    shadowRadius: 8, elevation: 3,
  },
  image: { width: '100%', height: 280 },
  textOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', padding: 12,
  },
  overlayText: {
    color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 13, fontWeight: '600', color: '#8e8e93',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10,
  },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  filterBtn: {
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#e0e0e0',
  },
  filterBtnActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  filterBtnText: { fontSize: 13, color: '#1c1c1e' },
  filterBtnTextActive: { color: '#fff', fontWeight: '600' },
  aiBtn: {
    backgroundColor: '#6C63FF', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', marginBottom: 16,
  },
  aiBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  resultCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    marginBottom: 16, borderWidth: 0.5, borderColor: '#e0e0e0',
  },
  resultLabel: { fontSize: 12, color: '#8e8e93', marginBottom: 6 },
  resultText: { fontSize: 16, color: '#1c1c1e', fontWeight: '500' },
  exportBtn: {
    backgroundColor: '#34C759', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
  },
  exportBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

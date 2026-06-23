import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ScrollView, TextInput, ActivityIndicator, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';

const BACKEND_URL = 'http://192.168.88.108:3000';

export default function StickerGenScreen() {
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const viewShotRef = React.useRef(null);

  const pickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission refusée'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, quality: 1,
    });
    if (!res.canceled) setPhoto(res.assets[0].uri);
  };

  const generateSticker = async () => {
    if (!text.trim()) { Alert.alert('Saisis un texte d\'abord.'); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('text', text);
      if (photo) {
        formData.append('photo', { uri: photo, type: 'image/jpeg', name: 'photo.jpg' });
      }
      const response = await fetch(`${BACKEND_URL}/api/sticker-gen`, {
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
      <Text style={styles.title}>Sticker depuis texte</Text>
      <Text style={styles.subtitle}>Texte ou conversation → Sticker IA</Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: Mon ami m'a dit qu'il allait au travail mais il est resté au lit..."
        placeholderTextColor="#c7c7cc"
        multiline
        numberOfLines={5}
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={styles.pickBtn} onPress={pickPhoto}>
        <Text style={styles.pickBtnText}>📸 Ajouter une photo (optionnel)</Text>
      </TouchableOpacity>
      {photo && <Image source={{ uri: photo }} style={styles.preview} resizeMode="contain" />}

      <TouchableOpacity style={styles.generateBtn} onPress={generateSticker} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.generateBtnText}>✨ Générer le Sticker</Text>
        }
      </TouchableOpacity>

      {result && (
        <>
          <Text style={styles.sectionLabel}>Sticker généré</Text>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={styles.resultCard}>
            <Image source={{ uri: result }} style={styles.resultImage} resizeMode="contain" />
          </ViewShot>
          <TouchableOpacity style={styles.exportBtn} onPress={exportSticker}>
            <Text style={styles.exportBtnText}>📤 Exporter le sticker PNG</Text>
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
  input: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    fontSize: 15, color: '#1c1c1e', borderWidth: 0.5,
    borderColor: '#e0e0e0', marginBottom: 16,
    minHeight: 120, textAlignVertical: 'top',
  },
  pickBtn: {
    backgroundColor: '#5AC8FA', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', marginBottom: 12,
  },
  pickBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  preview: { width: '100%', height: 180, borderRadius: 14, marginBottom: 16, backgroundColor: '#fff' },
  generateBtn: {
    backgroundColor: '#6C63FF', borderRadius: 14,
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

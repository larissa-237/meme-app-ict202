import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  Image, ScrollView, TextInput, ActivityIndicator, Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import ViewShot from 'react-native-view-shot';

export default function EffectsScreen() {
  const [image, setImage] = useState(null);
  const [overlayText, setOverlayText] = useState('');
  const [filter, setFilter] = useState('none');
  const [textPosition, setTextPosition] = useState('bottom');
  const [textColor, setTextColor] = useState('#ffffff');
  const viewShotRef = React.useRef(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission refusée'); return; }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, quality: 1,
    });
    if (!res.canceled) setImage(res.assets[0].uri);
  };

  const exportImage = async () => {
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

  const getFilterStyle = () => {
    if (filter === 'nb') return { tintColor: 'gray' };
    if (filter === 'luminosite') return { opacity: 0.7 };
    if (filter === 'vintage') return { opacity: 0.85 };
    return {};
  };

  const getOverlay = () => {
    if (filter === 'luminosite') return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,180,0.3)' }]} />
    );
    if (filter === 'contraste') return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.3)' }]} />
    );
    if (filter === 'vintage') return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(180,100,0,0.25)' }]} />
    );
    if (filter === 'cool') return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,100,255,0.15)' }]} />
    );
    return null;
  };

  const filters = [
    { id: 'none', label: 'Original' },
    { id: 'nb', label: '⬛ N&B' },
    { id: 'luminosite', label: '☀️ Lumineux' },
    { id: 'contraste', label: '🔆 Contraste' },
    { id: 'vintage', label: '🎞️ Vintage' },
    { id: 'cool', label: '❄️ Cool' },
  ];

  const colors = ['#ffffff', '#000000', '#FF6B9D', '#6C63FF', '#FFD700', '#34C759'];
  const positions = ['top', 'center', 'bottom'];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Effets visuels</Text>
      <Text style={styles.subtitle}>Filtres, texte stylisé et export PNG</Text>

      <TouchableOpacity style={styles.pickBtn} onPress={pickImage}>
        <Text style={styles.pickBtnText}>📁 Choisir une image</Text>
      </TouchableOpacity>

      {image && (
        <>
          <ViewShot ref={viewShotRef} options={{ format: 'png', quality: 1 }} style={styles.card}>
            <Image source={{ uri: image }} style={[styles.image, getFilterStyle()]} resizeMode="cover" />
            {getOverlay()}
            {overlayText ? (
              <View style={[
                styles.textOverlay,
                textPosition === 'top' && { top: 0, bottom: undefined },
                textPosition === 'center' && { top: '40%', bottom: undefined },
              ]}>
                <Text style={[styles.overlayText, { color: textColor }]}>{overlayText}</Text>
              </View>
            ) : null}
          </ViewShot>

          <Text style={styles.sectionLabel}>Filtres</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {filters.map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[styles.filterBtn, filter === f.id && styles.filterBtnActive]}
                onPress={() => setFilter(f.id)}
              >
                <Text style={[styles.filterBtnText, filter === f.id && styles.filterBtnTextActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionLabel}>Texte</Text>
          <TextInput
            style={styles.input}
            placeholder="Ajouter un texte sur l'image..."
            placeholderTextColor="#c7c7cc"
            value={overlayText}
            onChangeText={setOverlayText}
          />

          <Text style={styles.sectionLabel}>Couleur du texte</Text>
          <View style={styles.colorRow}>
            {colors.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.colorBtn, { backgroundColor: c }, textColor === c && styles.colorBtnActive]}
                onPress={() => setTextColor(c)}
              />
            ))}
          </View>

          <Text style={styles.sectionLabel}>Position du texte</Text>
          <View style={styles.positionRow}>
            {positions.map((p) => (
              <TouchableOpacity
                key={p}
                style={[styles.posBtn, textPosition === p && styles.posBtnActive]}
                onPress={() => setTextPosition(p)}
              >
                <Text style={[styles.posBtnText, textPosition === p && styles.posBtnTextActive]}>
                  {p === 'top' ? '⬆️ Haut' : p === 'center' ? '⏺️ Centre' : '⬇️ Bas'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

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
    backgroundColor: '#AF52DE', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center', marginBottom: 20,
  },
  pickBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  card: {
    borderRadius: 14, overflow: 'hidden', backgroundColor: '#fff',
    marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.08,
    shadowRadius: 8, elevation: 3,
  },
  image: { width: '100%', height: 280 },
  textOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.35)', padding: 12,
  },
  overlayText: { fontSize: 18, fontWeight: '800', textAlign: 'center' },
  sectionLabel: {
    fontSize: 13, fontWeight: '600', color: '#8e8e93',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10,
  },
  filterScroll: { marginBottom: 16 },
  filterBtn: {
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8,
    backgroundColor: '#fff', borderWidth: 0.5, borderColor: '#e0e0e0',
    marginRight: 8,
  },
  filterBtnActive: { backgroundColor: '#AF52DE', borderColor: '#AF52DE' },
  filterBtnText: { fontSize: 13, color: '#1c1c1e' },
  filterBtnTextActive: { color: '#fff', fontWeight: '600' },
  input: {
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    fontSize: 15, color: '#1c1c1e', borderWidth: 0.5,
    borderColor: '#e0e0e0', marginBottom: 16,
  },
  colorRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  colorBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  colorBtnActive: { borderWidth: 3, borderColor: '#6C63FF' },
  positionRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  posBtn: {
    flex: 1, borderRadius: 14, paddingVertical: 10,
    alignItems: 'center', backgroundColor: '#fff',
    borderWidth: 0.5, borderColor: '#e0e0e0',
  },
  posBtnActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  posBtnText: { fontSize: 13, color: '#1c1c1e' },
  posBtnTextActive: { color: '#fff', fontWeight: '600' },
  exportBtn: {
    backgroundColor: '#34C759', borderRadius: 14,
    paddingVertical: 14, alignItems: 'center',
  },
  exportBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

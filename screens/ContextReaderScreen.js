import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, TextInput, ActivityIndicator, Alert
} from 'react-native';
import MemeCard from '../components/MemeCard';

const BACKEND_URL = 'http://192.168.88.108:3000';

export default function ContextReaderScreen() {
  const [text, setText] = useState('');
  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateMeme = async () => {
    if (!text.trim()) {
      Alert.alert('Saisis un texte d\'abord.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${BACKEND_URL}/api/context-reader`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setMeme(data.meme || data.text || 'Meme généré !');
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de joindre le backend.');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Context Reader</Text>
      <Text style={styles.subtitle}>Colle un texte ou une conversation → l'IA génère un meme</Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: Mon chef m'a dit que je suis en retard encore une fois..."
        placeholderTextColor="#c7c7cc"
        multiline
        numberOfLines={6}
        value={text}
        onChangeText={setText}
      />

      <TouchableOpacity style={styles.btn} onPress={generateMeme} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.btnText}>✨ Générer le Meme</Text>
        }
      </TouchableOpacity>

      {meme && (
        <MemeCard
          topText={meme}
          emoji="😂"
          bottomText="AI Meme Studio"
        />
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
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    color: '#1c1c1e',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    marginBottom: 16,
    minHeight: 140,
    textAlignVertical: 'top',
  },
  btn: {
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});

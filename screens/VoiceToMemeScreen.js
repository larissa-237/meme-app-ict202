import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { useAudioRecorder, AudioModule, RecordingPresets } from 'expo-audio';
import MemeCard from '../components/MemeCard';

const BACKEND_URL = 'http://192.168.88.108:3000';

export default function VoiceToMemeScreen() {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [meme, setMeme] = useState(null);
  const [transcription, setTranscription] = useState('');
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  const startRecording = async () => {
    try {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission refusée', "Autorise l'accès au microphone.");
        return;
      }
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setRecording(true);
    } catch (e) {
      Alert.alert('Erreur', e.message);
    }
  };

  const stopAndSend = async () => {
    try {
      await audioRecorder.stop();
      setRecording(false);
      setLoading(true);

      const uri = audioRecorder.uri;
      if (!uri) { Alert.alert('Erreur', 'Aucun audio enregistré.'); setLoading(false); return; }

      const formData = new FormData();
      formData.append('audio', {
        uri,
        type: 'audio/m4a',
        name: 'recording.m4a',
      });

      const response = await fetch(`${BACKEND_URL}/api/voice-to-meme`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = await response.json();
      setMeme(data.meme || 'Meme généré !');
      setTranscription(data.transcription || '');
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de joindre le backend.');
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Voice-to-Meme</Text>
      <Text style={styles.subtitle}>Enregistre ta voix → l'IA génère un meme</Text>

      <View style={styles.recorderBox}>
        {!recording ? (
          <TouchableOpacity style={styles.recordBtn} onPress={startRecording}>
            <Text style={styles.recordIcon}>🎙️</Text>
            <Text style={styles.recordBtnText}>Commencer l'enregistrement</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.recordBtn, styles.recordBtnActive]} onPress={stopAndSend}>
            <Text style={styles.recordIcon}>⏹️</Text>
            <Text style={styles.recordBtnText}>Arrêter et générer</Text>
          </TouchableOpacity>
        )}

        {recording && (
          <View style={styles.recordingIndicator}>
            <View style={styles.redDot} />
            <Text style={styles.recordingText}>Enregistrement en cours...</Text>
          </View>
        )}
      </View>

      {loading && (
        <View style={styles.loadingBox}>
          <ActivityIndicator color="#6C63FF" size="large" />
          <Text style={styles.loadingText}>Analyse en cours...</Text>
        </View>
      )}

      {transcription ? (
        <View style={styles.transcriptionCard}>
          <Text style={styles.transcriptionLabel}>Transcription :</Text>
          <Text style={styles.transcriptionText}>{transcription}</Text>
        </View>
      ) : null}

      {meme && (
        <MemeCard
          topText={transcription || ''}
          emoji="🎙️😂"
          bottomText={meme}
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
  recorderBox: {
    backgroundColor: '#fff', borderRadius: 14, padding: 24,
    alignItems: 'center', borderWidth: 0.5, borderColor: '#e0e0e0',
    marginBottom: 16,
  },
  recordBtn: {
    backgroundColor: '#6C63FF', borderRadius: 14,
    paddingVertical: 16, paddingHorizontal: 32,
    alignItems: 'center', width: '100%',
  },
  recordBtnActive: { backgroundColor: '#FF3B30' },
  recordIcon: { fontSize: 40, marginBottom: 8 },
  recordBtnText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  recordingIndicator: {
    flexDirection: 'row', alignItems: 'center', marginTop: 16,
  },
  redDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: '#FF3B30', marginRight: 8,
  },
  recordingText: { color: '#FF3B30', fontWeight: '600' },
  loadingBox: { alignItems: 'center', marginVertical: 20 },
  loadingText: { color: '#8e8e93', marginTop: 8 },
  transcriptionCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    marginBottom: 16, borderWidth: 0.5, borderColor: '#e0e0e0',
  },
  transcriptionLabel: { fontSize: 12, color: '#8e8e93', marginBottom: 6 },
  transcriptionText: { fontSize: 15, color: '#1c1c1e' },
});

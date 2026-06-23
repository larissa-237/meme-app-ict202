import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const features = [
  {
    id: 'context',
    icon: '💬',
    title: 'Context Reader',
    subtitle: 'Texte ou conversation → Meme',
    screen: 'ContextReader',
    color: '#6C63FF',
  },
  {
    id: 'voice',
    icon: '🎙️',
    title: 'Voice-to-Meme',
    subtitle: 'Note vocale → Meme humoristique',
    screen: 'VoiceToMeme',
    color: '#FF6B9D',
  },
  {
    id: 'status',
    icon: '🖼️',
    title: 'Status Remixer',
    subtitle: 'Image + texte IA → Meme',
    screen: 'StatusRemixer',
    color: '#34C759',
  },
  {
    id: 'faceswap',
    icon: '🤖',
    title: 'Face Swap Sticker',
    subtitle: 'Mets ton visage sur un sticker',
    screen: 'FaceSwap',
    color: '#FF9500',
  },
  {
    id: 'sticker',
    icon: '✨',
    title: 'Sticker depuis texte',
    subtitle: 'Conversation → Sticker IA',
    screen: 'StickerGen',
    color: '#5AC8FA',
  },
  {
    id: 'effects',
    icon: '🎨',
    title: 'Effets visuels',
    subtitle: 'Filtres et effets style CapCut',
    screen: 'Effects',
    color: '#AF52DE',
  },
];

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#6C63FF', '#FF6B9D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>AI Meme Studio</Text>
        <Text style={styles.headerSubtitle}>Génère des memes avec l'IA 🔥</Text>
      </LinearGradient>

      <Text style={styles.sectionLabel}>Choisir une fonctionnalité</Text>

      {features.map((feature) => (
        <TouchableOpacity
          key={feature.id}
          style={styles.card}
          onPress={() => navigation.navigate(feature.screen)}
        >
          <View style={[styles.iconBox, { backgroundColor: feature.color + '20' }]}>
            <Text style={styles.icon}>{feature.icon}</Text>
          </View>
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>{feature.title}</Text>
            <Text style={styles.cardSubtitle}>{feature.subtitle}</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f2f2f7' },
  content: { paddingBottom: 40 },
  header: {
    padding: 40,
    paddingTop: 60,
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8e8e93',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 14,
    padding: 16,
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  icon: { fontSize: 24 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1c1c1e', marginBottom: 2 },
  cardSubtitle: { fontSize: 13, color: '#8e8e93' },
  arrow: { fontSize: 22, color: '#c7c7cc', fontWeight: '300' },
});

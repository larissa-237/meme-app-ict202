# AI Meme Studio — Frontend React Native (Expo SDK 54)

## Stack
- React Native + Expo SDK 54
- Backend : Node.js/Express sur http://192.168.88.108:3000
- Branche : feat/status-remixer → PR vers main
- Repo : https://github.com/larissa-237/meme-app-ict202

## Fonctionnalités à implémenter

### PARTIE 1

**1. Navigation** (expo-router ou react-navigation)
- Toutes les routes de l'app
- HomeScreen avec accès à tous les écrans

**2. MemeCard** (`components/MemeCard.js`)
- Fond dégradé violet/rose
- Texte en haut, emojis au centre, texte en bas
- Capture via react-native-view-shot
- Bouton sauvegarde galerie (expo-media-library)

**3. Context Reader** (`screens/ContextReaderScreen.js`)
- Saisir ou coller un texte/extrait de conversation
- Optionnel : joindre une photo
- Envoyer à POST /api/context-reader → { text }
- Recevoir { meme } et afficher dans MemeCard
- Backend génère un sticker/meme selon le texte via IA multimodale

### PARTIE 2

**4. Voice-to-Meme** (`screens/VoiceToMemeScreen.js`)
- Enregistrer une note vocale (expo-audio)
- Envoyer audio à POST /api/voice-to-meme (multipart)
- Recevoir { meme } avec transcription + image humoristique
- Afficher dans MemeCard avec transcription en sous-titre

**5. Status Remixer** (`screens/StatusRemixerScreen.js`) ✅ FAIT
- Upload image depuis galerie (expo-image-picker)
- 3 filtres visuels : luminosité, contraste, N&B
- Envoyer image à POST /api/status-remixer
- Calque texte IA sur l'image
- Export PNG via expo-sharing

### PARTIE 3 — Bonus

**6. Face Swap sur Sticker**
- Importer un sticker (image PNG transparent)
- Importer une photo de visage
- Backend détecte et remplace le visage sur le sticker via IA
- Ajouter des éléments (ex: lunettes otaku) générés par IA
- Export nouveau sticker PNG

**7. Sticker depuis texte/conversation**
- Saisir texte ou coller conversation
- Optionnel : joindre une photo
- Backend génère un sticker via IA multimodale
- Export PNG

**8. Effets visuels avancés** (style CapCut)
- Filtres, effets, ajout de texte stylisé sur image
- Export PNG

**9. Share Intent**
- Recevoir image/texte depuis une autre app (WhatsApp etc.)
- Ouvrir directement dans Status Remixer ou Context Reader

**10. Génération image IA**
- Intégrer DALL-E ou Stable Diffusion via backend
- Créer l'image du meme à partir de zéro selon le contexte

**11. Localisation culturelle**
- IA adapte l'humour avec expressions/références camerounaises
- Option de langue : français, anglais, pidgin

## Composants communs
- MemeCard (`components/MemeCard.js`)
- FilterBar (`components/FilterBar.js`)
- ExportButton (`components/ExportButton.js`)

## Style imposé
- Couleur principale : #6C63FF
- Fond : #f2f2f7
- Cards : fond blanc, border-radius 14px
- Dividers : 0.5px solid #e0e0e0
- Font : System font (-apple-system)

## Règles
- Jamais appeler une API IA directement — tout passe par le backend
- Tester sur device Android réel
- Commit après chaque fonctionnalité

## Dépendances installées
- expo-image-picker
- expo-sharing
- expo-audio
- react-native-view-shot
- expo-media-library

## Routes backend disponibles
- POST /api/context-reader → { text } → { meme }
- POST /api/voice-to-meme → audio multipart → { meme }
- POST /api/status-remixer → image multipart → { meme }

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import ContextReaderScreen from '../screens/ContextReaderScreen';
import VoiceToMemeScreen from '../screens/VoiceToMemeScreen';
import StatusRemixerScreen from '../screens/StatusRemixerScreen';
import FaceSwapScreen from '../screens/FaceSwapScreen';
import StickerGenScreen from '../screens/StickerGenScreen';
import EffectsScreen from '../screens/EffectsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#6C63FF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'AI Meme Studio' }} />
        <Stack.Screen name="ContextReader" component={ContextReaderScreen} options={{ title: 'Context Reader' }} />
        <Stack.Screen name="VoiceToMeme" component={VoiceToMemeScreen} options={{ title: 'Voice-to-Meme' }} />
        <Stack.Screen name="StatusRemixer" component={StatusRemixerScreen} options={{ title: 'Status Remixer' }} />
        <Stack.Screen name="FaceSwap" component={FaceSwapScreen} options={{ title: 'Face Swap Sticker' }} />
        <Stack.Screen name="StickerGen" component={StickerGenScreen} options={{ title: 'Sticker depuis texte' }} />
        <Stack.Screen name="Effects" component={EffectsScreen} options={{ title: 'Effets visuels' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold, useFonts } from '@expo-google-fonts/plus-jakarta-sans';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import "../global.css";
import CustomSplashScreen from '../src/components/CustomSplashScreen';
import { ThemeProvider as AppThemeProvider } from '../src/context/ThemeContext';
import { store } from '../src/store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  const [loaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  const [isSplashFinished, setIsSplashFinished] = useState(false);

  useEffect(() => {
    if (loaded) {
      // Hide native splash screen once fonts are loaded
      // The CustomSplashScreen is already rendered and covering the screen
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={DefaultTheme}>
        <AppThemeProvider>
          <View style={{ flex: 1 }}>
            <Stack screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: '#fafaf9' },
              animation: 'fade_from_bottom',
            }} />
            {!isSplashFinished && (
              <CustomSplashScreen onFinish={() => setIsSplashFinished(true)} />
            )}
          </View>
          <StatusBar style="auto" />
        </AppThemeProvider>
      </ThemeProvider>
    </Provider>
  );
}

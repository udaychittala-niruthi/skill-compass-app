import { PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold, PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold, useFonts } from '@expo-google-fonts/plus-jakarta-sans';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import "../global.css";
import CustomSplashScreen from '../src/components/CustomSplashScreen';
import { ThemeProvider as AppThemeProvider } from '../src/context/ThemeContext';
import { ToastProvider } from '../src/context/ToastContext';
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
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider value={DefaultTheme}>
          <AppThemeProvider>
            <ToastProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider statusBarTranslucent navigationBarTranslucent>
                <Stack screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: '#fafaf9' },
                animation: 'fade_from_bottom',
              }} />
              {!isSplashFinished && (
                <CustomSplashScreen onFinish={() => setIsSplashFinished(true)} />
              )}
              </KeyboardProvider>
            </GestureHandlerRootView>
            <StatusBar style="auto" />
            </ToastProvider>
          </AppThemeProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

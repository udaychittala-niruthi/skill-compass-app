import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import '../global.css';
import { RootState } from '../src/store';

export default function SplashScreen() {
    const router = useRouter();
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    // In a real app, you might dispatch a 'checkAuth' thunk here that reads from storage

    useEffect(() => {
        const checkAuth = async () => {
            // Fake delay for splash
            await new Promise((resolve) => setTimeout(resolve, 2000));

            if (isAuthenticated) {
                router.replace('/(tabs)');
            } else {
                router.replace('/(auth)/login');
            }
        };

        checkAuth();
    }, [isAuthenticated, router]);

    return (
        <SafeAreaView className="flex-1 justify-center items-center bg-white dark:bg-black">
            <View className="items-center">
                <Text className="text-4xl font-bold text-blue-600 mb-4">Skill Compass</Text>
                <ActivityIndicator size="large" color="#2563eb" />
                <Text className="text-gray-500 mt-2">Loading...</Text>
            </View>
        </SafeAreaView>
    );
}

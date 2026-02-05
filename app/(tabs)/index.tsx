import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import '../../global.css';
import { RootState } from '../../src/store';
import { logout } from '../../src/store/slices/authSlice';

export default function HomeScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        router.replace('/(auth)/login');
    };

    return (
        <SafeAreaView>
            <View className="flex-1 bg-white dark:bg-black items-center justify-center p-6">

                <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to Skill Compass</Text>

                {user && (
                    <Text className="text-xl font-medium text-blue-600 mb-4">
                        Hello, {user.name}!
                    </Text>
                )}

                <Text className="text-gray-600 dark:text-gray-400 text-center mb-8">
                    This is the main application area. You are now logged in with Redux state.
                </Text>

                <TouchableOpacity
                    className="bg-red-500 px-6 py-3 rounded-lg active:bg-red-600"
                    onPress={handleLogout}
                >
                    <Text className="text-white font-semibold">Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

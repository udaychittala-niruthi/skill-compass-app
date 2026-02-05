import { MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import '../../global.css';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { PrimaryInput } from '../../src/components/PrimaryInput';
import { AppDispatch, RootState } from '../../src/store';
import { clearError, loginUser } from '../../src/store/slices/authSlice';

export default function LoginScreen() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/(tabs)');
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (error) {
            Alert.alert('Login Failed', error);
            dispatch(clearError());
        }
    }, [error]);

    const handleLogin = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }
        dispatch(loginUser({ email, password }));
    };

    return (
        <SafeAreaView className="flex-1 bg-background-neutral">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View className="flex-1 px-8 pt-4 pb-8">
                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-8">
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-sm border border-slate-100 active:scale-95"
                            >
                                <MaterialIcons name="arrow-back-ios" size={20} color="#475569" style={{ marginLeft: 6 }} />
                            </TouchableOpacity>
                            <View className="flex-row gap-1.5">
                                <View className="h-1.5 w-6 rounded-full bg-primary" />
                                <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                                <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                            </View>
                            <View className="w-12" />
                        </View>

                        {/* Illustration/Compass */}
                        <View className="items-center justify-center mb-10 mt-4 relative">
                            <View className="w-40 h-40 rounded-full items-center justify-center shadow-lg shadow-blue-500/50">
                                <View className="relative items-center justify-center border border-white/50 w-fit h-fit rounded-full">
                                    <MaterialIcons name="explore" size={90} color="#3b82f6" />
                                </View>
                            </View>
                        </View>

                        {/* Content */}
                        <View className="items-center mb-10">
                            <Text className="text-3xl font-extrabold text-slate-900 mb-3 text-center">
                                Welcome Back
                            </Text>
                            <Text className="text-slate-500 font-medium text-center text-base">
                                Ready to continue your personalized learning journey?
                            </Text>
                        </View>

                        {/* Form */}
                        <View className="w-full space-y-4 gap-5">
                            <PrimaryInput
                                placeholder="Email Address"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                iconName="alternate-email"
                            />

                            <PrimaryInput
                                placeholder="Password"
                                value={password}
                                onChangeText={setPassword}
                                isPassword
                                iconName="lock"
                            />

                            <View className="flex-row justify-end mt-2">
                                <Link href="/(auth)/login" asChild>
                                    <TouchableOpacity>
                                        <Text className="text-sm font-bold text-primary">Forgot password?</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        </View>

                        {/* Footer */}
                        <View className="mt-auto pt-12">
                            <PrimaryButton
                                title={loading ? "Signing In..." : "Sign In"}
                                onPress={handleLogin}
                                disabled={loading}
                                iconName="login"
                            />

                            <View className="flex-row justify-center mt-8">
                                <Text className="text-slate-500 font-medium text-sm">
                                    Don't have an account?{' '}
                                </Text>
                                <Link href="/(auth)/register" asChild>
                                    <TouchableOpacity>
                                        <Text className="text-primary font-bold ml-1 text-sm">Create Account</Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

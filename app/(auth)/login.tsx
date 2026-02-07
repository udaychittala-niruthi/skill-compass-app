import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Link, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import '../../global.css';
import { CustomToast } from '../../src/components/CustomToast';
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
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    // Toast State
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastStatus, setToastStatus] = useState<'success' | 'error' | 'info' | 'warning'>('info');

    const showToast = (message: string, status: 'success' | 'error' | 'info' | 'warning' = 'info') => {
        setToastMessage(message);
        setToastStatus(status);
        setToastVisible(true);
        setTimeout(() => setToastVisible(false), 3000);
    };

    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/(tabs)');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (error) {
            showToast(error, 'error');
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const validate = () => {
        let valid = true;
        let newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
            valid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleLogin = () => {
        if (validate()) {
            dispatch(loginUser({ email, password }));
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-neutral relative">
            {/* Toast Container */}
            {/* Toast Container */}
            {toastVisible && (
                <CustomToast
                    id="login-toast"
                    title={toastStatus === 'error' ? 'Error' : 'Notification'}
                    description={toastMessage}
                    status={toastStatus}
                    className="absolute top-12 left-0 right-0 z-50 shadow-lg"
                />
            )}

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
                        <View className="items-center justify-center mb-10 mt-8 relative">
                            {/* Light Well Background */}
                            <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-blue-500/10" />

                            {/* Glass Card Container */}
                            <BlurView
                                intensity={20}
                                tint="light"
                                className="w-40 h-40 rounded-full items-center justify-center overflow-hidden border border-white/50 bg-white/40"
                            >
                                <View className="items-center justify-center relative w-full h-full">
                                    {/* Layer 1: Glow / Back */}
                                    <View className="absolute items-center justify-center opacity-20 scale-110">
                                        <MaterialIcons name="explore" size={96} color="#2563eb" />
                                    </View>

                                    {/* Layer 2: Main Icon */}
                                    <View className="absolute items-center justify-center">
                                        <MaterialIcons name="explore" size={90} color="rgba(59, 130, 246, 0.8)" />
                                    </View>

                                    {/* Layer 3: Highlight / Overlay */}
                                    <View className="absolute items-center justify-center translate-x-0.5 translate-y-0.5">
                                        <MaterialIcons name="explore" size={90} color="rgba(96, 165, 250, 0.4)" />
                                    </View>
                                </View>
                            </BlurView>
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
                                onChangeText={(text) => { setEmail(text); setErrors({ ...errors, email: '' }); }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                iconName="alternate-email"
                                errorMessage={errors.email}
                            />

                            <PrimaryInput
                                placeholder="Password"
                                value={password}
                                onChangeText={(text) => { setPassword(text); setErrors({ ...errors, password: '' }); }}
                                isPassword
                                iconName="lock"
                                errorMessage={errors.password}
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
                                    Don&apos;t have an account?{' '}
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

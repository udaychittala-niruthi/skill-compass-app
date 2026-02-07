import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import '../../global.css';
import { CustomToast } from '../../src/components/CustomToast';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { PrimaryInput } from '../../src/components/PrimaryInput';
import { useTheme } from '../../src/context/ThemeContext';
import { AppDispatch, RootState } from '../../src/store';
import { clearError, registerUser } from '../../src/store/slices/authSlice';

export default function RegisterScreen() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const { colors } = useTheme(); // Use theme hook

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({});

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
            router.replace('/(onboarding)/age');
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
        let newErrors: { name?: string; email?: string; password?: string; confirmPassword?: string } = {};

        if (!name) {
            newErrors.name = 'Name is required';
            valid = false;
        }

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
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            valid = false;
        }

        if (confirmPassword !== password) {
            newErrors.confirmPassword = 'Passwords do not match';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleRegister = () => {
        if (validate()) {
            dispatch(registerUser({ name, email, password }));
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-neutral relative">
            {/* Toast Container */}
            {toastVisible && (
                <CustomToast
                    id="register-toast"
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
                        <View className="flex-row items-center justify-between mb-2">
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-sm border border-slate-100 active:scale-95"
                            >
                                <MaterialIcons name="arrow-back-ios" size={20} color={colors.text || "#475569"} style={{ marginLeft: 6 }} />
                            </TouchableOpacity>
                            <View className="flex-row gap-1.5">
                                <View className="h-1.5 w-6 rounded-full bg-primary" />
                                <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                                <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                            </View>
                            <View className="w-12" />
                        </View>

                        {/* Illustration/Shield */}
                        <View className="items-center justify-center mb-8 mt-2 relative">
                            {/* Light well effects */}

                            <LinearGradient
                                colors={['#60a5fa', '#2563eb']} // Shield gradient can remain hardcoded or mapped to primary-light/primary
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                className="w-32 h-32 rounded-3xl items-center justify-center shadow-lg shadow-blue-600/30 rotate-12"
                                style={{ transform: [{ rotate: '12deg' }], borderRadius: 24 }}
                            >
                                <View className="p-4 border rounded-2xl border-white/30 bg-white/20">
                                    <MaterialIcons name="verified-user" size={48} color="white" />
                                </View>
                            </LinearGradient>
                        </View>

                        <View className="items-center mb-8">
                            <Text className="text-3xl font-extrabold text-slate-900 mb-3 text-center">
                                Create Account
                            </Text>
                            <Text className="text-slate-500 font-medium text-center">
                                Join the AI learning journey
                            </Text>
                        </View>

                        <View className="w-full space-y-4 gap-4">
                            <View>
                                <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Full Name</Text>
                                <PrimaryInput
                                    placeholder="Alex Thompson"
                                    value={name}
                                    onChangeText={(text) => { setName(text); setErrors({ ...errors, name: '' }); }}
                                    autoCapitalize="words"
                                    iconName="person-outline"
                                    errorMessage={errors.name}
                                />
                            </View>

                            <View>
                                <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Email Address</Text>
                                <PrimaryInput
                                    placeholder="alex@example.com"
                                    value={email}
                                    onChangeText={(text) => { setEmail(text); setErrors({ ...errors, email: '' }); }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    iconName="alternate-email"
                                    errorMessage={errors.email}
                                />
                            </View>

                            <View>
                                <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Password</Text>
                                <PrimaryInput
                                    placeholder="••••••••"
                                    value={password}
                                    onChangeText={(text) => { setPassword(text); setErrors({ ...errors, password: '', confirmPassword: '' }); }}
                                    isPassword
                                    iconName="lock-outline"
                                    errorMessage={errors.password}
                                />
                            </View>

                            <View>
                                <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1">Confirm Password</Text>
                                <PrimaryInput
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChangeText={(text) => { setConfirmPassword(text); setErrors({ ...errors, confirmPassword: '' }); }}
                                    isPassword
                                    iconName="lock-outline"
                                    errorMessage={errors.confirmPassword}
                                />
                            </View>

                            <Text className="text-xs text-center text-slate-400 mt-2 px-4 leading-5">
                                By continuing, you agree to our <Text className="text-primary font-bold">Terms of Service</Text> and <Text className="text-primary font-bold">Privacy Policy</Text>.
                            </Text>

                        </View>

                        {/* Footer */}
                        <View className="mt-auto pt-12">
                            <PrimaryButton
                                title={loading ? "Creating Account..." : "Continue"}
                                onPress={handleRegister}
                                disabled={loading}
                                iconName="arrow-forward"
                            />

                            <View className="flex-row justify-center mt-8">
                                <Text className="text-slate-500 font-medium text-sm">
                                    Already have an account?{' '}
                                </Text>
                                <TouchableOpacity onPress={() => router.back()}>
                                    <Text className="text-primary font-bold ml-1 text-sm">Sign In</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

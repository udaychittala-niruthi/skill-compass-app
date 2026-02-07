import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode, JwtPayload } from "jwt-decode";
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming
} from 'react-native-reanimated';

interface MyTokenPayload extends JwtPayload {
    id: number;
    email: string;
    role: "USER" | "ADMIN";
    age: number | null;
    group: "KIDS" | "TEENS" | "COLLEGE_STUDENTS" | "PROFESSIONALS" | "SENIORS" | null;
    isOnboarded: boolean;
}

interface CustomSplashScreenProps {
    onFinish: () => void;
}

const SPLASH_DURATION = 2000; // Total duration in ms

export default function CustomSplashScreen({ onFinish }: CustomSplashScreenProps) {
    const opacity = useSharedValue(1);
    const scale = useSharedValue(0.9);

    useEffect(() => {
        // Start entrance animation
        scale.value = withTiming(1, { duration: 1000 });

        const checkTokenAndRedirect = async () => {
            try {
                const token = await SecureStore.getItemAsync('authToken');

                if (!token) {
                    // No token, redirect to Login
                    setTimeout(() => {
                        opacity.value = withTiming(0, { duration: 500 }, (finished) => {
                            if (finished) runOnJS(router.replace)('/(auth)/login');
                        });
                    }, SPLASH_DURATION);
                    return;
                }

                // Decode token
                try {
                    const decoded = jwtDecode<MyTokenPayload>(token);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp && decoded.exp < currentTime) {
                        // Token expired
                        await SecureStore.deleteItemAsync('authToken');
                        setTimeout(() => {
                            opacity.value = withTiming(0, { duration: 500 }, (finished) => {
                                if (finished) runOnJS(router.replace)('/(auth)/login');
                            });
                        }, SPLASH_DURATION);
                        return;
                    }

                    // Token valid, check status
                    if (!decoded.isOnboarded) {
                        if (!decoded.age) {
                            setTimeout(() => {
                                opacity.value = withTiming(0, { duration: 500 }, (finished) => {
                                    if (finished) runOnJS(router.replace)('/(onboarding)/age');
                                });
                            }, SPLASH_DURATION);
                        } else {
                            // Has age but not fully onboarded - redirect to next step or Age if simplify
                            // For now, redirect to Age as entry point for onboarding flow if not complete
                            setTimeout(() => {
                                opacity.value = withTiming(0, { duration: 500 }, (finished) => {
                                    if (finished) runOnJS(router.replace)('/(onboarding)/age');
                                });
                            }, SPLASH_DURATION);
                        }
                    } else {
                        // Onboarded
                        setTimeout(() => {
                            opacity.value = withTiming(0, { duration: 500 }, (finished) => {
                                if (finished) runOnJS(router.replace)('/(tabs)');
                            });
                        }, SPLASH_DURATION);
                    }

                } catch (decodeError) {
                    console.error('Token decode error:', decodeError);
                    // Invalid token format
                    await SecureStore.deleteItemAsync('authToken');
                    setTimeout(() => {
                        opacity.value = withTiming(0, { duration: 500 }, (finished) => {
                            if (finished) runOnJS(router.replace)('/(auth)/login');
                        });
                    }, SPLASH_DURATION);
                }

            } catch (error) {
                // Storage error or other issue
                console.error('Splash screen error:', error);
                setTimeout(() => {
                    opacity.value = withTiming(0, { duration: 500 }, (finished) => {
                        if (finished) runOnJS(router.replace)('/(auth)/login');
                    });
                }, SPLASH_DURATION);
            }
        };

        checkTokenAndRedirect();

    }, [opacity, scale]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
            transform: [{ scale: scale.value }],
        };
    });

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#ffffff', '#f0f0f0']} // Subtle gradient for background
                style={StyleSheet.absoluteFill}
            />

            {/* Ambient Glow */}
            <View style={styles.glowContainer}>
                <LinearGradient
                    colors={['rgba(79, 70, 229, 0.15)', 'transparent']}
                    style={styles.glow}
                    start={{ x: 0.5, y: 0.5 }}
                    end={{ x: 1, y: 1 }}
                />
            </View>

            <Animated.View style={[styles.content, animatedStyle]}>
                {/* Placeholder for Logo - You can replace this with an Image */}
                <View style={styles.logoContainer}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoText}>SC</Text>
                    </View>
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.title}>Skill Compass</Text>
                    <Text style={styles.subtitle}>Navigate your future</Text>
                </View>
            </Animated.View>
        </View>
    );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99999,
        backgroundColor: '#ffffff', // Fallback
    },
    glowContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    glow: {
        width: width * 1.5,
        height: width * 1.5,
        borderRadius: width * 0.75,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        marginBottom: 24,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 30,
        backgroundColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#4F46E5',
        fontFamily: 'PlusJakartaSans_700Bold',
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontFamily: 'PlusJakartaSans_700Bold',
        color: '#1e293b',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'PlusJakartaSans_500Medium',
        color: '#64748b',
    },
});

import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useEffect } from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { useTheme } from '../../src/context/ThemeContext';
import { AppDispatch, RootState } from '../../src/store';
import { fetchMyLearningPath, regeneratePath } from '../../src/store/slices/learningSlice';

const { width } = Dimensions.get('window');

const DashboardHeader = ({ user, colors, router, onRegenerate, isRegenerating }: { user: any, colors: any, router: any, onRegenerate: () => void, isRegenerating: boolean }) => {
    return (
        <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800 }}
            className="flex-row items-center justify-between px-6 pb-6 pt-2"
        >
            <View className="flex-row items-center gap-4">
                <TouchableOpacity
                    onPress={() => router.push('/profile')}
                    activeOpacity={0.8}
                    className="w-14 h-14 rounded-full border-2 border-white shadow-sm overflow-hidden bg-slate-100 items-center justify-center"
                >
                    {user?.hero ? (
                        <Image
                            source={{ uri: user.hero.startsWith('http') ? user.hero : `https://avatar.iran.liara.run/public/boy?username=${user.name}` }}
                            className="w-full h-full"
                        />
                    ) : (
                        <MaterialIcons name="person" size={32} color={colors['--muted-foreground']} />
                    )}
                </TouchableOpacity>
                <View>
                    <Text style={{ color: colors.text }} className="text-xl font-black tracking-tight">
                        Yo {user?.name?.split(' ')[0] || 'Learning Buddy'}!
                    </Text>
                    <Text style={{ color: colors['text-secondary'] }} className="text-sm font-medium">
                        Your path is ready.
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={onRegenerate}
                disabled={isRegenerating}
                className="bg-slate-900 w-10 h-10 rounded-full items-center justify-center shadow-lg"
            >
                {isRegenerating ? (
                    <ActivityIndicator size="small" color="#facc15" />
                ) : (
                    <MaterialIcons name="auto-awesome" size={20} color="#facc15" />
                )}
            </TouchableOpacity>

            <View className="bg-slate-900 px-4 py-2 rounded-full flex-row items-center gap-2 shadow-lg">
                <MaterialIcons name="bolt" size={18} color="#facc15" />
                <Text className="text-white font-black text-sm uppercase tracking-wider">
                    2,450 XP
                </Text>
            </View>
        </MotiView>
    );
};

const FeaturedCard = ({ learningPath, colors }: { learningPath: any, colors: any }) => {
    const title = learningPath?.name || "Mastering Your Skills";
    const description = learningPath?.path?.description || "Your AI-curated roadmap to success.";
    const months = learningPath?.path?.metadata?.estimatedCompletionMonths || 6;

    return (
        <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 1000, delay: 200 }}
            className="px-6 mb-8"
        >
            <LinearGradient
                colors={[colors['--primary'], colors['--accent']]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ borderRadius: 24, padding: 24 }}
                className="shadow-xl shadow-indigo-200"
            >
                <View className="flex-row gap-2 mb-4">
                    <BlurView intensity={20} tint="light" className="px-3 py-1 rounded-full border border-white/30 overflow-hidden">
                        <Text className="text-white text-[10px] font-black uppercase tracking-wider">
                            Personalized Path
                        </Text>
                    </BlurView>
                    <BlurView intensity={20} tint="light" className="px-3 py-1 rounded-full border border-white/30 overflow-hidden">
                        <Text className="text-white text-[10px] font-black uppercase tracking-wider">
                            {months} Months
                        </Text>
                    </BlurView>
                </View>

                <Text className="text-white text-3xl font-black mb-2 tracking-tight">
                    {title}
                </Text>
                <Text className="text-white/80 text-base font-medium leading-relaxed">
                    {description.length > 100 ? description.substring(0, 100) + '...' : description}
                </Text>
            </LinearGradient>
        </MotiView>
    );
};

const ModuleItem = ({ module, index, isLast, colors, onPress }: { module: any, index: number, isLast: boolean, colors: any, onPress: () => void }) => {
    const isLocked = index > 0;

    return (
        <View className="flex-row px-6 mb-2">
            {/* Timeline Line */}
            <View className="items-center mr-6">
                <View
                    style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: isLocked ? '#e2e8f0' : colors['--primary'],
                        zIndex: 1,
                        marginTop: 40
                    }}
                />
                {!isLast && (
                    <View
                        style={{
                            width: 2,
                            flex: 1,
                            backgroundColor: '#e2e8f0',
                            marginTop: -10
                        }}
                    />
                )}
            </View>

            {/* Content Card */}
            <MotiView
                from={{ opacity: 0, translateX: 30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 600, delay: 400 + index * 100 }}
                className="flex-1 pb-10"
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={onPress}
                    className={`bg-white/60 rounded-3xl overflow-hidden border border-white shadow-sm ${isLocked ? 'opacity-60' : ''}`}
                >
                    <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                    <View className="h-44 w-full bg-slate-200 relative">
                        <Image
                            source={{ uri: module.thumbnailUrl || 'https://picsum.photos/400/200' }}
                            className="w-full h-full"
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.7)']}
                            className="absolute bottom-0 left-0 right-0 h-24"
                        />

                        <View className="absolute bottom-4 left-4 flex-row gap-2">
                            <BlurView intensity={30} tint="dark" className="px-2 py-1 rounded-md flex-row items-center gap-1 overflow-hidden">
                                <MaterialIcons name="play-circle-filled" size={14} color="white" />
                                <Text className="text-white text-[10px] font-bold uppercase">{module.format}</Text>
                            </BlurView>
                            <BlurView intensity={30} tint="light" className="px-2 py-1 rounded-md overflow-hidden">
                                <Text className="text-slate-900 text-[10px] font-bold uppercase">{module.difficulty}</Text>
                            </BlurView>
                        </View>
                    </View>

                    <View className="p-5 flex-row items-center justify-between">
                        <View className="flex-1 mr-4">
                            <Text style={{ color: colors.text }} className="text-lg font-black leading-tight mb-1">
                                {module.title}
                            </Text>
                            <Text style={{ color: colors['text-secondary'] }} className="text-xs font-bold uppercase tracking-wider">
                                {module.duration} mins • {module.category}
                            </Text>
                        </View>

                        <View
                            style={{ backgroundColor: isLocked ? 'rgba(226, 232, 240, 0.8)' : colors['--primary'] }}
                            className="w-12 h-12 rounded-2xl items-center justify-center shadow-lg"
                        >
                            <Ionicons
                                name={isLocked ? "lock-closed" : "play"}
                                size={22}
                                color={isLocked ? "#94a3b8" : "white"}
                                style={!isLocked ? { marginLeft: 3 } : {}}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </MotiView>
        </View>
    );
};

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { colors } = useTheme();
    const user = useSelector((state: RootState) => state.auth.user);
    const { learningPath, loading } = useSelector((state: RootState) => state.learning);

    useEffect(() => {
        if (!learningPath) {
            dispatch(fetchMyLearningPath());
        }
    }, [dispatch, learningPath]);

    const modules = learningPath?.modules || [];

    if (loading && !learningPath) {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <ActivityIndicator size="large" color={colors['--primary']} />
                <Text className="text-slate-400 mt-4 font-bold">Summoning your journey...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#fcfcfc' }}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: insets.top + 20,
                    paddingBottom: insets.bottom + 40
                }}
            >
                <DashboardHeader
                    user={user}
                    colors={colors}
                    router={router}
                    onRegenerate={() => dispatch(regeneratePath())}
                    isRegenerating={loading}
                />

                <FeaturedCard learningPath={learningPath} colors={colors} />

                <View className="px-6 mb-6">
                    <Text style={{ color: colors.text }} className="text-xl font-black tracking-tight">
                        Learning Path
                    </Text>
                </View>

                {learningPath?.status === 'failed' ? (
                    <View className="px-6 mb-8">
                        <View className="bg-red-50 p-6 rounded-3xl border border-red-100 items-center">
                            <View className="w-16 h-16 bg-red-100 rounded-2xl items-center justify-center mb-4">
                                <MaterialIcons name="error-outline" size={32} color="#ef4444" />
                            </View>
                            <Text className="text-slate-900 font-black text-xl text-center mb-2">Generation Failed</Text>
                            <Text className="text-slate-500 text-center mb-6 font-medium">
                                Something went wrong while crafting your path. Let's try regenerating it.
                                {learningPath.generationError && `\n\nReason: ${learningPath.generationError}`}
                            </Text>
                            <TouchableOpacity
                                onPress={() => dispatch(regeneratePath())}
                                disabled={loading}
                                style={{ backgroundColor: colors['--primary'] }}
                                className="px-8 py-4 rounded-2xl flex-row items-center gap-3 shadow-lg"
                            >
                                {loading ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <>
                                        <MaterialIcons name="auto-awesome" size={20} color="white" />
                                        <Text className="text-white font-bold text-lg">Regenerate Now</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : modules.length > 0 ? (
                    modules.map((module: any, index: number) => (
                        <ModuleItem
                            key={module.id}
                            module={module}
                            index={index}
                            isLast={index === modules.length - 1}
                            colors={colors}
                            onPress={() => router.push(`/modules/${module.id}` as any)}
                        />
                    ))
                ) : (
                    <View className="px-6 items-center justify-center py-20">
                        <MaterialIcons name="auto-awesome" size={48} color={colors['--muted-foreground']} />
                        <Text className="text-slate-400 font-bold mt-4 text-center">
                            Your AI Path is being crafted...
                        </Text>
                        <TouchableOpacity
                            onPress={() => dispatch(fetchMyLearningPath())}
                            className="mt-4"
                        >
                            <Text style={{ color: colors['--primary'] }} className="font-bold">Check Status</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            {/* Floating Action Button */}
            <View
                style={{
                    position: 'absolute',
                    bottom: insets.bottom + 20,
                    left: 20,
                    right: 20,
                }}
            >
                <PrimaryButton
                    title="Continue Learning"
                    iconName="bolt"
                    onPress={() => modules[0] && router.push(`/modules/${modules[0].id}` as any)}
                />
            </View>
        </View>
    );
}

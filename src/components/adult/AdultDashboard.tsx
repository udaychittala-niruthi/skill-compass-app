import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import React from 'react';
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { AIChatButton } from '../ai-chat';
import { PrimaryButton } from '../PrimaryButton';

const { width } = Dimensions.get('window');

const DashboardHeader = ({ user, colors, onRegenerate, isRegenerating, onProfilePress }: any) => {
    return (
        <MotiView
            from={{ opacity: 0, translateY: -20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800 }}
            className="flex-row items-center justify-between px-6 pb-6 pt-2"
        >
            <View className="flex-row items-center gap-4">
                <TouchableOpacity
                    onPress={onProfilePress}
                    activeOpacity={0.8}
                    className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-sm"
                >
                    {user?.hero ? (
                        <Image
                            source={{ uri: user.hero.startsWith('http') ? user.hero : `https://avatar.iran.liara.run/public/boy?username=${user.name}` }}
                            className="w-full h-full"
                        />
                    ) : (
                        <View className="w-full h-full items-center justify-center bg-slate-100">
                            <MaterialIcons name="person" size={32} color={colors['--muted-foreground'] || '#64748B'} />
                        </View>
                    )}
                </TouchableOpacity>
                <View>
                    <Text className="text-xl font-black tracking-tight text-slate-900">
                        Yo {user?.name?.split(' ')[0] || 'Learning Buddy'}!
                    </Text>
                    <Text className="text-sm font-medium text-slate-500">
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

const FeaturedCard = ({ learningPath, colors }: any) => {
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
                colors={[colors['--primary'] || '#4F46E5', colors['--accent'] || '#8B5CF6']}
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

const ModuleItem = ({ module, index, isLast, colors, onPress }: any) => {
    const isLocked = index > 0;

    return (
        <View className="flex-row px-6 mb-2">
            <View className="items-center mr-6">
                <View
                    className={`w-3 h-3 rounded-full z-10 mt-10 ${isLocked ? 'bg-slate-200' : 'bg-indigo-600'}`}
                />
                {!isLast && (
                    <View className="w-0.5 flex-1 bg-slate-200 -mt-2.5" />
                )}
            </View>

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
                    <BlurView intensity={20} tint="light" className="absolute inset-0" />
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
                            <Text className="text-lg font-black leading-tight mb-1 text-slate-900">
                                {module.title}
                            </Text>
                            <Text className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                {module.duration} mins • {module.category}
                            </Text>
                        </View>

                        <View
                            className={`w-12 h-12 rounded-2xl items-center justify-center shadow-lg ${isLocked ? 'bg-slate-100 opacity-80' : 'bg-indigo-600'}`}
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

export const AdultDashboard = ({ insets, router, dispatch, colors, user, learningPath, loading, modules, onProfilePress, onRegenerate, onFetchPath }: any) => {
    return (
        <View className="flex-1 bg-slate-50">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: insets.top + 20,
                    paddingBottom: insets.bottom + 100 // Extra padding for FAB
                }}
            >
                <DashboardHeader
                    user={user}
                    colors={colors}
                    onRegenerate={onRegenerate}
                    isRegenerating={loading}
                    onProfilePress={onProfilePress}
                />

                <FeaturedCard learningPath={learningPath} colors={colors} />

                <View className="px-6 mb-6">
                    <Text className="text-xl font-black tracking-tight text-slate-900">
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
                                onPress={onRegenerate}
                                disabled={loading}
                                className="px-8 py-4 rounded-2xl flex-row items-center gap-3 shadow-lg bg-indigo-600"
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
                        <MaterialIcons name="auto-awesome" size={48} color="#94A3B8" />
                        <Text className="text-slate-400 font-bold mt-4 text-center">
                            Your AI Path is being crafted...
                        </Text>
                        <TouchableOpacity
                            onPress={onFetchPath}
                            className="mt-4"
                        >
                            <Text className="font-bold text-indigo-600">Check Status</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <View
                className="absolute left-5 right-5"
                style={{ bottom: insets.bottom + 20 }}
            >
                <PrimaryButton
                    title="Continue Learning"
                    iconName="bolt"
                    onPress={() => modules[0] && router.push(`/modules/${modules[0].id}` as any)}
                />
            </View>

            <AIChatButton position={{ bottom: insets.bottom + 90, right: 20 }} />
        </View>
    );
};

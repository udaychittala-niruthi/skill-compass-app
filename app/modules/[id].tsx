import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as FileSystem from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { MotiView } from 'moti';
import React, { useRef, useState } from 'react';
import { Alert, Dimensions, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { useTheme } from '../../src/context/ThemeContext';
import { AppDispatch, RootState } from '../../src/store';
import { fetchModuleById } from '../../src/store/slices/learningSlice';

const { width } = Dimensions.get('window');

// Helper to extract YouTube video ID
const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
};

export default function ModuleDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const [autoplay, setAutoplay] = useState(0);
    const scrollRef = useRef<ScrollView>(null);
    const videoSectionRef = useRef<View>(null);

    // Find module in state
    const { currentModules, learningPath, activeModule, loading } = useSelector((state: RootState) => state.learning);

    React.useEffect(() => {
        if (id) {
            dispatch(fetchModuleById(id as string));
        }
    }, [id, dispatch]);

    const allModules = [...(currentModules || []), ...(learningPath?.modules || [])];
    const module = (activeModule && (activeModule.id === Number(id) || activeModule.id === id))
        ? activeModule
        : allModules.find(m => m.id === Number(id) || m.id === id);

    if (loading && !module) {
        return (
            <View className="flex-1 bg-white items-center justify-center p-6">
                <MotiView
                    from={{ opacity: 0.5, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        type: 'timing',
                        duration: 1000,
                        loop: true,
                    }}
                >
                    <MaterialIcons name="auto-stories" size={64} color="#3b82f6" />
                </MotiView>
                <Text className="text-lg font-medium mt-4 text-slate-500">Loading module details...</Text>
            </View>
        );
    }

    if (!module) {
        return (
            <View className="flex-1 bg-white items-center justify-center p-6">
                <MaterialIcons name="error-outline" size={64} color="#ef4444" />
                <Text className="text-xl font-bold mt-4 text-center">Module not found</Text>
                <TouchableOpacity onPress={() => router.back()} className="mt-6">
                    <Text className="text-blue-600 font-bold">Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const youtubeId = module.contentUrl ? getYouTubeVideoId(module.contentUrl) : null;

    // Check multiple possible locations for resources
    const pdfResources = module.resources || module.generationMetadata?.pdfResources || module.pdfResources || [];

    const handleDownloadResource = async (resourceUrl: string, fileName: string) => {
        try {
            const downloadResumable = FileSystem.createDownloadResumable(
                resourceUrl,
                FileSystem.documentDirectory + fileName
            );

            const result = await downloadResumable.downloadAsync();
            if (result && result.uri) {
                const canShare = await Sharing.isAvailableAsync();
                if (canShare) {
                    await Sharing.shareAsync(result.uri);
                } else {
                    Alert.alert('Success', 'File downloaded successfully!');
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to download resource');
            console.error(error);
        }
    };

    const handleStartLearning = () => {
        if (module.format === 'video' && module.contentUrl) {
            Linking.openURL(module.contentUrl);
        } else {
            Alert.alert('Coming Soon', 'This learning module will be available soon!');
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
            >
                {/* Hero / Thumbnail section */}
                <View className="relative h-80 w-full">
                    <Image
                        source={{ uri: module.thumbnailUrl || 'https://picsum.photos/800/400' }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.8)']}
                        className="absolute inset-0"
                    />

                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ top: insets.top + 10, left: 20 }}
                        className="absolute w-10 h-10 rounded-full bg-white/20 items-center justify-center border border-white/30"
                    >
                        <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />
                        <MaterialIcons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>

                    <View className="absolute bottom-6 left-6 right-6">
                        <View className="flex-row gap-2 mb-3">
                            <BlurView intensity={30} tint="light" className="px-3 py-1 rounded-full border border-white/20 overflow-hidden">
                                <Text className="text-white text-[10px] font-black uppercase tracking-wider">{module.difficulty}</Text>
                            </BlurView>
                            <BlurView intensity={30} tint="light" className="px-3 py-1 rounded-full border border-white/20 overflow-hidden">
                                <Text className="text-white text-[10px] font-black uppercase tracking-wider">{module.format}</Text>
                            </BlurView>
                        </View>
                        <Text className="text-white text-3xl font-black leading-tight shadow-sm">
                            {module.title}
                        </Text>
                    </View>
                </View>

                {/* Content section */}
                <View className="px-6 pt-8">
                    <MotiView
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ duration: 600 }}
                    >
                        <View className="flex-row items-center gap-6 mb-8">
                            <View className="items-center">
                                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Duration</Text>
                                <Text className="text-slate-900 font-bold text-lg">{module.duration}m</Text>
                            </View>
                            <View className="w-[1px] h-8 bg-slate-200" />
                            <View className="items-center">
                                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Category</Text>
                                <Text className="text-slate-900 font-bold text-lg">{module.category || 'General'}</Text>
                            </View>
                            <View className="w-[1px] h-8 bg-slate-200" />
                            <View className="items-center">
                                <Text className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Format</Text>
                                <Text className="text-slate-900 font-bold text-lg capitalize">{module.format}</Text>
                            </View>
                        </View>

                        <Text className="text-slate-900 text-xl font-black mb-4">About this module</Text>
                        <Text className="text-slate-500 text-base leading-relaxed mb-8">
                            {module.description}
                        </Text>

                        {/* YouTube Link Section */}
                        {module.format === 'video' && module.contentUrl && (
                            <View className="mb-8">
                                <Text className="text-slate-900 text-lg font-black mb-4">Course Video</Text>
                                <TouchableOpacity
                                    onPress={() => Linking.openURL(module.contentUrl)}
                                    className="bg-red-50 p-6 rounded-3xl border border-red-100 flex-row items-center justify-between"
                                    activeOpacity={0.8}
                                >
                                    <View className="flex-row items-center flex-1 pr-4">
                                        <View className="w-14 h-14 bg-red-500 rounded-2xl items-center justify-center mr-4 shadow-lg shadow-red-200">
                                            <MaterialIcons name="play-arrow" size={32} color="white" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-slate-900 font-black text-sm">Watch on YouTube</Text>
                                            <Text className="text-slate-500 text-xs font-medium" numberOfLines={1}>
                                                {module.contentUrl}
                                            </Text>
                                        </View>
                                    </View>
                                    <View className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-slate-100">
                                        <MaterialIcons name="launch" size={18} color="#ef4444" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Resources Section */}
                        {pdfResources && pdfResources.length > 0 && (
                            <View className="mb-8">
                                <Text className="text-slate-900 text-lg font-black mb-4">Resources</Text>
                                {pdfResources.map((resource: any, index: number) => (
                                    <View key={index} className="bg-white/80 rounded-2xl p-4 mb-3 border border-white shadow-sm overflow-hidden">
                                        <BlurView intensity={10} tint="light" style={StyleSheet.absoluteFill} />
                                        <View className="flex-row items-center justify-between">
                                            <View className="flex-row items-center flex-1 mr-4">
                                                <View className="w-12 h-12 rounded-xl bg-red-100 items-center justify-center mr-3">
                                                    <MaterialIcons name="picture-as-pdf" size={24} color="#ef4444" />
                                                </View>
                                                <View className="flex-1">
                                                    <Text className="text-slate-900 font-black text-sm" numberOfLines={1}>
                                                        {resource.title || `Resource ${index + 1}`}
                                                    </Text>
                                                    <Text className="text-slate-400 text-xs font-bold uppercase tracking-tighter">PDF Document</Text>
                                                </View>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => handleDownloadResource(resource.url || resource.link, resource.title ? `${resource.title}.pdf` : `resource_${index + 1}.pdf`)}
                                                className="w-10 h-10 rounded-xl bg-blue-500 items-center justify-center shadow-md shadow-blue-200"
                                            >
                                                <MaterialIcons name="download" size={20} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Skills covered */}
                        {module.skillTags && module.skillTags.length > 0 && (
                            <View className="mb-8">
                                <Text className="text-slate-900 text-lg font-black mb-4">Skills covered</Text>
                                <View className="flex-row flex-wrap gap-2">
                                    {module.skillTags.map((tag: string, i: number) => (
                                        <View key={i} className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                                            <Text className="text-slate-600 font-bold text-sm capitalize">{tag}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        )}

                        <PrimaryButton
                            title={`Start ${module.format === 'video' ? 'Watching' : 'Learning'}`}
                            iconName={module.format === 'video' ? 'play-arrow' : 'auto-stories'}
                            onPress={handleStartLearning}
                        />
                    </MotiView>
                </View>
            </ScrollView>
        </View>
    );
}

import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import '../../../global.css';
import { AICard } from '../../../src/components/AICard';
import PredictionLoader from '../../../src/components/PredictionLoader';
import { PrimaryButton } from '../../../src/components/PrimaryButton';
import { useTheme } from '../../../src/context/ThemeContext';
import { AppDispatch, RootState } from '../../../src/store';
import { predictCourse } from '../../../src/store/slices/commonSlice';

export default function CourseAIScreen() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { colors } = useTheme();
    const { predictions, selectedInterests, selectedSkills } = useSelector((state: RootState) => state.common);
    const { userSkills, userInterests } = useSelector((state: RootState) => state.onboarding);

    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [isPredicting, setIsPredicting] = useState(true);

    useEffect(() => {
        handleAIPredict();
    }, []);

    const handleAIPredict = async () => {
        setIsPredicting(true);

        const interestIds = selectedInterests.length > 0 ? selectedInterests : userInterests.map(i => i.id);
        const skillIds = selectedSkills.length > 0 ? selectedSkills : userSkills.map(s => s.id);

        if (interestIds.length === 0 && skillIds.length === 0) {
            setIsPredicting(false);
            router.replace('/(onboarding)/course/manual' as any);
            return;
        }

        const predictPromise = dispatch(predictCourse({
            interestIds,
            skillIds
        })).unwrap();

        const delayPromise = new Promise(resolve => setTimeout(resolve, 3000));

        try {
            await Promise.all([predictPromise, delayPromise]);
        } catch (err) {
            console.error('Prediction failed:', err);
            router.replace('/(onboarding)/course/manual' as any);
        } finally {
            setIsPredicting(false);
        }
    };

    const handleContinue = () => {
        if (selectedCourseId) {
            const course = predictions.courses.find(c => c.id === selectedCourseId);
            router.push({
                pathname: '/(onboarding)/branch/',
                params: {
                    courseId: selectedCourseId,
                    courseIcon: course?.icon || 'school',
                    courseIconLib: course?.iconLibrary || 'MaterialCommunityIcons'
                }
            } as any);
        }
    };

    if (isPredicting) return <PredictionLoader />;

    return (
        <SafeAreaView className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="flex-row items-center justify-between px-6 py-4">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full bg-white shadow-sm items-center justify-center"
                >
                    <MaterialIcons name="arrow-back-ios-new" size={20} color="#475569" />
                </TouchableOpacity>

                <View className="flex-row gap-1.5">
                    <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                    <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                    <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                    <View className="h-1.5 w-6 rounded-full bg-blue-600" />
                </View>

                <View className="w-10" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="px-8 mt-4">
                    <Text className="text-3xl font-bold text-slate-900 mb-2 leading-tight">AI Course Suggestions</Text>
                    <Text className="text-slate-500 mb-8 text-base font-medium">Based on your unique profile, we recommend these paths:</Text>

                    <View className="gap-5">
                        {predictions.courses.map((course) => (
                            <AICard
                                key={course.id}
                                item={course}
                                isSelected={selectedCourseId === course.id}
                                onSelect={(id) => {
                                    setSelectedCourseId(id);
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                }}
                                icon={course.icon}
                                iconLibrary={course.iconLibrary}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        onPress={() => router.replace('/(onboarding)/course/manual' as any)}
                        className="items-center py-10"
                        activeOpacity={0.7}
                    >
                        <Text className="text-blue-600 font-bold text-base" style={{ color: colors['--primary'] }}>
                            Can't find what you need? Browse All
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View className="px-8 pb-8 pt-2 bg-slate-50">
                {selectedCourseId && <PrimaryButton
                    title="Continue"
                    iconName="arrow-forward"
                    onPress={handleContinue}
                />}
            </View>
        </SafeAreaView>
    );
}

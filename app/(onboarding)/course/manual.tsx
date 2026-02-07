import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import '../../../global.css';
import { PrimaryButton } from '../../../src/components/PrimaryButton';
import { PrimaryInput } from '../../../src/components/PrimaryInput';
import { useTheme } from '../../../src/context/ThemeContext';
import { RootState } from '../../../src/store';

export default function CourseManualScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const { courses } = useSelector((state: RootState) => state.common);

    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [displayCount, setDisplayCount] = useState(10);

    const filteredCourses = useMemo(() => {
        return courses.filter((course: any) =>
            course.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [courses, searchQuery]);

    const visibleCourses = useMemo(() => {
        return filteredCourses.slice(0, displayCount);
    }, [filteredCourses, displayCount]);

    const hasMore = displayCount < filteredCourses.length;

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + 10);
    };

    const renderIcon = (iconLibrary: string, iconName: string, size: number, color: string) => {
        switch (iconLibrary) {
            case 'MaterialCommunityIcons':
                return <MaterialCommunityIcons name={iconName as any} size={size} color={color} />;
            case 'MaterialIcons':
                return <MaterialIcons name={iconName as any} size={size} color={color} />;
            case 'Ionicons':
                return <Ionicons name={iconName as any} size={size} color={color} />;
            case 'FontAwesome':
                return <FontAwesome name={iconName as any} size={size} color={color} />;
            default:
                return <MaterialCommunityIcons name="school" size={size} color={color} />;
        }
    };

    const handleContinue = () => {
        if (selectedCourseId) {
            const course = courses.find(c => c.id === selectedCourseId);
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
                    <Text className="text-3xl font-bold text-slate-900 mb-2 leading-tight">Browse Courses</Text>
                    <Text className="text-slate-500 mb-8 text-base font-medium">Choose the path that fits you best.</Text>

                    <View className="mb-10">
                        <PrimaryInput
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChangeText={(text: string) => {
                                setSearchQuery(text);
                                setDisplayCount(10);
                            }}
                            iconName="search"
                        />
                    </View>

                    <View className="flex-row flex-wrap gap-4 justify-center pb-10">
                        {visibleCourses.map((course) => {
                            const isSelected = selectedCourseId === course.id;
                            return (
                                <TouchableOpacity
                                    key={course.id}
                                    onPress={() => {
                                        setSelectedCourseId(isSelected ? null : course.id);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    }}
                                    className={`flex-row items-center gap-3 px-6 py-4 rounded-full font-semibold transition-all ${isSelected
                                        ? 'shadow-lg'
                                        : 'bg-white border-white shadow-sm'
                                        }`}
                                    style={isSelected ? { backgroundColor: colors['--primary'] } : {}}
                                    activeOpacity={0.7}
                                >
                                    <View className={`w-8 h-8 rounded-full items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-slate-50'}`}>
                                        {renderIcon(course.iconLibrary, course.icon, 18, isSelected ? '#ffffff' : colors['--primary'])}
                                    </View>
                                    <Text
                                        className={`font-bold capitalize text-base ${isSelected ? 'text-white' : 'text-slate-700'
                                            }`}
                                    >
                                        {course.name}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {hasMore && (
                        <TouchableOpacity
                            onPress={handleLoadMore}
                            className="mb-10 mx-auto px-10 py-4 bg-white border border-white rounded-full shadow-sm active:scale-95"
                            activeOpacity={0.7}
                        >
                            <Text style={{ color: colors['--primary'] }} className="font-bold text-base">Load More ...</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>

            <View className="p-8">
                {selectedCourseId && <PrimaryButton
                    title="Continue"
                    iconName="arrow-forward"
                    onPress={handleContinue}
                />}
            </View>
        </SafeAreaView>
    );
}

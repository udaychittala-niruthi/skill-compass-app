import { FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import '../../../global.css';
import { PrimaryButton } from '../../../src/components/PrimaryButton';
import { PrimaryInput } from '../../../src/components/PrimaryInput';
import { useTheme } from '../../../src/context/ThemeContext';
import { AppDispatch, RootState } from '../../../src/store';
import { onboardProfessional, onboardStudent, onboardTeen } from '../../../src/store/slices/onboardingSlice';

export default function BranchManualScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const dispatch = useDispatch<AppDispatch>();
    const { colors } = useTheme();
    const { user } = useSelector((state: RootState) => state.auth);
    const { branches, selectedInterests, selectedSkills } = useSelector((state: RootState) => state.common);

    const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [displayCount, setDisplayCount] = useState(10);

    const courseId = params.courseId ? Number(params.courseId) : 0;
    const courseIcon = (params.courseIcon as string) || 'school';
    const courseIconLib = (params.courseIconLib as string) || 'MaterialCommunityIcons';

    const filteredBranches = useMemo(() => {
        return branches.filter((branch: any) =>
            branch.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [branches, searchQuery]);

    const visibleBranches = useMemo(() => {
        return filteredBranches.slice(0, displayCount);
    }, [filteredBranches, displayCount]);

    const hasMore = displayCount < filteredBranches.length;

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
                return <MaterialCommunityIcons name="book" size={size} color={color} />;
        }
    };

    const handleFinalize = async () => {
        try {
            if (user?.group === 'TEENS') {
                await dispatch(onboardTeen({ interestIds: selectedInterests, skillIds: selectedSkills, bio: '' })).unwrap();
            } else if (user?.group === 'COLLEGE_STUDENTS') {
                await dispatch(onboardStudent({ courseId, branchId: selectedBranchId!, skills: selectedSkills, bio: '' })).unwrap();
            } else if (user?.group === 'PROFESSIONALS') {
                await dispatch(onboardProfessional({ currentRole: '', industry: '', yearsOfExperience: 0, skills: selectedSkills, bio: '' })).unwrap();
            }
            router.replace('/(tabs)' as any);
        } catch (err) {
            console.error('Finalization failed:', err);
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
                    <View className="h-1.5 w-6 rounded-full bg-blue-600" />
                </View>

                <View className="w-10" />
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="px-8 mt-4">
                    <Text className="text-3xl font-bold text-slate-900 mb-2 leading-tight">Browse All</Text>
                    <Text className="text-slate-500 mb-8 text-base font-medium">Choose a specialization to finish onboarding.</Text>

                    <View className="mb-10">
                        <PrimaryInput
                            placeholder="Search specializations..."
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            iconName="search"
                        />
                    </View>

                    <View className="flex-row flex-wrap gap-4 justify-center pb-10">
                        {visibleBranches.map((branch: any) => {
                            const isSelected = selectedBranchId === branch.id;
                            return (
                                <TouchableOpacity
                                    key={branch.id}
                                    onPress={() => {
                                        setSelectedBranchId(isSelected ? null : branch.id);
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
                                        {renderIcon(courseIconLib, courseIcon, 18, isSelected ? '#ffffff' : colors['--primary'])}
                                    </View>
                                    <Text
                                        className={`font-bold capitalize text-base ${isSelected ? 'text-white' : 'text-slate-700'
                                            }`}
                                    >
                                        {branch.name}
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
                <PrimaryButton
                    title="Finalize Path"
                    iconName="verified"
                    onPress={handleFinalize}
                    disabled={!selectedBranchId}
                    style={!selectedBranchId ? { opacity: 0.5 } : {}}
                />
            </View>
        </SafeAreaView>
    );
}

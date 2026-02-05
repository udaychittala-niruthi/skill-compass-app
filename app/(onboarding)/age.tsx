import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    runOnJS,
    useAnimatedReaction,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import '../../global.css';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { useTheme } from '../../src/context/ThemeContext';
import { updateUserProfile } from '../../src/store/slices/authSlice';
import { AGE_GROUPS, getAgeMeta, ITEM_WIDTH } from '../../src/utils/ageHelpers';

const { width } = Dimensions.get('window');
const SPACING = (width - ITEM_WIDTH) / 2;
const AGES = Array.from({ length: 100 }, (_, i) => i + 1);

const AGE_META = AGES.map((age) => getAgeMeta(age));

const AgeItem = React.memo(({
    item,
    index,
    scrollX,
    activeColor
}: {
    item: number,
    index: number,
    scrollX: Animated.SharedValue<number>,
    activeColor: Animated.SharedValue<string>
}) => {
    const animatedStyle = useAnimatedStyle(() => {
        const position = scrollX.value / ITEM_WIDTH;
        const distance = Math.abs(position - index);

        const scale = interpolate(
            distance,
            [0, 1],
            [1, 0.4],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            distance,
            [0, 1],
            [1, 0.3],
            Extrapolation.CLAMP
        );

        return {
            transform: [{ scale }],
            opacity,
            color: distance < 0.5 ? activeColor.value : '#94a3b8'
        };
    });

    const createBlurStyle = (alphaHex: string) => {
        return useAnimatedStyle(() => {
            const position = scrollX.value / ITEM_WIDTH;
            const distance = Math.abs(position - index);

            const backgroundOpacity = interpolate(
                distance,
                [0, 0.5, 1],
                [1, 0.2, 0],
                Extrapolation.CLAMP
            );

            const backgroundScale = interpolate(
                distance,
                [0, 0.5, 1],
                [1, 0.95, 0.8],
                Extrapolation.CLAMP
            );

            return {
                opacity: backgroundOpacity,
                transform: [{ scale: backgroundScale }],
                backgroundColor: activeColor.value + alphaHex,
            };
        });
    };

    const blur1 = createBlurStyle('0F'); // ~6% opacity
    const blur2 = createBlurStyle('18'); // ~9% opacity
    const blur3 = createBlurStyle('26'); // ~15% opacity

    return (
        <View style={{ width: ITEM_WIDTH }} className="items-center justify-center h-48">
            {/* Outer glow - largest, most subtle */}
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        width: 140,
                        height: 140,
                        borderRadius: 70,
                    },
                    blur1
                ]}
            />
            {/* Middle glow */}
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        width: 120,
                        height: 120,
                        borderRadius: 60,
                    },
                    blur2
                ]}
            />
            {/* Inner glow - most visible */}
            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        width: 95,
                        height: 95,
                        borderRadius: 55,
                    },
                    blur3
                ]}
            />
            <Animated.Text
                allowFontScaling={false}
                style={[
                    { fontSize: 72, fontWeight: 'bold' },
                    animatedStyle
                ]}
            >
                {item}
            </Animated.Text>
        </View>
    );
});
export default function AgeSelectionScreen() {
    const router = useRouter();
    const dispatch = useDispatch();
    const { setTheme } = useTheme();
    const listRef = useRef<Animated.FlatList<number>>(null);

    const scrollX = useSharedValue(0);
    const iconAnimScale = useSharedValue(1);

    const [manualEntry, setManualEntry] = useState('16');
    const [activeGroupIndex, setActiveGroupIndex] = useState(1);
    const [activeAgeNum, setActiveAgeNum] = useState(16);

    const activeIndex = useDerivedValue(() => {
        return Math.round(scrollX.value / ITEM_WIDTH);
    });

    const activeMetaIndex = useDerivedValue(() => {
        return Math.max(0, Math.min(AGES.length - 1, activeIndex.value));
    });

    const activeMeta = useDerivedValue(() => {
        return AGE_META[activeMetaIndex.value];
    });

    const activeColor = useDerivedValue(() => {
        return activeMeta.value.color;
    });

    useAnimatedReaction(
        () => activeMeta.value.groupIndex,
        (newGroup, oldGroup) => {
            if (newGroup !== oldGroup) {
                runOnJS(setActiveGroupIndex)(newGroup);
                runOnJS(setTheme)(AGE_GROUPS[newGroup].group);
                iconAnimScale.value = withSequence(
                    withTiming(0.8, { duration: 100 }),
                    withSpring(1, { damping: 12, stiffness: 200 })
                );
                runOnJS(Haptics.selectionAsync)();
            }
        }
    );

    useAnimatedReaction(
        () => activeIndex.value,
        (newIndex, oldIndex) => {
            if (newIndex !== oldIndex) {
                const age = AGES[Math.max(0, Math.min(99, newIndex))];
                runOnJS(setActiveAgeNum)(age);
                runOnJS(setManualEntry)(age.toString());
            }
        }
    );

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (e) => {
            scrollX.value = e.contentOffset.x;
        },
    });

    const scrollToAge = useCallback((age: number, animated = true) => {
        const index = AGES.indexOf(age);
        if (index !== -1 && listRef.current) {
            listRef.current.scrollToOffset({
                offset: index * ITEM_WIDTH,
                animated,
            });
        }
    }, []);

    useEffect(() => {
        setTimeout(() => scrollToAge(16, false), 100);
    }, []);

    const circleStyle = useAnimatedStyle(() => ({
        backgroundColor: activeColor.value + '20',
    }));

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: iconAnimScale.value }],
    }));

    const badgeStyle = useAnimatedStyle(() => ({
        backgroundColor: activeColor.value,
    }));

    const activeGroupData = AGE_GROUPS[activeGroupIndex];

    return (
        <SafeAreaView className="flex-1 bg-white">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1"
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
            >
                <View className="flex-row items-center justify-between px-6 py-4">
                    <TouchableOpacity
                        onPress={() => router.back()}
                        className="w-10 h-10 rounded-full border border-slate-100 items-center justify-center bg-white shadow-sm"
                    >
                        <MaterialIcons name="arrow-back-ios-new" size={20} color="#475569" />
                    </TouchableOpacity>

                    <View className="flex-row gap-1.5">
                        <View className="h-1.5 w-8 rounded-full bg-blue-600" />
                        <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                        <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                    </View>

                    <View className="w-10" />
                </View>

                <Animated.ScrollView
                    contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingTop: 32 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <Animated.View
                        style={[
                            {
                                width: 160,
                                height: 160,
                                borderRadius: 80,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 32
                            },
                            circleStyle,
                        ]}
                    >
                        <Animated.View style={iconStyle}>
                            <MaterialCommunityIcons
                                name={activeGroupData.iconName as any}
                                size={72}
                                color={activeGroupData.color}
                            />
                        </Animated.View>

                        <Animated.View
                            style={[
                                {
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    paddingHorizontal: 12,
                                    paddingVertical: 6,
                                    borderRadius: 999,
                                    borderWidth: 3,
                                    borderColor: 'white',
                                    shadowColor: '#000',
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 4,
                                    elevation: 2
                                },
                                badgeStyle,
                            ]}
                        >
                            <Text className="text-white font-bold text-xs tracking-wide" allowFontScaling={false}>
                                {activeGroupData.label}
                            </Text>
                        </Animated.View>
                    </Animated.View>

                    <View className="items-center px-8 mb-4 mt-6">
                        <Text className="text-4xl font-bold text-slate-900 mb-6 text-center tracking-tight">
                            How old are you?
                        </Text>
                        <Text className="text-slate-500 text-center font-medium leading-6 ">
                            This helps us tailor your learning experience.
                        </Text>
                    </View>

                    <View className="h-44 w-full">
                        <Animated.FlatList
                            ref={listRef}
                            data={AGES}
                            horizontal
                            keyExtractor={(i) => i.toString()}
                            renderItem={({ item, index }) => (
                                <AgeItem
                                    item={item}
                                    index={index}
                                    scrollX={scrollX}
                                    activeColor={activeColor}
                                />
                            )}
                            showsHorizontalScrollIndicator={false}
                            snapToInterval={ITEM_WIDTH}
                            decelerationRate="fast"
                            contentContainerStyle={{ paddingHorizontal: SPACING }}
                            onScroll={scrollHandler}
                            scrollEventThrottle={16}
                            removeClippedSubviews={true}
                            initialNumToRender={5}
                            windowSize={3}
                            getItemLayout={(_, index) => ({
                                length: ITEM_WIDTH,
                                offset: ITEM_WIDTH * index,
                                index,
                            })}
                        />
                    </View>

                    <View className="mt-14 mb-8">
                        <View className="bg-white px-8 py-4 rounded-2xl border border-slate-100 shadow-sm flex-row items-center gap-6 min-w-[200px] justify-center">
                            <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-widest font-bold">
                                MANUAL ENTRY
                            </Text>
                            <TextInput
                                className="text-2xl font-bold p-0 min-w-[40px] text-center font-bold"
                                style={{ color: activeGroupData.color }}
                                keyboardType="number-pad"
                                value={manualEntry}
                                onChangeText={(t) => {
                                    setManualEntry(t);
                                    const age = Number(t);
                                    if (!isNaN(age) && age > 0 && age <= 100) scrollToAge(age);
                                }}
                                maxLength={3}
                                selectTextOnFocus
                            />
                        </View>
                    </View>
                </Animated.ScrollView>

                <View className="p-8 bg-white">
                    <PrimaryButton
                        title="Next"
                        iconName="arrow-forward"
                        onPress={() => {
                            dispatch(updateUserProfile({
                                age: activeAgeNum,
                                ageGroup: activeGroupData.group
                            }));
                            console.log('Next', activeAgeNum, activeGroupData.group);
                            if (activeGroupData.group === 'kid') {
                                router.push('/(onboarding)/hero');
                            } else {
                                router.push('/(onboarding)/interests' as any);
                            }
                        }}
                    />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

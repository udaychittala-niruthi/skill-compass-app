import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { PredictedItem } from '../types/onboarding';

interface AICardProps {
    item: PredictedItem;
    isSelected: boolean;
    onSelect: (id: number) => void;
    icon?: string;
    iconLibrary?: string;
    showIcon?: boolean;
}

export const AICard = ({ item, isSelected, onSelect, icon, iconLibrary, showIcon = true }: AICardProps) => {
    const isTop = item.isTopRecommended;

    const renderIcon = () => {
        if (!showIcon) return null;
        const lib = (iconLibrary as any) || 'MaterialCommunityIcons';
        const name = (icon as any) || 'school';

        if (lib === 'MaterialIcons') {
            return <MaterialIcons name={name} size={24} color={isSelected ? 'white' : '#64748b'} />;
        }
        return <MaterialCommunityIcons name={name} size={24} color={isSelected ? 'white' : '#64748b'} />;
    };

    return (
        <TouchableOpacity
            onPress={() => onSelect(item.id)}
            activeOpacity={0.8}
            className={`p-6 rounded-3xl border-2 overflow-hidden ${isSelected
                ? 'border-blue-600 bg-blue-50/80 shadow-lg'
                : 'border-white bg-white shadow-sm'
                } ${isTop && !isSelected ? 'border-blue-100' : ''}`}
        >
            <View className="flex-row items-center justify-between mb-3 gap-2">
                <View className="flex-1 flex-row items-center gap-3">
                    {showIcon && (
                        <View className={`w-12 h-12 rounded-2xl items-center justify-center ${isSelected ? 'bg-blue-600' : 'bg-slate-100'}`}>
                            {renderIcon()}
                        </View>
                    )}
                    <View className="flex-1">
                        <Text className={`text-lg font-bold ${isSelected ? 'text-blue-700' : 'text-slate-900'}`} numberOfLines={1}>
                            {item.name}
                        </Text>
                    </View>
                </View>
                <View className="bg-blue-100/50 px-3 py-1.5 rounded-full border border-blue-200 flex-shrink-0">
                    <Text className="text-blue-600 font-bold text-[10px]">{item.matchPercentage}% Match</Text>
                </View>
            </View>

            <Text className="text-slate-600 text-sm italic leading-5 mb-4 px-1">
                "{item.reasoning}"
            </Text>

            {isTop && (
                <View className="flex-row items-center gap-2">
                    <MaterialCommunityIcons name="check-circle" size={18} color="#2563eb" />
                    <Text className="text-blue-600 font-bold text-xs uppercase tracking-wider">Top Recommended</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

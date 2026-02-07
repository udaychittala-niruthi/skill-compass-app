import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

interface CustomToastProps {
    id: string;
    status?: 'success' | 'error' | 'info' | 'warning';
    title: string;
    description?: string;
    variant?: 'solid' | 'outline' | 'accent';
    style?: ViewStyle;
    className?: string;
}

export const CustomToast = ({ id, status = 'info', title, description, variant = 'solid', style, className }: CustomToastProps) => {
    const getIconName = () => {
        switch (status) {
            case 'success': return 'check-circle';
            case 'error': return 'error';
            case 'warning': return 'warning';
            case 'info': default: return 'info';
        }
    };

    const getColors = () => {
        switch (status) {
            case 'success': return { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-800', icon: 'green' };
            case 'error': return { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-800', icon: 'red' };
            case 'warning': return { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-800', icon: 'orange' };
            case 'info': default: return { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-800', icon: 'blue' };
        }
    };

    const colors = getColors();

    return (
        <Animated.View
            entering={FadeInUp.springify().damping(15)}
            exiting={FadeOutUp}
            className={`mx-4 p-4 rounded-lg flex-row items-start shadow-sm border ${colors.bg} ${colors.border} ${className || ''}`}
            style={[{ elevation: 2 }, style]}
        >
            <MaterialIcons name={getIconName()} size={24} color={colors.icon} style={{ marginRight: 12, marginTop: 2 }} />
            <View className="flex-1">
                <Text className={`font-bold text-base mb-1 ${colors.text}`}>{title}</Text>
                {description && <Text className={`text-sm ${colors.text} opacity-90`}>{description}</Text>}
            </View>
        </Animated.View>
    );
};

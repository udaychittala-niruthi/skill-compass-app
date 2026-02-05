import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleProp, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface PrimaryInputProps extends Omit<TextInputProps, 'style'> {
    iconName?: keyof typeof MaterialIcons.glyphMap;
    isPassword?: boolean;
    className?: string; // Add className to props definition to avoid TS error with NativeWind
    style?: StyleProp<ViewStyle>;
}

export const PrimaryInput = ({ iconName, isPassword, className, style, ...props }: PrimaryInputProps) => {
    const { colors } = useTheme();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <View
            style={[{
                shadowColor: colors['--accent'], // Using accent color for shadow to match button vibe but subtler if needed
                elevation: 10,
            }, style]}
            className={`w-full flex-row items-center h-18 px-4 rounded-[16px] shadow-xl shadow-primary/20 bg-white ${className || ''}`}
        >
            {iconName && (
                <View className="mr-3">
                    <MaterialIcons
                        name={iconName}
                        size={22}
                        color="#9ca3af" // slate-400
                    />
                </View>
            )}
            <TextInput
                placeholderTextColor={colors['text-secondary'] || "#9ca3af"}
                style={{ flex: 1, fontSize: 16, color: colors.text || '#0f172a' }} // Using theme text color
                secureTextEntry={isPassword && !isPasswordVisible}
                {...props}
            />
            {
                isPassword && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="p-2"
                    >
                        <MaterialIcons
                            name={isPasswordVisible ? "visibility" : "visibility-off"}
                            size={22}
                            color="#9ca3af"
                        />
                    </TouchableOpacity>
                )
            }
        </View >
    );
};

import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* 
 * AIChatModal Component
 * 
 * Displays the chat interface with the AI mentor.
 * Supports different themes/modes via props if needed, or uses a neutral/adaptive style.
 */

interface AIChatModalProps {
    visible: boolean;
    onClose: () => void;
    mode?: 'adult' | 'kid'; // To adjust tone/style if needed
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: number;
}

export const AIChatModal = ({ visible, onClose, mode = 'adult' }: AIChatModalProps) => {
    const insets = useSafeAreaInsets();
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Hi there! 👋 I'm your Skill Compass Mentor. What amazing thing do you want to learn about today? 🚀`,
            sender: 'ai',
            timestamp: Date.now(),
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setInputText('');
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: "That's a great question! I'm thinking about the best way to explain it... 🤔", // Placeholder response
                sender: 'ai',
                timestamp: Date.now(),
            };
            setMessages((prev) => [...prev, aiMsg]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <MotiView
                from={{ opacity: 0, translateY: 100 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: 100 }}
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}
            >
                <BlurView intensity={20} tint="light" style={{ flex: 1 }}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={{ flex: 1 }}
                    >
                        <View className="flex-1 bg-white/95 mt-10 rounded-t-[32px] overflow-hidden shadow-2xl">
                            {/* Header */}
                            <View className="flex-row items-center justify-between p-4 border-b border-slate-100 bg-white">
                                <View className="flex-row items-center gap-3">
                                    <View className="w-10 h-10 rounded-full bg-indigo-100 items-center justify-center">
                                        <MaterialIcons name="smart-toy" size={24} color="#4F46E5" />
                                    </View>
                                    <View>
                                        <Text className="font-bold text-slate-800 text-lg">Skill Compass Mentor</Text>
                                        <View className="flex-row items-center gap-1">
                                            <View className="w-2 h-2 rounded-full bg-green-500" />
                                            <Text className="text-xs text-slate-500 font-medium">Ready to help</Text>
                                        </View>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={() => {
                                        Keyboard.dismiss();
                                        onClose();
                                    }}
                                    className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center"
                                >
                                    <MaterialIcons name="close" size={24} color="#64748B" />
                                </TouchableOpacity>
                            </View>

                            {/* Chat Area */}
                            <ScrollView
                                className="flex-1 px-4 py-4"
                                contentContainerStyle={{ paddingBottom: 20 }}
                            >
                                {messages.map((msg) => (
                                    <View
                                        key={msg.id}
                                        className={`mb-4 max-w-[80%] ${msg.sender === 'user' ? 'self-end' : 'self-start'
                                            }`}
                                    >
                                        <View
                                            className={`p-4 rounded-2xl ${msg.sender === 'user'
                                                ? 'bg-blue-600 rounded-tr-none'
                                                : 'bg-slate-100 rounded-tl-none'
                                                }`}
                                        >
                                            <Text
                                                className={`${msg.sender === 'user' ? 'text-white' : 'text-slate-800'
                                                    } text-base`}
                                            >
                                                {msg.text}
                                            </Text>
                                        </View>
                                        <Text className="text-[10px] text-slate-400 mt-1 px-1">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </Text>
                                    </View>
                                ))}
                                {isTyping && (
                                    <View className="self-start mb-4 bg-slate-100 p-4 rounded-2xl rounded-tl-none">
                                        <Text className="text-slate-500">Writing...</Text>
                                    </View>
                                )}
                            </ScrollView>

                            {/* Input Area */}
                            <View
                                className="p-4 border-t border-slate-100 bg-white"
                                style={{ paddingBottom: insets.bottom + 10 }}
                            >
                                <View className="flex-row items-center gap-2 bg-slate-50 p-2 rounded-full border border-slate-200">
                                    <TextInput
                                        className="flex-1 px-4 py-2 text-base text-slate-800 font-medium"
                                        placeholder="Ask me anything..."
                                        placeholderTextColor="#94A3B8"
                                        value={inputText}
                                        onChangeText={setInputText}
                                        multiline
                                        maxLength={200}
                                    />
                                    <TouchableOpacity
                                        onPress={handleSend}
                                        disabled={!inputText.trim()}
                                        className={`w-10 h-10 rounded-full items-center justify-center ${inputText.trim() ? 'bg-blue-600' : 'bg-slate-300'
                                            }`}
                                    >
                                        <MaterialIcons name="send" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </BlurView>
            </MotiView>
        </Modal>
    );
};

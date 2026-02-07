import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';

export const useRedirectToast = () => {
    const params = useLocalSearchParams();
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (params.toastMessage) {
            setMessage(params.toastMessage as string);
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [params.toastMessage]);

    return {
        visible,
        message,
        setVisible
    };
};

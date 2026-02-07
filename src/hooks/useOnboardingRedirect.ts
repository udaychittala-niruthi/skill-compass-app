import { useRouter } from 'expo-router';
import { OnboardingStatus } from '../types/auth';

export const useOnboardingRedirect = () => {
    const router = useRouter();

    const getRedirectPath = (status: OnboardingStatus): string => {
        if (!status.age) {
            return '/(onboarding)/age';
        }

        if (status.group === 'KIDS') {
            return '/(onboarding)/hero';
        }

        const hasPreferences = status.preferences &&
            ((status.preferences.skillIds && status.preferences.skillIds.length > 0) ||
                (status.preferences.interestIds && status.preferences.interestIds.length > 0));

        if (!hasPreferences) {
            return '/(onboarding)/interests';
        }

        if (!status.isOnboarded) {
            const hasCourse = status.preferences && status.preferences.courseId;
            if (!hasCourse) {
                return '/(onboarding)/course/';
            }
            return '/(onboarding)/branch/';
        }

        return '/(tabs)';
    };

    const performRedirect = (status: OnboardingStatus, onBeforeRedirect?: () => void) => {
        const path = getRedirectPath(status);
        if (onBeforeRedirect) {
            onBeforeRedirect();
        }
        router.replace(path as any);
    };

    return { getRedirectPath, performRedirect };
};

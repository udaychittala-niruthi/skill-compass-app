import { useRouter } from 'expo-router';
import { mapGroupToTheme } from '../constants/themes';
import { useTheme } from '../context/ThemeContext';
import { OnboardingStatus } from '../types/auth';

type RedirectOptions = {
    onBeforeRedirect?: () => void;
    delayMs?: number;
};

export const useOnboardingRedirect = () => {
    const router = useRouter();
    const { setTheme } = useTheme();

    const getRedirectPath = (
        status: OnboardingStatus
    ): { path: string; reason?: string } => {
        if (!status.age) {
            return {
                path: '/(onboarding)/age',
                reason: 'Please set your age to continue',
            };
        }

        if (status.group === 'KIDS') {
            return {
                path: '/(onboarding)/hero',
                reason: 'Complete your profile to see tailored content',
            };
        }

        const hasPreferences =
            !!status.preferences &&
            ((status.preferences.skillIds?.length ?? 0) > 0 ||
                (status.preferences.interestIds?.length ?? 0) > 0);

        if (!hasPreferences) {
            return {
                path: '/(onboarding)/interests',
                reason: 'Tell us about your skills and interests',
            };
        }

        if (!status.isOnboarded) {
            const hasCourse = !!status.preferences?.courseId;

            if (!hasCourse) {
                return {
                    path: '/(onboarding)/course',
                    reason: 'Select a course to personalize your roadmap',
                };
            }

            return {
                path: '/(onboarding)/branch',
                reason: 'Choose a specialization to finish setup',
            };
        }

        return { path: '/(tabs)' };
    };

    const performRedirect = (
        status: OnboardingStatus,
        options?: RedirectOptions
    ) => {
        const { path, reason } = getRedirectPath(status);

        // Set theme based on user's group
        if (status.group) {
            const themeType = mapGroupToTheme(status.group);
            console.log('🎨 [REDIRECT] Setting theme to:', themeType, 'for group:', status.group);
            setTheme(themeType);
        }

        // Safely call the hook if provided
        options?.onBeforeRedirect?.();

        const delay =
            options?.delayMs ??
            (options?.onBeforeRedirect ? 100 : 0);

        if (delay > 0) {
            setTimeout(() => {
                router.replace({
                    pathname: path as any,
                    params: reason ? { toastMessage: reason } : {},
                } as any);
            }, delay);
        } else {
            router.replace({
                pathname: path as any,
                params: reason ? { toastMessage: reason } : {},
            } as any);
        }
    };

    return {
        getRedirectPath,
        performRedirect,
    };
};

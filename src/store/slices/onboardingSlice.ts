import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

interface OnboardingState {
    loading: boolean;
    error: string | null;
    success: boolean;
}

const initialState: OnboardingState = {
    loading: false,
    error: null,
    success: false,
};

// Helper to extract error message
const extractErrorMessage = (err: any): string => {
    if (err.response) {
        const data = err.response.data;
        if (data && typeof data === 'object') {
            if (data.message) return data.message;
            if (data.error) return data.error;
        }
        if (typeof data === 'string') return data;
    }
    return err.message || 'An unexpected error occurred';
};

export const updateAge = createAsyncThunk(
    'onboarding/updateAge',
    async (age: number, { rejectWithValue }) => {
        try {
            const response = await api.put('/onboarding/age', { age });
            // Response should contain updated user object with new age and ageGroup
            return response.data;
        } catch (err: any) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

export const onboardKid = createAsyncThunk(
    'onboarding/kid',
    async (data: { avatar: string; bio: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/onboarding/kids/profile', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

export const onboardTeen = createAsyncThunk(
    'onboarding/teen',
    async (data: { interestIds: number[]; skillIds: number[]; bio: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/onboarding/teens/interests', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

export const onboardStudent = createAsyncThunk(
    'onboarding/student',
    async (data: { courseId: number; branchId: number; skills: number[]; bio: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/onboarding/students/details', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

export const onboardProfessional = createAsyncThunk(
    'onboarding/professional',
    async (data: { currentRole: string; industry: string; yearsOfExperience: number; skills: number[]; bio: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/onboarding/professionals/details', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

export const onboardSenior = createAsyncThunk(
    'onboarding/senior',
    async (data: { interestIds: number[]; bio: string; accessibilitySettings: any }, { rejectWithValue }) => {
        try {
            const response = await api.post('/onboarding/seniors/details', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

const onboardingSlice = createSlice({
    name: 'onboarding',
    initialState,
    reducers: {
        resetOnboardingState: (state) => {
            state.loading = false;
            state.error = null;
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        const handlePending = (state: OnboardingState) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        };
        const handleFulfilled = (state: OnboardingState) => {
            state.loading = false;
            state.success = true;
        };
        const handleRejected = (state: OnboardingState, action: any) => {
            state.loading = false;
            state.error = action.payload as string;
        };

        builder
            .addCase(updateAge.pending, handlePending)
            .addCase(updateAge.fulfilled, handleFulfilled)
            .addCase(updateAge.rejected, handleRejected)

            .addCase(onboardKid.pending, handlePending)
            .addCase(onboardKid.fulfilled, handleFulfilled)
            .addCase(onboardKid.rejected, handleRejected)

            .addCase(onboardTeen.pending, handlePending)
            .addCase(onboardTeen.fulfilled, handleFulfilled)
            .addCase(onboardTeen.rejected, handleRejected)

            .addCase(onboardStudent.pending, handlePending)
            .addCase(onboardStudent.fulfilled, handleFulfilled)
            .addCase(onboardStudent.rejected, handleRejected)

            .addCase(onboardProfessional.pending, handlePending)
            .addCase(onboardProfessional.fulfilled, handleFulfilled)
            .addCase(onboardProfessional.rejected, handleRejected)

            .addCase(onboardSenior.pending, handlePending)
            .addCase(onboardSenior.fulfilled, handleFulfilled)
            .addCase(onboardSenior.rejected, handleRejected);
    },
});

export const { resetOnboardingState } = onboardingSlice.actions;
export default onboardingSlice.reducer;

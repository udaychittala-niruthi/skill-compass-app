import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api, { removeAuthToken, setAuthToken } from '../../services/api';

// Define types
interface User {
    id: string;
    name: string;
    email: string;
    age?: number;
    ageGroup?: string;
    hero?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

// Async Thunks

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

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', credentials);
            const { token, user } = response.data; // Adjust based on actual API response structure

            if (token) {
                await setAuthToken(token);
            }

            return { user, token };
        } catch (err: any) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: { name: string; email: string; password: string; age?: number }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/register', userData);
            const { token, user } = response.data; // Adjust based on actual API response structure

            if (token) {
                await setAuthToken(token);
            }

            return { user, token };
        } catch (err: any) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);



export const updateProfile = createAsyncThunk(
    'auth/updateProfile',
    async (data: Partial<User>, { rejectWithValue }) => {
        try {
            const response = await api.put('/users/profile', data);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

export const checkOnboardingStatus = createAsyncThunk(
    'auth/checkStatus',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/onboarding/status');
            return response.data;
        } catch (err: any) {
            return rejectWithValue(extractErrorMessage(err));
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            removeAuthToken(); // Side effect: remove token from storage
        },
        clearError: (state) => {
            state.error = null;
        },
        updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        }
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Register
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });



        // Update Profile
        builder.addCase(updateProfile.fulfilled, (state, action) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        });

        // Check Onboarding Status - mostly updates user state if needed
        builder.addCase(checkOnboardingStatus.fulfilled, (state, action) => {
            // Logic depends on what status returns, assuming it might return user details or flags
            // For now, logging or handling specific flags if implementation requires
        });
    },
});

export const { logout, clearError, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;

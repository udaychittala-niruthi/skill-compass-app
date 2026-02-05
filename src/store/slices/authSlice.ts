import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

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

// Mock login for now since we don't have a real backend
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        try {
            // Simulate API call
            // const response = await client.post('/auth/login', credentials);
            // return response.data;

            await new Promise(resolve => setTimeout(resolve, 1000));

            if (credentials.email === 'error@example.com') {
                throw new Error('Invalid credentials');
            }

            return {
                user: { id: '1', name: 'Test User', email: credentials.email },
                token: 'mock-jwt-token-123',
            };
        } catch (err: any) {
            // Use rejectWithValue to pass custom error payload
            return rejectWithValue(err.message || 'Login failed');
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
        try {
            // Simulate API call
            // const response = await client.post('/auth/register', userData);
            await new Promise(resolve => setTimeout(resolve, 1000));

            return {
                user: { id: '2', name: userData.name, email: userData.email },
                token: 'mock-jwt-token-456',
            };
        } catch (err: any) {
            return rejectWithValue(err.message || 'Registration failed');
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
    },
});

export const { logout, clearError, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;

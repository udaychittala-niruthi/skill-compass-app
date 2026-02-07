import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

interface LearningState {
    pathStatus: string | null;
    learningPath: any | null; // Detailed path
    currentModules: any[];
    progress: any[];
    schedule: any[];
    loading: boolean;
    error: string | null;
}

const initialState: LearningState = {
    pathStatus: null,
    learningPath: null,
    currentModules: [],
    progress: [],
    schedule: [],
    loading: false,
    error: null,
};

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

export const fetchLearningPathStatus = createAsyncThunk('learning/fetchStatus', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/learning-path/status');
        return response.data;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

export const fetchMyLearningPath = createAsyncThunk('learning/fetchPath', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/learning-path/my-path');
        return response.data; // Expecting { path: ..., modules: ... }
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

export const regeneratePath = createAsyncThunk('learning/regenerate', async (_, { rejectWithValue }) => {
    try {
        const response = await api.post('/learning-path/regenerate', {});
        return response.data;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

export const fetchMyProgress = createAsyncThunk('learning/fetchProgress', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/learning-progress/my-progress');
        return response.data;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

export const updateModuleProgress = createAsyncThunk('learning/updateProgress', async ({ moduleId, data }: { moduleId: number, data: any }, { rejectWithValue }) => {
    try {
        const response = await api.post(`/learning-progress/module/${moduleId}`, data);
        return response.data;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

export const fetchMySchedule = createAsyncThunk('learning/fetchSchedule', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/learning-schedule/my-schedule');
        return response.data;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

export const updateScheduleStatus = createAsyncThunk('learning/updateSchedule', async ({ id, status }: { id: number, status: string }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/learning-schedule/${id}/status`, { status });
        return response.data;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

const learningSlice = createSlice({
    name: 'learning',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        const handlePending = (state: LearningState) => { state.loading = true; state.error = null; };
        const handleRejected = (state: LearningState, action: any) => { state.loading = false; state.error = action.payload as string; };

        builder.addCase(fetchLearningPathStatus.fulfilled, (state, action) => {
            state.loading = false;
            state.pathStatus = action.payload.status; // Adjust based on API response
        });

        builder.addCase(fetchMyLearningPath.fulfilled, (state, action) => {
            state.loading = false;
            state.learningPath = action.payload; // Adjust based on API
        });

        builder.addCase(fetchMyProgress.fulfilled, (state, action) => {
            state.loading = false;
            state.progress = action.payload;
        });

        builder.addCase(fetchMySchedule.fulfilled, (state, action) => {
            state.loading = false;
            state.schedule = action.payload;
        });

        // Add pending/rejected handlers for all
        builder.addCase(fetchLearningPathStatus.pending, handlePending).addCase(fetchLearningPathStatus.rejected, handleRejected);
        builder.addCase(fetchMyLearningPath.pending, handlePending).addCase(fetchMyLearningPath.rejected, handleRejected);
        builder.addCase(fetchMyProgress.pending, handlePending).addCase(fetchMyProgress.rejected, handleRejected);
        builder.addCase(fetchMySchedule.pending, handlePending).addCase(fetchMySchedule.rejected, handleRejected);
        builder.addCase(regeneratePath.pending, handlePending).addCase(regeneratePath.rejected, handleRejected);
        builder.addCase(updateModuleProgress.pending, handlePending).addCase(updateModuleProgress.rejected, handleRejected);
        builder.addCase(updateScheduleStatus.pending, handlePending).addCase(updateScheduleStatus.rejected, handleRejected);
    },
});

export default learningSlice.reducer;

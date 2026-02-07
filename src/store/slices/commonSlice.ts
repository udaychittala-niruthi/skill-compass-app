import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

interface CommonState {
    interests: any[];
    skills: any[];
    courses: any[];
    branches: any[]; // Branches for a specific course
    predictions: {
        course: any | null;
        branch: any | null;
    };
    loading: boolean;
    error: string | null;
}

const initialState: CommonState = {
    interests: [],
    skills: [],
    courses: [],
    branches: [],
    predictions: {
        course: null,
        branch: null,
    },
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

export const fetchInterests = createAsyncThunk('common/fetchInterests', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/common/interests');
        return response.data;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

export const fetchSkills = createAsyncThunk('common/fetchSkills', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/common/skills');
        return response.data;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

export const fetchCourses = createAsyncThunk('common/fetchCourses', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/common/courses');
        return response.data;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

export const fetchBranches = createAsyncThunk('common/fetchBranches', async (courseId: number, { rejectWithValue }) => {
    try {
        const response = await api.get(`/common/courses/${courseId}/branches`);
        return response.data;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

export const predictCourse = createAsyncThunk('common/predictCourse', async (data: { interestIds: number[]; skillIds: number[] }, { rejectWithValue }) => {
    try {
        const response = await api.post('/common/predict/course', data);
        return response.data;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

export const predictBranch = createAsyncThunk('common/predictBranch', async (data: { interestIds: number[]; skillIds: number[]; courseId: number }, { rejectWithValue }) => {
    try {
        const response = await api.post('/common/predict/branch', data);
        return response.data;
    } catch (err: any) { return rejectWithValue(extractErrorMessage(err)); }
});

const commonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        const handlePending = (state: CommonState) => { state.loading = true; state.error = null; };
        const handleRejected = (state: CommonState, action: any) => { state.loading = false; state.error = action.payload as string; };

        // Interests
        builder.addCase(fetchInterests.pending, handlePending)
            .addCase(fetchInterests.fulfilled, (state, action) => {
                state.loading = false;
                state.interests = action.payload;
            })
            .addCase(fetchInterests.rejected, handleRejected);

        // Skills
        builder.addCase(fetchSkills.pending, handlePending)
            .addCase(fetchSkills.fulfilled, (state, action) => {
                state.loading = false;
                state.skills = action.payload;
            })
            .addCase(fetchSkills.rejected, handleRejected);

        // Courses
        builder.addCase(fetchCourses.pending, handlePending)
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(fetchCourses.rejected, handleRejected);

        // Branches
        builder.addCase(fetchBranches.pending, handlePending)
            .addCase(fetchBranches.fulfilled, (state, action) => {
                state.loading = false;
                state.branches = action.payload;
            })
            .addCase(fetchBranches.rejected, handleRejected);

        // Predict Course
        builder.addCase(predictCourse.pending, handlePending)
            .addCase(predictCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.predictions.course = action.payload;
            })
            .addCase(predictCourse.rejected, handleRejected);

        // Predict Branch
        builder.addCase(predictBranch.pending, handlePending)
            .addCase(predictBranch.fulfilled, (state, action) => {
                state.loading = false;
                state.predictions.branch = action.payload;
            })
            .addCase(predictBranch.rejected, handleRejected);
    },
});

export default commonSlice.reducer;

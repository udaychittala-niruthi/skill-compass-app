import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import clipReducer from './slices/clipSlice';
import commonReducer from './slices/commonSlice';
import learningReducer from './slices/learningSlice';
import onboardingReducer from './slices/onboardingSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        onboarding: onboardingReducer,
        common: commonReducer,
        learning: learningReducer,
        clip: clipReducer,
        users: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

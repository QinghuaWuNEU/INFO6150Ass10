// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
// 导入未来要创建的其他 slice
// import jobReducer from './slices/jobSlice'; 
// import adminReducer from './slices/adminSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        // jobs: jobReducer,
        // admin: adminReducer,
    },
    // 建议：在开发模式下关闭 serializableCheck 以避免某些警告
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
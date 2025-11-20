// src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client'; // 使用 React 18 的新 API
import App from './App'; // 导入您的核心应用组件 App.js

// 导入 Material UI 的全局基线CSS，用于统一浏览器默认样式
import { CssBaseline } from '@mui/material';

// 获取在 public/index.html 中定义的根元素
const root = ReactDOM.createRoot(document.getElementById('root'));

// 渲染您的应用
root.render(
  <React.StrictMode>
    {/* CssBaseline 应该在 App 组件外部，确保应用使用统一的样式基线 */}
    <CssBaseline />
    <App />
  </React.StrictMode>
);
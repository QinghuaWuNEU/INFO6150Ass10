// src/App.js (Modified for Assignment 10)

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'; 
import Navbar from './components/Navbar/Navbar'; 
import Home from './pages/Home/Home'; 
import About from './pages/About'; 
import JobListings from './pages/JobListings/JobListings'; 
import Contact from './pages/Contact'; 
import CompanyShowcase from './pages/CompanyShowcase/CompanyShowcase'; 
import Login from './pages/Auth/Login'; 

// ⚠️ 修改点 1：Redux 导入
import { Provider, useSelector } from 'react-redux';
import { store } from './redux/store'; // 假设您的 store 文件路径是正确的

// ⚠️ 新增导入：Admin 专属页面 (您需要创建这些组件)
import AddJobPage from './pages/Admin/AddJobPage'; 
import EmployeesPage from './pages/Admin/EmployeesPage'; 


// ⚠️ 修改点 2：替换原有的 useAuth Hook，直接从 Redux Store 中读取状态
const useAuth = () => {
    // 从 Redux store 获取认证状态和用户信息
    const { isLoggedIn, user, loading } = useSelector((state) => state.auth);
    
    return { 
        isLoggedIn, 
        user, 
        // 关键：获取用户类型
        userType: user ? user.type : null,
        loading
    };
};

/**
 * 路由保护组件 (Role-Based ProtectedRoute)
 * 检查登录状态和用户角色
 * @param {Array} allowedRoles - 允许访问的角色数组，例如 ['admin', 'employee']
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isLoggedIn, userType, loading } = useAuth();
    
    // 如果正在加载（例如，在应用启动时检查本地存储的 token），可以显示加载器
    if (loading) {
        return <div>Loading user info...</div>; 
    }
    
    // 1. 检查是否登录
    if (!isLoggedIn) {
        // 如果未登录，重定向到登录页
        return <Navigate to="/login" replace />;
    }
    
    // 2. 检查用户角色是否在允许的角色列表中
    // 如果 allowedRoles 存在，并且当前用户类型不在其中
    if (allowedRoles && !allowedRoles.includes(userType)) {
        // 角色不匹配，重定向到首页 (或一个无权限页面)
        return <Navigate to="/" replace />; 
    }

    // 登录且角色匹配
    return children;
};

function App() {
    return (
        // ⚠️ 修改点 3：使用 Provider 包裹整个应用
        <Provider store={store}> 
            <Router>
                <Routes>
                    {/* 登录页不需要导航栏，任何人都可以访问 */}
                    <Route path="/login" element={<Login />} />
                    
                    {/* 包含导航栏的布局路由 */}
                    <Route element={<MainLayout />}>
                        {/* -------------------- 公共路由 -------------------- */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        
                        {/* -------------------- 受保护/Employee/Admin 路由 (Assignment 10) -------------------- */}

                        {/* Jobs 页面：员工和管理员都可以访问 */}
                        <Route path="/jobs" element={
                            <ProtectedRoute allowedRoles={['admin', 'employee']}> 
                                <JobListings />
                            </ProtectedRoute>
                        } />

                        {/* Company Showcase 页面：通常也是对登录用户开放 */}
                        <Route path="/companies" element={
                            <ProtectedRoute allowedRoles={['admin', 'employee']}> 
                                <CompanyShowcase />
                            </ProtectedRoute>
                        } />
                        
                        {/* -------------------- 管理员专用路由 -------------------- */}
                        
                        {/* Admin 页面：员工列表 */}
                        <Route path="/admin/users" element={
                            <ProtectedRoute allowedRoles={['admin']}> 
                                <EmployeesPage />
                            </ProtectedRoute>
                        } />

                        {/* Admin 页面：添加职位 */}
                        <Route path="/add-job" element={
                            <ProtectedRoute allowedRoles={['admin']}> 
                                <AddJobPage />
                            </ProtectedRoute>
                        } />

                    </Route>

                    {/* 兜底路由 */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </Provider>
    );
}

// 简单的布局组件 (保持不变)
const MainLayout = () => (
    <>
        <Navbar />
        <main style={{ padding: '20px' }}>
            <Outlet /> 
        </main>
    </>
);

export default App;
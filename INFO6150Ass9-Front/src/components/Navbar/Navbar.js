// src/components/Navbar/Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

import { useSelector, useDispatch } from 'react-redux'; // 引入 Redux hooks
import { logout } from '../redux/slices/authSlice';

function Navbar() {
    const navigate = useNavigate();
    
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    
    // Ass10 修改点 4：更新 handleLogout 逻辑，使用 Redux 派发注销 action
    // 任务要求中包含注销功能 
    const handleLogout = () => {
        // 1. 派发 Redux logout action
        dispatch(logout()); 

        // 移除存储的 Token 或会话凭证 
        localStorage.removeItem('userToken');
        
        // 重定向到登录页
        navigate('/login', { replace: true });
        
        // 刷新页面，确保App.js中的认证状态更新
        window.location.reload(); 
    };

    /*
    // 检查用户是否登录（简化判断，依赖于 localStorage 中是否有 token）
    const isAuthenticated = localStorage.getItem('userToken');
    */

    // 确定用户角色
    const userType = user ? user.type : null;
    const isAdmin = userType === 'admin';
    const isEmployee = userType === 'employee';



    return (
        // Material UI AppBar (导航栏) 
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Job Portal
                    </Link>
                </Typography>
                
                {/* Ass10 修改点 5：根据角色显示链接 */}
                {/* 导航链接  */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Button color="inherit" component={Link} to="/">Home</Button>
                    <Button color="inherit" component={Link} to="/about">About</Button>
                    {/* 员工/访客可见（或Employee专属）的链接 */}
                    {/* 你的 Job Listings 页面现在是员工或管理员才能访问 */}
                    {(isLoggedIn && (isEmployee || isAdmin)) && ( 
                         <Button color="inherit" component={Link} to="/jobs">Job Listings</Button>
                    )}
                    {/* <Button color="inherit" component={Link} to="/jobs">Job Listings</Button> */}
                    {/* 你的 Company Showcase 页面可以保留为公共/员工可见 */}
                    <Button color="inherit" component={Link} to="/companies">Company Showcase</Button>
                    <Button color="inherit" component={Link} to="/contact">Contact</Button>
                    {/* 管理员专属链接 */}
                    {isAdmin && (
                        <>
                            <Button color="inherit" component={Link} to="/admin/users">Employees</Button>
                            <Button color="inherit" component={Link} to="/add-job">Add Job</Button>
                        </>
                    )}
                </Box>

                {/* 登录/注销按钮 */}
                {/* Ass10 修改点 6：用 Redux 的 isLoggedIn 替代原有的 isAuthenticated */}
                {isLoggedIn ? (
                    <Button color="inherit" onClick={handleLogout}>
                        Logout {user?.fullName ? `(${user.fullName.split(' ')[0]})` : ''} 
                    </Button>
                ) : (
                    <Button color="inherit" component={Link} to="/login">Login</Button>
                )}
            </Toolbar>
        </AppBar>
    );
}



export default Navbar;
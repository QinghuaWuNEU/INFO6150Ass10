// controllers/userController.js

const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const { validateUserInput } = require('../validations/userValidation');
const fs = require('fs'); // 用于删除文件
const path = require('path'); // 用于构造文件路径
const jwt = require('jsonwebtoken');

// --- 1. User Creation: POST /user/create ---
const createUser = async (req, res) => {
    // Ass10修改点 2：在解构中加入 type 字段
    const { fullName, email, password, type } = req.body;

    // 1. 验证输入
    const validationResult = validateUserInput(req.body, false);
    if (!validationResult.isValid) {
        // 错误 (400): {"error": "Validation failed."}
        return res.status(400).json({ error: validationResult.message });
    }

    // Ass10修改点 3：验证 type 字段
    const validTypes = ['admin', 'employee'];
    if (!type || !validTypes.includes(type)) {
        return res.status(400).json({
            error: `Type is required and must be one of: ${validTypes.join(', ')}.`,
        });
    }

    try {
        // 2. 检查用户是否已存在
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }

        // 3. 创建用户 (密码哈希在 model 的 pre('save') 钩子中处理)
        const user = await User.create({
            fullName,
            email,
            password,
        });

        if (user) {
            // 成功 (201): {“message": "User created successfully." }
            res.status(201).json({ message: 'User created successfully.' });
        } else {
            res.status(400).json({ error: 'Invalid user data received.' });
        }
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// --- 2. Update User Details: PUT /user/edit ---
const updateUser = async (req, res) => {
    const { email, fullName, password } = req.body;

    // Email 必须存在且不能被更新
    if (!email) {
        return res.status(400).json({ error: 'Email must be provided to identify the user.' });
    }
    
    // 1. 验证输入 (只验证 fullName 和 password 的格式)
    const validationResult = validateUserInput({ fullName, password }, true); // 传入 true 表示是更新操作
    if (!validationResult.isValid) {
        return res.status(400).json({ error: validationResult.message });
    }
    
    // 确保至少有数据要更新
    if (!fullName && !password) {
        return res.status(400).json({ error: 'Validation failed: Please provide Full Name or Password to update.' });
    }

    try {
        // 2. 查找用户
        const user = await User.findOne({ email });
        
        // 错误 (404): {"error": "User not found."}
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // 3. 更新字段
        if (fullName) {
            user.fullName = fullName;
        }
        
        if (password) {
            // 在保存之前，需要哈希新密码。Model 上的 pre('save') 钩子会自动处理哈希。
            user.password = password; 
        }

        // 4. 保存更改
        const updatedUser = await user.save();
        
        // 成功 (200): {“message": "User updated successfully."}
        res.status(200).json({ message: 'User updated successfully.' });

    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// --- 3. Delete User: DELETE /user/delete ---
const deleteUser = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email must be provided to identify the user for deletion.' });
    }
    
    try {
        // 1. 查找用户并删除
        const user = await User.findOneAndDelete({ email });

        // 错误 (404): {"error": "User not found."}
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }
        
        // 2. 如果用户有图片，删除对应的物理文件
        if (user.imagePath) {
            const imagePath = path.join(__dirname, '..', user.imagePath);
            fs.unlink(imagePath, (err) => {
                if (err) {
                    // 记录文件删除失败，但仍视为用户删除成功
                    console.error(`Failed to delete image file at ${imagePath}:`, err);
                }
            });
        }

        // 成功 (200): {"message": "User deleted successfully."}
        res.status(200).json({ message: 'User deleted successfully.' });

    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// --- 4. Retrieve All Users: GET /user/getAll ---
const getAllUsers = async (req, res) => {
    try {
        // 1. 检索所有用户
        const users = await User.find({});

        // 2. 映射字段以符合响应要求
        const userList = users.map(user => ({
            fullName: user.fullName,
            email: user.email,
            // 任务要求包含 hashed password, imagePath 字段
            password: user.password, 
            imagePath: user.imagePath
        }));

        // 成功 (200)
        res.status(200).json({ users: userList });

    } catch (error) {
        console.error('Error retrieving all users:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};


// --- 5. Upload Image: POST /user/uploadImage ---
// 注意：大部分验证和文件存储已在 fileUploadMiddleware 中完成
const uploadImage = async (req, res) => {
    const { email } = req.body;
    
    // 1. 检查文件和用户对象是否存在 (由 Multer 中间件注入)
    if (!req.file || !req.user) {
        // Multer 中间件应该已经处理了所有错误，但为了安全起见
        return res.status(400).json({ error: 'File upload failed or missing user/file information.' });
    }

    try {
        // 2. 获取文件存储路径
        const filePath = `/images/${req.file.filename}`;
        
        // 3. 更新用户 model 中的 imagePath 字段
        const user = req.user; // 从中间件注入
        user.imagePath = filePath; 
        
        await user.save();

        // 成功 (201): { "message": "Image uploaded successfully.", "filePath": "/images/filename.extension" }
        res.status(201).json({
            message: 'Image uploaded successfully.',
            filePath: filePath
        });

    } catch (error) {
        console.error('Error processing image upload:', error);
        
        // 如果数据库更新失败，尝试删除已上传的物理文件
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Cleanup failed for file:", req.file.path, err);
            });
        }
        
        res.status(500).json({ error: 'Internal server error during database update.' });
    }
};

// Ass10修改点 1：generateToken 接受并包含用户的 type
const generateToken = (id, type) => {
    // 使用 .env 中的密钥和 30 天的有效期
    // 载荷 (Payload) 中包含 id 和 type
    return jwt.sign({ id, type }, process.env.JWT_SECRET, {
        expiresIn: '30d', 
    });
};

// User Login: POST /user/login ---
const authUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide both email and password.' });
    }
    
    try {
        // 1. 查找用户
        const user = await User.findOne({ email });

        // 2. 检查用户是否存在，并验证密码
        // 注意：这里需要一个方法来验证 bcrypt 哈希密码。
        // 我们需要先在 userModel 中添加这个方法。
        // 假设我们在 User Model 中添加了 matchPassword 方法。
        
        if (user && (await user.matchPassword(password))) {
            // 成功：返回用户数据和 JWT 令牌
            res.json({
                message: 'Login successful.',
                user: {
                    id: user._id,
                    fullName: user.fullName,
                    email: user.email,
                    type: user.type, // Ass10修改点 4：在登录成功响应中加入 type
                },
                // Ass10修改点 5：生成 token 时传入 type
                token: generateToken(user._id, user.type), // 返回 JWT
            });
        } else {
            // 401 Unauthorized
            res.status(401).json({ error: 'Invalid email or password.' });
        }
    } catch (error) {
        console.error('Error during user authentication:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// --- 3. Get All Users (Admin Only): GET /user/users ---
// Ass10新增函数 1：供管理员获取所有用户列表 (排除密码)
const getUsers = async (req, res) => {
    // 警告：确保此路由被适当的中间件保护，以验证请求者是否已登录且是 'admin'
    
    try {
        // 使用 .select('-password') 排除密码字段，符合 Assignment 10 要求
        // 也可以排除其他不必要的字段，如：-imagePath -__v
        const users = await User.find({})
            .select('-password') 
            .lean(); // 使用 lean() 提高查询性能

        res.status(200).json(users);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch users list.',
            details: error.message
        });
    }
};

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getAllUsers,
    uploadImage,
    authUser,
    getUsers, // 新增导出
};
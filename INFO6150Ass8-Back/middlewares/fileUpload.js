// middlewares/fileUpload.js

const multer = require('multer');
const path = require('path');
const User = require('../models/userModel'); // 需要引用 User Model 来检查是否已存在图片

// 1. 设置存储目标和文件名
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // 确保 'images' 文件夹存在（您可能需要手动创建它）
        cb(null, 'images'); 
    },
    filename: (req, file, cb) => {
        // 使用 email + 时间戳作为唯一文件名，避免冲突
        const email = req.body.email.toLowerCase().replace(/[^a-z0-9]/g, '_');
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        
        // 文件名格式: <email>-<timestamp>.<ext>
        cb(null, email + '-' + uniqueSuffix + fileExtension);
    }
});

// 2. 文件过滤函数 (格式和唯一性验证)
const fileFilter = async (req, file, cb) => {
    // a. 格式验证：只允许 JPEG, PNG, GIF
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (!mimetype || !extname) {
        // 传递一个自定义错误
        return cb(new Error('Invalid file format. Only JPEG, PNG, and GIF are allowed.'), false);
    }

    // b. 唯一性验证：检查用户是否已存在图片
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            // 如果用户不存在，阻止上传并抛出错误
            return cb(new Error('User not found.'), false);
        }
        
        if (user.imagePath) {
            // 如果 user.imagePath 字段有值，说明图片已存在
            return cb(new Error('Image already exists for this user.'), false);
        }

        // 将 user 对象附加到请求中，方便后续控制器使用
        req.user = user; 
        
        // 格式和唯一性都通过
        cb(null, true); 

    } catch (error) {
        console.error("Image uniqueness check failed:", error);
        cb(new Error('Internal server error during validation.'), false);
    }
};

// 3. Multer 实例
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 限制文件大小为 5MB
    }
});

/**
 * 封装 Multer 逻辑的中间件，处理错误响应。
 * Multer 的错误处理机制比较特殊，需要手动封装来返回 400 状态码。
 */
const uploadImageMiddleware = (req, res, next) => {
    // 'image' 是在 Postman 中 form-data 的 key name
    upload.single('image')(req, res, function (err) { 
        if (err instanceof multer.MulterError) {
            // Multer 自身错误 (如文件过大)
            return res.status(400).json({ error: err.message });
        } 
        
        if (err) {
            // 自定义错误 (如文件格式、图片已存在、用户未找到)
            if (err.message.includes('Invalid file format')) {
                 return res.status(400).json({ error: 'Invalid file format. Only JPEG, PNG, and GIF are allowed.' });
            }
             if (err.message.includes('Image already exists')) {
                 return res.status(400).json({ error: 'Image already exists for this user.' });
            }
             if (err.message.includes('User not found')) {
                 return res.status(404).json({ error: 'User not found.' });
            }
            
            // 其他未知错误
            return res.status(500).json({ error: 'An unknown error occurred during file upload: ' + err.message });
        }
        
        // 如果没有错误，继续下一个中间件或控制器
        next();
    });
};

module.exports = { uploadImageMiddleware };
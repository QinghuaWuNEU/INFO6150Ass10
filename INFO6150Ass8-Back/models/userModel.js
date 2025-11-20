// models/userModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // 确保 email 唯一
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        // 存储用户上传图片的路径
        imagePath: { 
            type: String,
            required: false, // 初始时可以没有图片
            default: null,
        },
        type: {
        type: String,
        required: true,
        enum: ['admin', 'employee'], // 使用 enum 确保值有效
        default: 'employee' // 可以设置一个默认值，例如 'employee'
        }
    },
    {
        timestamps: true, // 自动添加 createdAt 和 updatedAt
    }
);

/**
 * 钩子 (Hook) - 在保存到数据库之前执行
 * 用于在用户创建或更新密码时自动哈希密码。
 */
userSchema.pre('save', async function (next) {
    // 只有在密码字段被修改（或新建）时才执行哈希
    if (!this.isModified('password')) {
        return next();
    }

    // 10是推荐的盐值（Salt）长度
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// **比较输入密码和哈希密码的方法**
userSchema.methods.matchPassword = async function (enteredPassword) {
    // 使用 bcrypt.compare 比较明文密码和存储的哈希值
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
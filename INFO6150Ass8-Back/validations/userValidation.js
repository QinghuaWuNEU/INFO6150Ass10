// validations/userValidation.js

const validator = require('validator');

// 密码强度的正则表达式：
// - 至少 8 个字符
// - 至少包含 1 个大写字母 ([A-Z])
// - 至少包含 1 个小写字母 ([a-z])
// - 至少包含 1 个数字 ([0-9])
// - 至少包含 1 个特殊字符 ([^A-Za-z0-9])
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

/**
 * 验证用户创建和更新时的输入字段。
 * @param {object} data - 包含 fullName, email, password 的对象
 * @param {boolean} isUpdate - 是否为更新操作 (更新时 email 不可更新，可不传)
 * @returns {object} { isValid: boolean, message: string }
 */
const validateUserInput = (data, isUpdate = false) => {
    const { fullName, email, password } = data;

    // --- 1. 验证 Full Name ---
    if (fullName) {
        // 验证全名只允许字母和空格（允许名和姓之间有空格）
        if (!validator.isAlpha(fullName.replace(/\s/g, ''), 'en-US')) {
             return { isValid: false, message: 'Full Name validation failed: Name must only contain alphabetic characters.' };
        }
    } else if (!isUpdate) { // 创建时全名是必填的
         return { isValid: false, message: 'Validation failed: Full Name is required.' };
    }


    // --- 2. 验证 Email (创建时必填，更新时不能传) ---
    if (!isUpdate && email) {
        if (!validator.isEmail(email)) {
            return { isValid: false, message: 'Email validation failed: Email must be in a valid format.' };
        }
    } else if (!isUpdate) { // 创建时 Email 是必填的
         return { isValid: false, message: 'Validation failed: Email is required.' };
    }


    // --- 3. 验证 Password (创建时必填，更新时可选) ---
    if (password) {
        if (!strongPasswordRegex.test(password)) {
            return { isValid: false, message: 'Password validation failed: Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a digit, and a special character.' };
        }
    } else if (!isUpdate) { // 创建时 Password 是必填的
         return { isValid: false, message: 'Validation failed: Password is required.' };
    }
    
    // 确保更新操作至少有一个字段被传递
    if (isUpdate && !fullName && !password) {
        return { isValid: false, message: 'Validation failed: At least one field (Full Name or Password) must be provided for update.' };
    }

    return { isValid: true, message: 'Validation successful.' };
};

module.exports = { validateUserInput };
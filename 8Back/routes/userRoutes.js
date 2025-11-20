// routes/userRoutes.js

const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const express = require('express');
const { 
    createUser, 
    updateUser, 
    deleteUser, 
    getUsers, 
    uploadImage, 
    authUser
} = require('../controllers/userController');
const { uploadImageMiddleware } = require('../middlewares/fileUpload');

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Users
 * description: User management and authentication endpoints
 */

/**
 * @swagger
 * /user/create:
 * post:
 * summary: Creates a new user
 * tags: [Users]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserCreation'
 * responses:
 * 201:
 * description: User created successfully.
 * content:
 * application/json:
 * example: { "message": "User created successfully." }
 * 400:
 * description: Validation failed (email format, name chars, weak password)
 * content:
 * application/json:
 * example: { "error": "Password validation failed: Password must be at least 8 characters long, ..." }
 */

// 1. User Creation: POST /user/create
router.post('/create', createUser);

/**
 * @swagger
 * /user/edit:
 * put:
 * summary: Updates a user's full name or password (Email cannot be changed)
 * tags: [Users]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserUpdate'
 * responses:
 * 200:
 * description: User updated successfully.
 * content:
 * application/json:
 * example: { "message": "User updated successfully." }
 * 400:
 * description: Validation failed or required email missing.
 * 404:
 * description: User not found.
 */

// 2. Update User Details: PUT /user/edit
router.put('/edit', authMiddleware, updateUser);

/**
 * @swagger
 * /user/delete:
 * delete:
 * summary: Deletes a user by email
 * tags: [Users]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required: [email]
 * properties:
 * email: { type: 'string', format: 'email' }
 * responses:
 * 200:
 * description: User deleted successfully.
 * 404:
 * description: User not found.
 */

// 3. Delete User: DELETE /user/delete
router.delete('/delete', authMiddleware, deleteUser);

/**
 * @swagger
 * /user/getAll:
 * get:
 * summary: Retrieves a list of all users
 * tags: [Users]
 * responses:
 * 200:
 * description: A list of users.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * users:
 * type: array
 * items:
 * type: object
 * properties:
 * fullName: { type: 'string' }
 * email: { type: 'string' }
 * password: { type: 'string', description: 'Hashed password as stored in DB.' }
 * imagePath: { type: 'string', nullable: true }
 */

// 4. Retrieve All Users: GET /user/getAll
router.get('/getAll', getUsers);

/**
 * @swagger
 * /user/uploadImage:
 * post:
 * summary: Uploads a single image for a user
 * tags: [Users]
 * requestBody:
 * required: true
 * content:
 * multipart/form-data:
 * schema:
 * type: object
 * properties:
 * email:
 * type: string
 * description: Email of the user to associate the image with.
 * image:
 * type: string
 * format: binary
 * description: The image file (JPEG, PNG, or GIF).
 * responses:
 * 201:
 * description: Image uploaded successfully.
 * content:
 * application/json:
 * example: { "message": "Image uploaded successfully.", "filePath": "/images/filename.extension" }
 * 400:
 * description: Invalid file format or image already exists.
 * 404:
 * description: User not found.
 */

// 5. Upload Image: POST /user/uploadImage
// 注意：uploadImageMiddleware 必须在 controller 之前运行
router.post('/uploadImage', uploadImageMiddleware, uploadImage);

/**
 * @swagger
 * /user/login:
 * post:
 * summary: Authenticates a user and returns a JWT token
 * tags: [Users]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * $ref: '#/components/schemas/UserLogin'
 * responses:
 * 200:
 * description: Login successful, returns JWT token.
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * message: { type: 'string' }
 * user: { type: 'object' }
 * token: { type: 'string' }
 * 401:
 * description: Invalid email or password.
 * content:
 * application/json:
 * example: { "error": "Invalid email or password." }
 */

// 6. User Login: POST /user/login
router.post('/login', authUser);

// Ass10新增: Get Users with Auth: GET /users
router.get('/users', authMiddleware, userController.getUsers);

module.exports = router;
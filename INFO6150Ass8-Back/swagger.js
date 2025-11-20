// swagger.js

const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    // API 文档的基本信息
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Secure User API (INFO6150 Assignment)',
            version: '1.0.0',
            description: 'RESTful API for managing users and handling image uploads, with secure password storage and authentication.',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development Server',
            },
        ],
        components: {
            // 定义安全方案 (用于 JWT)
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            // 定义可复用的 Schema (数据结构)
            schemas: {
                UserCreation: {
                    type: 'object',
                    required: ['fullName', 'email', 'password'],
                    properties: {
                        fullName: { type: 'string', example: 'Jane Doe' },
                        email: { type: 'string', format: 'email', example: 'jane.doe@example.com' },
                        password: { type: 'string', example: 'SecureP@ssword123' },
                    },
                },
                UserLogin: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'jane.doe@example.com' },
                        password: { type: 'string', example: 'SecureP@ssword123' },
                    },
                },
                UserUpdate: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', format: 'email', description: 'Required to identify user, but cannot be updated.', readOnly: true, example: 'user@example.com' },
                        fullName: { type: 'string', example: 'Jane Smith' },
                        password: { type: 'string', example: 'NewSecureP#456' },
                    },
                },
            },
        },
    },
    // 指定 JSDoc 注释所在的文件的路径
    apis: ['./routes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
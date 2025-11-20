// controllers/companyController.js

exports.getCompanyList = (req, res) => {
    // 假设这些数据是从数据库中获取的，但为了简化，我们使用硬编码数据
    // 关键是：imageUrl 必须是您的静态服务路径能识别的相对路径
    const companies = [
        { id: 1, name: "TechNova Solutions", imageUrl: "/images/tech-logo.png" },
        { id: 2, name: "Digital Edge Inc.", imageUrl: "/images/digital-edge.jpg" },
        { id: 3, name: "Global Innovate", imageUrl: "/images/global-innovate.gif" },
        // 您可以从数据库中查询更多公司数据
    ];

    // 返回 JSON 列表给前端
    res.json(companies);
};
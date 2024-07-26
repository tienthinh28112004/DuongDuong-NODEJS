const systemConfig=require("../../config/system");

const authMiddleware =require("../../middlewares/admin/auth.middleware");//check thỏa mãn mới cho đi qua

const dashboardRoutes=require("./dashboard.route");
const productRoutes=require("./product.route");
const productCategoryRoutes=require("./product-category.route");
const roleRoutes=require("./role.route");
const accountRoutes=require("./account.route");
const authRoutes=require("./auth.route");
//add authMiddleware.requireAuth vào để có thể check xem token đã thỏa mãn chưa
module.exports=(app)=>{ //exports giúp code tái sử dụng ở nhiều nơi.cần truyền vào tham số app trong file DuongDuong
    const PATH_ADMIN=systemConfig.prefixAdmin;
    
    app.use(PATH_ADMIN+"/dashboard",authMiddleware.requireAuth,dashboardRoutes);

    app.use(PATH_ADMIN+"/products",authMiddleware.requireAuth,productRoutes);

    app.use(PATH_ADMIN+"/products-category",authMiddleware.requireAuth,productCategoryRoutes);

    app.use(PATH_ADMIN+"/roles",authMiddleware.requireAuth,roleRoutes);

    app.use(PATH_ADMIN+"/accounts",authMiddleware.requireAuth,accountRoutes);

    app.use(PATH_ADMIN+"/auth",authRoutes);

}
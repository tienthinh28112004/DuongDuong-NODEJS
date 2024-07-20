const systemConfig=require("../../config/system");

const dashboardRoutes=require("./dashboard.route");
const productRoutes=require("./product.route");
const productCategoryRoutes=require("./product-category.route");

module.exports=(app)=>{ //exports giúp code tái sử dụng ở nhiều nơi.cần truyền vào tham số app trong file DuongDuong
    const PATH_ADMIN=systemConfig.prefixAdmin;
    
    app.use(PATH_ADMIN+"/dashboard",dashboardRoutes);

    app.use(PATH_ADMIN+"/products",productRoutes);

    app.use(PATH_ADMIN+"/products-category",productCategoryRoutes);
}
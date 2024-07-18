const homeRoutes=require("./home.route");
const productRoutes=require("./product.route");

module.exports=(app)=>{ //exports giúp code tái sử dụng ở nhiều nơi.cần truyền vào tham số app trong file DuongDuong
    app.use("/",homeRoutes);
    // dong o home va product da dung get roi nen o day dungf use tuc la su dung cung duoc
    app.use("/products",productRoutes);

}
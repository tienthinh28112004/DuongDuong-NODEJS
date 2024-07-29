const categoryMiddleware = require("../../middlewares/client/category.middleware")

const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");
const searchRoutes = require("./search.route");

module.exports = (app) => { //exports giúp code tái sử dụng ở nhiều nơi.cần truyền vào tham số app trong file DuongDuong
    app.use(categoryMiddleware.category);//(gần như trang nào cũng sử dụng nên đưa lên đây)mục đích sử dụng middleware ở đây là hợp thức hóa việc có biến res.locals.productscategory,từ đó đi được vào header(phần trên menu) để trả ra giao diện sản phẩm đẹp
    app.use("/", homeRoutes);  
    // dong o home va product da dung get roi nen o day dungf use tuc la su dung cung duoc
    app.use("/products", productRoutes);

    app.use("/search", searchRoutes);

}
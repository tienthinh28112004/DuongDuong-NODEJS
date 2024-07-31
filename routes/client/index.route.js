const categoryMiddleware = require("../../middlewares/client/category.middleware")
const cartMiddleware = require("../../middlewares/client/cart.middleware")
const userMiddleware = require("../../middlewares/client/user.middleware")

const homeRoutes = require("./home.route");
const productRoutes = require("./product.route");
const searchRoutes = require("./search.route");
const cartRoutes = require("./cart.route");
const checkoutRoutes = require("./checkout.route");
const userRoutes = require("./user.route");
//đăng nhập xong sẽ vào đây
module.exports = (app) => { //exports giúp code tái sử dụng ở nhiều nơi.cần truyền vào tham số app trong file DuongDuong
    app.use(categoryMiddleware.category);//(gần như trang nào cũng sử dụng nên đưa lên đây)mục đích sử dụng middleware ở đây là hợp thức hóa việc có biến res.locals.productscategory,từ đó đi được vào header(phần trên menu) để trả ra giao diện sản phẩm đẹp
    
    app.use(cartMiddleware.cartId);//dùng cho tất cả các trang

    app.use(userMiddleware.infoUser);//nhúng vào trang chính nên dùng được tất các trang(còn bên admin không phải lúc nào cũng dùng nên không cần nhúng vào tất cả)
    
    app.use("/", homeRoutes);  
    // dong o home va product da dung get roi nen o day dungf use tuc la su dung cung duoc
    app.use("/products", productRoutes);

    app.use("/search", searchRoutes);

    app.use("/cart", cartRoutes);
    
    app.use("/checkout", checkoutRoutes);

    app.use("/user", userRoutes);

}
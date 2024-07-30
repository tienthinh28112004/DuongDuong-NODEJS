const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

const productsHelper = require("../../helpers/products");

// [GET] /checkout/
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });

    if(cart.products.length > 0){//kiểm tra xem có sản phẩm nào trong giỏ hàng không
        for (const item of cart.products) {//nếu có lọc qua từng sản phẩm trong giỏ hàng
            const productId = item.product_id;//gán biến productId bằng id của hàng hóa
            const productInfo = await Product.findOne({//lọc qua Product lấy sản phẩm có id giống với id lấy được
                _id: productId,
            }).select("title thumbnail slug price discountPercentage");//lấy ra tiêu đề hình ảnh slug giá cũ,% giảm giá
            
            productInfo.priceNew = productsHelper.priceNewProduct(productInfo);//gán thêm cho product 1 key là pricenew rồi sử dụng helper để tính giá mới
            
            item.productInfo = productInfo;//gán thêm 1 key productInfo cho item
        
            item.totalPrice = productInfo.priceNew * item.quantity;//tổng tiền của sản phẩm
        }
    };
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice,0);//tổng tiền của toàn bộ giỏ hàng
    res.render("client/pages/checkout/index",{
        pageTitle: "Đặt hàng",
        cartDetail: cart
    });
};

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;//gán userInfo bằng object req.body(object mình gửi lên)

    const cart = await Cart.findOne({
        _id: cartId
    });
    const products = [];

    for(const product of cart.products){
        const objectProduct = {//phần này chỉ lấy ra id vs số lương đặt hàng thôi,vì nếu để lâu thì sẽ có thay đổi về giá và giảm giá,vậy nên cần lấy ra sản phẩm thông qua id rồi truy cập vào giá và %giảm giá mới của nó
            product_id: product.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: product.quantity
        };

        const productInfo = await Product.findOne({
            _id: product.product_id//thông qua id của sản phẩm truy cập vào model product để lấy ra được gái và % giảm giá hiện tại của sản phẩm
        }).select("price discountPercentage");//chỉ lấy ra giá trị price và discountPerdentage

        objectProduct.price = productInfo.price;//cập nhật lại giá hiện tại cho sản phẩm
        objectProduct.discountPercentage = productInfo.discountPercentage;//cập nhật lại % giảm gái hiện tại của sản phẩm
        
        products.push(objectProduct);//push mảng objectProduct vào product trong model(cập nhật lại giá thành ,% gairm giá hiện tại,đưa cả vào id và số lượng đặt nữa=.cập nhật lại)
    
    };
    const orderInfor ={
        cart_id: cartId,//id của giỏ hàng
        userInfo:userInfo,//thông tin địa chỉ người ta nhập vào (lấy từ req.body) 
        products:products,//mảng các id,giá cũ,% giảm giá,số lượng của sản phẩm(có thể có nhiều sản phẩm nên phải lưu vào mảng)
    };

    const order = new Order(orderInfor);//tạo 1 order mới lưu lại các giá trị
    order.save();//lưu lại order vào trong colection order trong database

    await Cart.updateOne({
        _id: cartId
    },{
        products: [],//sau khi thanh toán thì phải reset mảng về mảng rỗng
        //ở đây nên làm thêm nút chọn để người ta có thể chọn nhwungx đơn hàng muốn thanh toán thay vì chọn hết ,nếu làm nút chọn thì phải sử dụng câu lệnh pull để xóa sản phẩm ấy ra khỏi giỏ hàng
    });
    res.redirect(`/checkout/success/${order.id}`);//thanh toán xong thì đưa đến trang thông báo thành công(ở đây thêm id cho uy tín)
}

//[GET] /checkout/success/:orderId
module.exports.success = async (req, res) =>{
    const order = await Order.findOne({
        _id: req.params.orderId//_id đây là id ramdom
    });

    for (const product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id,//tìm sản phẩm có id trùng với product,product_id
        });
        product.productInfo = productInfo;//gán thêm biến productInfo cho product

        product.priceNew = productsHelper.priceNewProduct(product);//tính tiền mới cho từng sản phẩm

        product.totalPrice = product.priceNew * product.quantity;//tính tổng tiền mới của từng sản phẩm
    }
    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice,0);

    res.render("client/pages/checkout/success",{
        pageTitle: "Đặt hàng thành công",
        order: order
    });
}
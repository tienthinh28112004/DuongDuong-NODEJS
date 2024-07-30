const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");

//[GET] /Cart/
module.exports.index = async (req,res) => {
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
    }

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice,0);//tổng tiền của toàn bộ giỏ hàng
    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    });
}

//[POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId; //lưu lại id của sản phẩm
    const quantity = parseInt(req.body.quantity); //lấy ra số lượng sản phẩm
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    }); //tìm là giỏ hàng có id giống với cartId(cart này có 2 phần tử là id và object products)

    const existProductInCart = cart.products.find(item => item.product_id == productId); //từ biến cart chỏ đến object products từ đấy kiểm tra xem trong cart có obeject này có id chưa

    if (existProductInCart) {
        const quantityNew = quantity + existProductInCart.quantity;
        //hàm update lại biến (stackoverflow)
        await Cart.updateOne({
            _id: cartId,
            "products.product_id": productId
        },{
            $set: {
                "products.$.quantity":quantityNew //update lại biến products.quantity
            }
        }
        );
        //hàm hết update lại biến
    } else {
        const objectCart = { //tạo 1 object để thông qua id của giỏ hàng, lưu vào trong giỏ hàng
            product_id: productId,
            quantity: quantity
        };

        await Cart.updateOne({
            _id: cartId
        }, {
            $push: {//add thêm sản phẩm vào thì sử dụng phương thức push
                products: objectCart
            } //cập nhật 1 object mới cho product trong model(cập nhật sản phẩm mới vào trong giỏ hàng(thông qua id))
        });

    }

    req.flash("success", "Đã thêm sản phẩm vào giỏ hàng");

    res.redirect("back");
}

//[GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    //hàm xóa 1 sản phẩm trong products thông qua id của cart
    await Cart.updateOne({
        _id: cartId
    }, {
        $pull: {products: { product_id : productId } }//hàm xóa bản ghi(thông qua cartid truy caaph vào product sau đó tìm đến bản ghi có id giống với productId để xóa)
    });
    //hết hàm xóa sản phẩm
    req.flash("success","Đã xóa sản phầm khỏi giỏ hàng");

    res.redirect("back");
}
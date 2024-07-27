const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products")

//[GET] /
module.exports.index = async(req,res)=>{
    //lấy ra sản phẩm nổi bật
    const productsFeatured = await Product.find({
        featured: "1",//featured =1 tức là sản phẩm nổi bật
        deleted: false,
        status: "active"
    });

    const newProducts= productsHelper.priceNewProducts(productsFeatured);
    //hết lấy ra sản phẩm nổi bật
    res.render("client/pages/home/index",{
        //khi dùng render thì nó tự động vào views
        pageTitle:"Trang chủ",
        productsFeatured: newProducts
    });
}
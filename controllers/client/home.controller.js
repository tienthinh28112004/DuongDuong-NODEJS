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

    const newProductsFeatured= productsHelper.priceNewProducts(productsFeatured);
    //hết lấy ra sản phẩm nổi bật

    //hiển thị danh sách dản phẩm mới nhất
    const productsNew = await Product.find({
        deleted: false,
        status: "active"
    }).sort({position: "desc"}).limit(6);

    const newProductsNew = productsHelper.priceNewProducts(productsNew);
    //hết hiển thị danh ách sản phẩm mới nhất

    res.render("client/pages/home/index",{
        //khi dùng render thì nó tự động vào views
        pageTitle:"Trang chủ",
        productsFeatured: newProductsFeatured,
        productsNew: newProductsNew
    });
}
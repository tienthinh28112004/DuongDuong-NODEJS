const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products")

//[GET] /search
module.exports.index = async(req,res)=>{
    const keyword = req.query.keyword;//đường link url có dạng ...?keyword=value (thì dùng req.query.keyword sẽ lấy được giá trị value)

    let newProducts = [];//khai báo mảng ở đây để tránh khi vào if ms khai báo thì render không nhận được
    if(keyword){//kiểm tra có keyword không rồi mới chạy tiếp
        const regex =  new RegExp(keyword,"i");//trả ra các giá trị liên quan đến giá trị keyword,từ i để không phân biệt hoa thường
        const products = await Product.find({
            title: regex,//tìm các sản phẩm có title giống regex (gần giống hoặc giống keyword)
            deleted: false,
            status: "active"
        });

        newProducts = productsHelper.priceNewProducts(products);
    }

    res.render("client/pages/search/index",{
        //khi dùng render thì nó tự động vào views
        pageTitle:"Kết quả tìm kiếm",
        keyword: keyword,
        products: newProducts
    });
}
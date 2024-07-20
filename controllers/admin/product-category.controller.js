const ProductCategory=require("../../models/product-category.model");

const systemConfig = require("../../config/system"); // nhúng file system trong config và file này

//[GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };

    const records = await ProductCategory.find(find);

    res.render("admin/pages/products-category/index", {
        //khi dùng render thì nó tự động vào views
        pageTitle: "Danh mục sản phẩm",
        records: records
    });
};

//[GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products-category/create", {
        //khi dùng render thì nó tự động vào views
        pageTitle: "Tạo danh mục sản phẩm"
    });
};

//[POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if (req.body.position == "") { // nếu người ta không nhập gì vào position thì tự động cho nó bằng length+1
        const count = await ProductCategory.countDocuments;//hàm countDocument giúp đếm số lượng phần tử trong database nhanh nhất
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position); //nếu người ta chuyền vào thì chuyển dạng từ string sang number
    }
    const record = new ProductCategory(req.body); // đây là cú pháp tạo mới 1 sản phẩm sao lưu key value của object req.body đã nhập vào sang 1 product mới
    await record.save(); //lưu dữ vừa tạo ra vào lại database

    res.redirect(`${systemConfig.prefixAdmin}/products-category`); // sau khi xong chạy đến trang khác
}
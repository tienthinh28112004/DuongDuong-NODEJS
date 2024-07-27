const ProductCategory=require("../../models/product-category.model");

const createTreeHelper = require("../../helpers/createTree");

module.exports.category = async(req,res,next) =>{
    const productsCategory = await ProductCategory.find({
        deleted: false
    });

    const newProductsCategory = createTreeHelper.tree(productsCategory);//hàm này dùng đệ quy để tìm các con cho bố(không hiểu vào helper xem lại)

    res.locals.layoutProductsCategory = newProductsCategory;
    next();
}
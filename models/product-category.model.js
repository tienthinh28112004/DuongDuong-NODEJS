const mongoose = require("mongoose");
const slug=require('mongoose-slug-updater');//nhúng slug vào

mongoose.plugin(slug);//hàm slug để giúp làm đuôi cho trang tại client

const productCategorySchema = new mongoose.Schema({
    title: String, // sản phẩm 1
    parent_id: {
        type: String,
        default: "",//để giá trị mặc định nếu không nhập của parent_id là rỗng
    },
    description: String,
    thumbnail: String,
    status: String,
    position: Number,
    slug:{
        type: String,
        slug: "title", //san-pham-1 (lấy cái này làm đuôi link trong client)
        unique: true //tránh bị trùng slug,nếu trùng thì cái đầu tiên được nhận còn cái thứ 2 sẽ dính thêm 1 xâu ramdom
    },
    deleted: {
        type:Boolean,
        default:false// gán cho các sản phẩm mới nhập đều có giá trị mặc định false=>thì lọc mới lấy được item
    },
    deletedAt: Date//cho biết thời gian xóa sản phẩm
},{
    timestamps: true//có 2 thuộc tính createAt và updateAt giúp biết được thời gian sửa xóa sản phẩm
});
const ProductCategory = mongoose.model("ProductCategory",productCategorySchema,"products-category");//tham số thứ 3 là tên colection trong database//

module.exports=ProductCategory;
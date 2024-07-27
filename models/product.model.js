const mongoose = require("mongoose");
const slug=require('mongoose-slug-updater');//nhúng slug vào

mongoose.plugin(slug);//hàm slug để giúp làm đuôi cho trang tại client

const productSchema = new mongoose.Schema({
    title: String, // sản phẩm 1
    product_category_id:{
        type: String,
        default: ""
    },
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    thumbnail: String,
    status: String,
    featured: String,
    position: Number,
    slug:{
        type: String,
        slug: "title", //san-pham-1 (lấy cái này làm đuôi link trong client)
        unique: true //tránh bị trùng slug,nếu trùng thì cái đầu tiên được nhận còn cái thứ 2 sẽ dính thêm 1 xâu ramdom
    },
    createdBy: {
        account_id: String,//object này lưu id của tài khoản
        createdAt: {
            type: Date,
            default: Date.now//hàm chỉ thời gian hiện tại
        }//craetedAt này lưu thời gian tạo (tương tự giống timestamps ở dưới)
    },
    deleted: {
        type:Boolean,
        default:false// gán cho các sản phẩm mới nhập đều có giá trị false=>thì lọc mới lấy được item
    },
    //deletedAt: Date//cho biết thời gian xóa sản phẩm
    deletedBy: {
        account_id: String,//object này lưu id của tài khoản
        deletedAt: Date,
    },
    updatedBy: [
        {
            account_id: String,//object này lưu id của tài khoản
            updatedAt: Date,
        }
   
    ],
},{
    timestamps: true//có 2 thuộc tính createAt và updateAt giúp biết được thời gian sửa xóa sản phẩm
});
const Product = mongoose.model("Product",productSchema,"products");//tham số thứ 3 là tên colection trong database//

module.exports=Product;
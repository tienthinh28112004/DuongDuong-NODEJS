const mongoose = require("mongoose");
//role là các nhóm quyền(đây là model các nhóm quyền)
const roleSchema = new mongoose.Schema({
    title: String, // sản phẩm 1
    description: String,
    permissions:{
        type: Array,
        default: []
    },
    deleted: {
        type:Boolean,
        default:false// gán cho các sản phẩm mới nhập đều có giá trị false=>thì lọc mới lấy được item
    },
    deletedAt: Date//cho biết thời gian xóa sản phẩm
},{
    timestamps: true//có 2 thuộc tính createAt và updateAt giúp biết được thời gian sửa xóa sản phẩm
});
const Role = mongoose.model("Role",roleSchema,"roles");//tham số thứ 3 là tên colection trong database//

module.exports=Role;
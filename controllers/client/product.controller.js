const Product=require("../../models/product.model")

//[GET] /products
module.exports.index = async(req,res) => {

    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position: "desc" });//có hàm sort dùng để sắp xếp vị trí(sắp xếp giảm dần là desc còn sắp xếp tăng dần là asc),ở đây là sắp xếp theo position(vị trí)
   
    
    const newProducts=products.map(item=>{
        item.priceNew=(item.price*(100-item.discountPercentage)/100).toFixed(0);
        return item;
        //item.pricenew ở đây không cần khai báo vì JavaScript cho phép bạn thêm thuộc tính mới vào các đối tượng mà không cần khai báo trước.
    });
    res.render("client/pages/products/index",{
        pageTitle: "danh sach san pham",
        products: newProducts
    });
}

//[GET] /products/:slug
module.exports.detail = async(req,res) => {
    //req.params là lấy ra những cái gì người ta nhập được lưu trong database
    try {//sở người ta nhập bừa id sẽ làm lỗi server nên phải đưa vào try catch để chắc chắn nó đúng
        const find = { // có id của sản phẩm nên ta sẽ tạo 1object find để tìm sản phẩm(tương tự phần tìm kiếm)
            deleted: false,
            slug: req.params.id, //tìm theo trường slug(ở đây tim thoe slug không cần tìm theo id)
            status:"active"
        }

        const product = await Product.findOne(find); //truyền hàm find vào findOne để tìm được 1 object bản ghi(nếu chỉ dùng find thì nó sẽ trả ra 1 mảng accs object nhưng vì id chỉ có 1 nên trong mảng ấy cũng chỉ có 1 object,vẫn có thể dùng find rồi trỏ đến phần tử 0 cũng được) 

        res.render("client/pages/products/detail", {
            //khi dùng render thì nó tự động vào views
            pageTitle: product.title,//cho title hiện lên
            product: product //truyền biến product ra view
        });
    } catch (error) {
        req.flash("error","không tồn tại sản phẩm này");//hiện ra thông báo
        res.redirect(`/products`);//nếu try catch thất bại cho nó chạy về /products(trang sản phẩm)(do đây là trang bên client nên không có ${systemConfig.prefixAdmin})
    }
};

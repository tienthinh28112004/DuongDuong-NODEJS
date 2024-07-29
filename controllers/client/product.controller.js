const Product = require("../../models/product.model")
const ProductCategory = require("../../models/product-category.model")

const productsHelper = require("../../helpers/products")
const productsCategoryHelper = require("../../helpers/products-category")

//[GET] /products
module.exports.index = async(req,res) => {

    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({position: "desc" });//có hàm sort dùng để sắp xếp vị trí(sắp xếp giảm dần là desc còn sắp xếp tăng dần là asc),ở đây là sắp xếp theo position(vị trí)
   
    
    const newProducts= productsHelper.priceNewProducts(products);
    res.render("client/pages/products/index",{
        pageTitle: "Danh Sách sản phẩm",
        products: newProducts
    });
}

//[GET] /products/:slugProduct
module.exports.detail = async(req,res) => {
    //req.params là lấy ra những cái gì người ta nhập được lưu trong database
    try {//sở người ta nhập bừa id sẽ làm lỗi server nên phải đưa vào try catch để chắc chắn nó đúng
        const find = { // có id của sản phẩm nên ta sẽ tạo 1object find để tìm sản phẩm(tương tự phần tìm kiếm)
            deleted: false,
            slug: req.params.slugProduct, //tìm theo trường slug(ở đây tim thoe slug không cần tìm theo id)
            status:"active"
        };

        const product = await Product.findOne(find); //truyền hàm find vào findOne để tìm được 1 object bản ghi(nếu chỉ dùng find thì nó sẽ trả ra 1 mảng accs object nhưng vì id chỉ có 1 nên trong mảng ấy cũng chỉ có 1 object,vẫn có thể dùng find rồi trỏ đến phần tử 0 cũng được) 

        if(product.product_category_id){//nếu product có danh mục cha
            const category = await ProductCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false
            });
            //lấy ra cái cha rồi gán lại vào product
            product.category = category;
        };
        //dùng hàm helper để gán thêm biến mới 
        product.priceNew = productsHelper.priceNewProduct(product);
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

//[GET] /products/:slugCategory
module.exports.category = async(req,res) => {
        const category = await ProductCategory.findOne({//tìm bản ghi có slug giống với slug được gửi lên
            slug: req.params.slugCategory,//tìm dánh mục có slug giống với slug được gửi lên url(req.params.slugCategory)
            status : "active",
            deleted: false
        });

        //hàm lấy ra các danh mục con(có sử dụng đệ quy)
        const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);//do hàm tìm danh mục con kia dùng async await để lấy trong data nên hàm này phải dùng await để đợi
        //hết hàm lấy ra các danh mục con
        const listSubCategoryId = listSubCategory.map(item => item.id);//lấy ra 1 mảng chứa các id của phần tử
        
        const products = await Product.find({//tìm tất cảnhững bản ghi có id giống với id của slug được gửi lên params
            product_category_id: { $in: [category.id, ...listSubCategoryId]},//truyền id các danh mục vào hàm $in giúp lấy ra tất cả danh mục có id như vậy
            deleted: false
        }).sort({position: "desc"});

        const newProducts= productsHelper.priceNewProducts(products);

        res.render("client/pages/products/index",{
            pageTitle: category.title,
            products: newProducts
        });
  
};

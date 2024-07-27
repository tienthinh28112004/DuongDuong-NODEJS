const ProductCategory=require("../../models/product-category.model");

const systemConfig = require("../../config/system"); // nhúng file system trong config và file này

const createTreeHelper = require("../../helpers/createTree");
//[GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper.tree(records);//hàm này dùng đệ quy để tìm các con cho bố(không hiểu vào helper xem lại)

    res.render("admin/pages/products-category/index", {
        //khi dùng render thì nó tự động vào views
        pageTitle: "Danh mục sản phẩm",
        records: newRecords
    });
};

//[GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    };
   
    const records = await ProductCategory.find(find).sort({position: "asc"});//tìm các cha để lựa chọn

    const newRecords = createTreeHelper.tree(records);//hàm này dùng đệ quy để tìm các con cho bố(không hiểu vào helper xem lại)

    res.render("admin/pages/products-category/create", {
        //khi dùng render thì nó tự động vào views
        pageTitle: "Tạo danh mục sản phẩm",
        records:newRecords
    });
};

//[POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    const permissions = res.locals.role.permissions;

    if(permissions.includes("products-category_create")){//phải cho vào ngoặc để tránh trường hợp ngta biết link rồi dùng postman vào xóa
        if (req.body.position == "") { // nếu người ta không nhập gì vào position thì tự động cho nó bằng length+1
            const count = await ProductCategory.countDocuments();//hàm countDocument giúp đếm số lượng phần tử trong database nhanh nhất
            req.body.position = count + 1;
        } else {
            req.body.position = parseInt(req.body.position); //nếu người ta chuyền vào thì chuyển dạng từ string sang number
        }
        const record = new ProductCategory(req.body); // đây là cú pháp tạo mới 1 sản phẩm sao lưu key value của object req.body đã nhập vào sang 1 product mới
        await record.save(); //lưu dữ vừa tạo ra vào lại database
    
        res.redirect(`${systemConfig.prefixAdmin}/products-category`); // sau khi xong chạy đến trang khác
    }else{
        res.send("403");
        return ;
    }
}

//[GET] /admin/products-category/edit/:id(lấy dữ liệu để trả ra trang)
module.exports.edit = async (req, res) => {
    try {//nếu tìm được danh mục đó thì mới in ra giao diện còn không thì link sang trang khác
        const id=req.params.id;

        const data=await ProductCategory.findOne({
            _id: id,
            deleted: false
        });

        const records = await ProductCategory.find({deleted:false});//tìm các cha để lựa chọn

        const newRecords = createTreeHelper.tree(records);//hàm này dùng đệ quy để tìm các con cho bố(không hiểu vào helper xem lại)

        res.render("admin/pages/products-category/edit", {
            //khi dùng render thì nó tự động vào views
            pageTitle: "Chỉnh sửa danh mục sản phẩm",
            data: data,
            records:newRecords
        });
    } catch (error) {//nếu không tìm được thì về trang danh mục sản phẩm
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
};

//[PATCH] /admin/products-category/edit/:id (đưa dữ liệu đã sửa ở trên vào database rồi đi đến trang)
module.exports.editPatch = async (req, res) => {
    const id=req.params.id;

    req.body.position = parseInt(req.body.position);

    await ProductCategory.updateOne({_id: id},req.body);//update mới toàn bộ bản ghi

    res.redirect("back");//sau khi update xong thì trả lại trang
};
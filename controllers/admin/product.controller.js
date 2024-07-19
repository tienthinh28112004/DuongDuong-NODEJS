const Product = require("../../models/product.model");

const systemConfig = require("../../config/system"); // nhúng file system trong config và file này
// chú ý file pug thì có thể dùng prefixAdmin(do trong file chính có khai báo chung rồi) luôn nhưng các file js thì phải nhúng vào rồi chấm gọi thì mới dùng được
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginantionHelper = require("../../helpers/pagination");

//[GET] /admin/products
module.exports.index = async (req, res) => {
    //console.log(req.query.status);//trên url có link là ?status=active thì req.query.status=active

    // đoạn bộ lọc
    const filterStatus = filterStatusHelper(req.query); //req.query là cái sau dấu chấm

    let find = {
        deleted: false
    };
    if (req.query.status) {
        find.status = req.query.status; //gán key status của find bằng req.query.status
    }
    // end bộ lọc

    //Tìm kiếm
    const objectSearch = searchHelper(req.query)

    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    //end tìm kiếm

    //pagination:phân trang

    const countProducts = await Product.countDocuments(find); // hàm count giúp đếm số lượng phần tử
    let objectPagination = paginantionHelper({
            currentPage: 1,
            limitItem: 4 //giới hạn số sản phẩm trong 1 trang
        },
        req.query,
        countProducts
    );
    //end pagination:hết phân trang
    const products = await Product.find(find).sort({
        position: "desc" //có hàm tên sort dùng để sắp xếp vị trí(sắp xếp giảm dần là desc còn sắp xếp tăng dần là asc)
    }).limit(objectPagination.limitItem).skip(objectPagination.skip); //dựa vào hàm let find(object) để tìm các giá trị phù hợp,[.limit(4) tức là chỉ lấy 4 sản phẩm đầu tiên(có thể không limit cũng được)],[ship(4) tức là bỏ qua 4 sản phẩm đầu]
    //console.log(products);
    res.render("admin/pages/products/index", {
        //khi dùng render thì nó tự động vào views
        pageTitle: "Danh sach san pham",
        products: products, //truyền product vào file admin/pages/products/index
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    });
}
//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    //console.log(req.params);// lấy ra những cái động(req.pấm là object)(trước dấu ?)
    //req.query là lấy sau dấu ?
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({
        _id: id
    }, {
        status: status
    }); //update 1 sản phẩm,id là id sản phẩm muốn update,cập nhật trường status=status(id là bắt buộc còn thuộc tính có thể bất kì)

    req.flash("success", "cập nhật trạng thái thành công!"); //khi thay đổi trạng thái mà muốn điền thống báo cho người dùng biết thì dùng hàm flash,cái đầu tiên là tiêu đề còn có thể là key,cái sau là nội dung thông báo,

    res.redirect("back"); //truyền chữ back thì nó sẽ tự động chuyển hướng về trang trước không làm mất dấu trang,còn không thì truyền link vào
};
//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", "); //chuyển từ xâu về mảng

    switch (type) {
        case "active":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "active"
            }); // update nhiều id,ids ở đây là mảng,biến status thành active
            req.flash("success", `Cập nhập trạng thái thành công của ${ids.length} sản phẩm`);
            break;
        case "inactive":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "inactive"
            }); // update nhiều id,biến status thành inactive
            req.flash("success", `Cập nhập trạng thái thành công của ${ids.length} sản phẩm`);
            break;
        case "delete-all":
            await Product.updateMany( //ở đây dùng xóa mềm còn nếu muốn xóa cứng thì dùng deleteMany
                {
                    _id: {
                        $in: ids
                    }
                }, // id như là 1 cái tên để biết đang thay đổi sản phẩm nào,bắt buộc phải có id
                {
                    deleted: true,
                    deletedAt: new Date()
                }
            );
            req.flash("success", `Xóa thành công ${ids.length} sản phẩm`);
            break;
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-"); //sử dụng destrutering:phá vỡ cấu trúc,do item ở đây là dạng id-position nên dùng spilt để tách chuỗi ra mảng,rồi dùng phá vỡ cấu trúc để lấy
                position = parseInt(position); //do position trong module là dạng number nên phải đổi dạng cho nó từ string sang number

                await Product.updateOne({
                    _id: id
                }, {
                    position: position //do mỗi id lại có 1 position khác nhau nên phải để trong hàm for để nó có thể duyệt hết các phần tử
                });
            }
            break;
        default:
            break;
    };
    res.redirect("back"); // ngăn cho nó chuyển đến trang khác
};
//[DELETE] /admin/products/delete/:id(xóa mềm)
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    //xóa mềm dùng update không mất trong data base còn xóa cứng thì dùng deleta mất luôn trong data base
    //await Product.deleteOne({_id: id});//(xóa cứng)xóa 1 item thì cần dùng deleteOne rồi truyền vào id của item muốn xóa(đây là xóa cứng xóa trong cả database)
    await Product.updateOne({//updateOne là update 1 bản ghi cần truyền vào id để giúp xác định sản phẩm,sau đó chuyền vào object các dữ liệu muốn thay đổi,update các thuộc tính
        _id: id
    }, {
        deleted: true,
        deletedAt: new Date() //new Date() là hàm trong javascript giúp cập nhập thời gian hiện tại
    }); //(xóa mềm) truy cập vào item qua id của nó,sau đó sửa thuộc tính deleted của nó sang true,lúc này nếu lọc sẽ không lọc được cái anyf do nó đã chuyển sang true =>xóa mềm(không mất item trong database)
    res.redirect("back");
};
//[GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", {
        //khi dùng render thì nó tự động vào views
        pageTitle: "Thêm mới sản phẩm",
    });
};
//[POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    //console.log(req.file);//giúp lấy ra object của ảnh(hỗ trợ đổi ảnh và chuyển và database)
    //console.log(req.body);//req.body giúp lấy ra data mà chúng ta nhập vào,nếu có nhập cả những trường không tồn tại trong chema thì nó cũng chỉ lưu được các trường có trong chema thôi
    req.body.price = parseInt(req.body.price) // do nhập vào từ bàn phím thì nó là string mà trong database lại lưa dạng kiểu number nên phải chuyển từ string về dạng number
    req.body.discountPercentage = parseInt(req.body.discountPercentage) // chuyển từ string về dạng number
    req.body.stock = parseInt(req.body.stock) // chuyển từ string về dạng number
    if (req.body.position == "") { // nếu người ta không nhập gì vào position thì tự động cho nó bằng length+1
        const countProducts = await Product.countDocuments();//hàm countDocument giúp đếm số lượng phần tử trong database nhanh nhất
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position); //nếu người ta chuyền vào thì chuyển dạng từ string sang number
    }
    // if (req.file) { // kiểm tra xem đã đưa ảnh vào chưa rồi ms chạy
    //     req.body.thambnail = `/uploads/${req.file.filename}`; //lưu thêm link ảnh vào database;req.file.filename là id ramdom của ảnh
    // }
    const product = new Product(req.body); // đây là cú pháp tạo mới 1 sản phẩm sao lưu key value của object req.body đã nhập vào sang 1 product mới
    await product.save(); //lưu dữ liệu product vừa tạo ra vào database

    res.redirect(`${systemConfig.prefixAdmin}/products`); // sau khi xong chạy đến trang nào cũng được,ở đây chạy đến tráng ản phẩm /admin/product
};
//[GET] /admin/products/create
module.exports.edit = async (req, res) => {
    //console.log(req)//là cái người dùng nhập vào,req.query là nhwungx cái sau dấu ?; còn req.param là 1 object những cái thuộc tính của vật được chọn để thay đổi
    // console.log(req.params.id) //lấy ra id của sản phẩm
    try {//sở người ta nhập bừa id sẽ làm lỗi server nên phải đưa vào try catch để chắc chắn nó đúng
        const find = { // có id của sản phẩm nên ta sẽ tạo 1object find để tìm sản phẩm(tương tự phần tìm kiếm)
            deleted: false,
            _id: req.params.id
        }

        const product = await Product.findOne(find); //truyền hàm find vào findOne để tìm được 1 object bản ghi(nếu chỉ dùng find thì nó sẽ trả ra 1 mảng accs object nhưng vì id chỉ có 1 nên trong mảng ấy cũng chỉ có 1 object,vẫn có thể dùng find rồi trỏ đến phần tử 0 cũng được) 

        res.render("admin/pages/products/edit", {
            //khi dùng render thì nó tự động vào views
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product //truyền biến product ra view
        });
    } catch (error) {
        req.flash("error","không tồn tại sản phẩm này");//hiện ra thông báo
        res.redirect(`${systemConfig.prefixAdmin}/products`);//nếu try catch thất bại cho nó chạy về /admin/products(trang sản phẩm)
    }
};
//[PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {//tương tự creatPost nên không hiểu nên đọc lại
    //req.body là object mà chúng ta sửa đổi và muốn lưu lại
    const id=req.params.id;//req.params đây là object của sản phẩm ở đó có đầy đủ thuộc tính ban đầu của sản phẩm
    
    req.body.price = parseInt(req.body.price) // do nhập vào từ bàn phím thì nó là string mà trong database lại lưa dạng kiểu number nên phải chuyển từ string về dạng number
    req.body.discountPercentage = parseInt(req.body.discountPercentage) // chuyển từ string về dạng number
    req.body.stock = parseInt(req.body.stock) // chuyển từ string về dạng number
    req.body.position = parseInt(req.body.position); //nếu người ta chuyền vào thì chuyển dạng từ string sang number

    // if (req.file) { // kiểm tra xem đã đưa ảnh vào chưa rồi ms chạy
    //     req.body.thambnail = `/uploads/${req.file.filename}`; //đường dẫn local lưu thêm link ảnh vào database;req.file.filename là id ramdom của ảnh
    // }
    try {
        await Product.updateOne({id:id},req.body);//ở đây update tất cả req.body
        req.flash("error","Cập nhật thành công");
    } catch (error) {
        req.false("erorr","Cập nhật thất bại")
    }

    res.redirect("back"); // sau khi xong chạy đến trang nào cũng được,ở đây chạy lại trang sửa vật phẩm ban đầu
};
//[GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {//giống trang edit
    //console.log(req)//là cái người dùng nhập vào,req.query là nhwungx cái sau dấu ?; còn req.param là 1 object những cái thuộc tính của vật được chọn để thay đổi
    // console.log(req.params.id) //lấy ra id của sản phẩm
    try {//sở người ta nhập bừa id sẽ làm lỗi server nên phải đưa vào try catch để chắc chắn nó đúng
        const find = { // có id của sản phẩm nên ta sẽ tạo 1object find để tìm sản phẩm(tương tự phần tìm kiếm)
            deleted: false,
            _id: req.params.id
        }

        const product = await Product.findOne(find); //truyền hàm find vào findOne để tìm được 1 object bản ghi(nếu chỉ dùng find thì nó sẽ trả ra 1 mảng accs object nhưng vì id chỉ có 1 nên trong mảng ấy cũng chỉ có 1 object,vẫn có thể dùng find rồi trỏ đến phần tử 0 cũng được) 

        res.render("admin/pages/products/detail", {
            //khi dùng render thì nó tự động vào views
            pageTitle: product.title,//cho title hiện lên
            product: product //truyền biến product ra view
        });
    } catch (error) {
        req.flash("error","không tồn tại sản phẩm này");//hiện ra thông báo
        res.redirect(`${systemConfig.prefixAdmin}/products`);//nếu try catch thất bại cho nó chạy về /admin/products(trang sản phẩm)
    }
};

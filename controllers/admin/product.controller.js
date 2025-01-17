const Product = require("../../models/product.model");
const ProductCategory=require("../../models/product-category.model");
const Account = require("../../models/account.model")

const systemConfig = require("../../config/system"); // nhúng file system trong config và file này
// chú ý file pug thì có thể dùng prefixAdmin(do trong file chính có khai báo chung rồi) luôn nhưng các file js thì phải nhúng vào rồi chấm gọi thì mới dùng được
const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginantionHelper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree");

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

    if (objectSearch.regex) {//hàm regex giúp khi tìm kiếm nó sẽ giúp ra cả nhwungx cái khác có từu khóa tương tự 
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

    //Sort
    let sort={};
    if(req.query.sortKey && req.query.sortValue){//kiểm tra trên url có truyền sortkey hay sortvalue vào không
        sort[req.query.sortKey] = req.query.sortValue;//truyền string thì phải có ngoặc vuông không thì làm như này cũng được req.price=req.query.sortValue
    }else{
        //nếu url không có sortkey hay sortvalue thì làm theo mặc định
        sort.position="desc";//mặc định position ban đầu là desc nếu nó không thay đổi gì thì trả về giảm dần
    }

    //End Sort
    const products = await Product.find(find).sort(sort).limit(objectPagination.limitItem).skip(objectPagination.skip); //dựa vào hàm let find(object) để tìm các giá trị phù hợp,[.limit(4) tức là chỉ lấy 4 sản phẩm đầu tiên(có thể không limit cũng được)],[ship(4) tức là bỏ qua 4 sản phẩm đầu]
    for (const product of products) {
        //lấy ra thông tin người tạo
        const user = await Account.findOne({
            _id: product.createdBy.account_id
        });
        if(user){
            product.accountFullName = user.fullName;
        }
        //lấy ra thông tin người cập nhật gần nhất
        const updatedBy = product.updatedBy.slice(-1)[0];//(slice(-1) lấy ra 1 mảng phần tử rồi chấm vào 0 để lấy phần tửu cuối cùng cũng được)lấy ra phần tử cuối cùng trong mảng updatedBy(thông tin của người đăng nhập vào gần nhất)(có thể dùng cách product.updatedBy.length - 1 để lấy ra chỉ số cũng được)
        if(updatedBy){//những bản ghi cũ không chưa có update nên phải để trong if không sẽ dễ bị lỗi chương trình
            const userUpdated = await Account.findOne({
                _id: updatedBy.account_id, //tìm kiếm user có id giống với id của phần tửu cuối cùng trong mảng(người chỉnh sủa sau cùng)=>tìm ra thằng sửa sau cùng
            });

            updatedBy.accountFullName = userUpdated.fullName;//gán thêm cho updatedBy thêm 1 key là countFullName và value là tên cửa người đăng nhập
        }
        
    }
    //console.log(products);
    res.render("admin/pages/products/index", {
        //khi dùng render thì nó tự động vào views
        pageTitle: "Danh sách sản phẩm",
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
    const updatedBy = {//phải tạo object để khi push vào mảng các object khác không bị mất dữ liệu
        account_id: res.locals.user.id,//gán account_id bằng id của người update
        updateAt: new Date(),//gán biến thời gian
    }

    await Product.updateOne({
        _id: id
    }, {
        status: status,
        $push : { updatedBy: updatedBy},//hàm $push là ahmf có sẵn trong mongoose nó giúp push tất cả các phần tử của object updatedBy vào trong updateBy trong model(mongosedb) mà không bị mất dữ liệu trước đã lưu 

    }); //update 1 sản phẩm,id là id sản phẩm muốn update,cập nhật trường status=status(id là bắt buộc còn thuộc tính có thể bất kì)

    req.flash("success", "cập nhật trạng thái thành công!"); //khi thay đổi trạng thái mà muốn điền thống báo cho người dùng biết thì dùng hàm flash,cái đầu tiên là tiêu đề còn có thể là key,cái sau là nội dung thông báo,

    res.redirect("back"); //truyền chữ back thì nó sẽ tự động chuyển hướng về trang trước không làm mất dấu trang,còn không thì truyền link vào
};
//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", "); //chuyển từ xâu về mảng

    const updatedBy = {//phải tạo object để khi push vào mảng các object khác không bị mất dữ liệu
        account_id: res.locals.user.id,//gán account_id bằng id của người update
        updatedAt: new Date(),//gán biến thời gian
    }
    switch (type) {
        case "active":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "active",
                $push : { updatedBy: updatedBy},//hàm $push là ahmf có sẵn trong mongoose nó giúp push tất cả các phần tử của object updatedBy vào trong updateBy trong model(mongosedb) mà không bị mất dữ liệu trước đã lưu 
            }); // update nhiều id,ids ở đây là mảng,biến status thành active
            req.flash("success", `Cập nhập trạng thái thành công của ${ids.length} sản phẩm`);
            break;
        case "inactive":
            await Product.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                status: "inactive",
                $push : { updatedBy: updatedBy},//hàm $push là ahmf có sẵn trong mongoose nó giúp push tất cả các phần tử của object updatedBy vào trong updateBy trong model(mongosedb) mà không bị mất dữ liệu trước đã lưu 
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
                {deleted: true},
                {
                    // deleted: true,
                    // deletedAt: new Date()
                    deletedBy: {
                        account_id: res.locals.user.id,//khi đăng nhập thì res.locals.user là biến toàn cục,từ đấy chấm vào id sẽ ra được id(này chỉ lưu id chứ không cần chỉ rõ như tên như người tạo)
                        deletedAt: new Date(),
                    }
                }
            );
            req.flash("success", `Xóa thành công ${ids.length} sản phẩm`);
            break;
        case "change-position":
            req.flash("success","Cập nhật vị trí thành công");
            for (const item of ids) {
                let [id, position] = item.split("- "); //sử dụng destrutering:phá vỡ cấu trúc,do item ở đây là dạng id-position nên dùng spilt để tách chuỗi ra mảng,rồi dùng phá vỡ cấu trúc để lấy
                position = parseInt(position); //do position trong module là dạng number nên phải đổi dạng cho nó từ string sang number

                await Product.updateOne({
                    _id: id
                }, {
                    position: position, //do mỗi id lại có 1 position khác nhau nên phải để trong hàm for để nó có thể duyệt hết các phần tử
                    $push : { updatedBy: updatedBy},//hàm $push là ahmf có sẵn trong mongoose nó giúp push tất cả các phần tử của object updatedBy vào trong updateBy trong model(mongosedb) mà không bị mất dữ liệu trước đã lưu 
                });
            }
            req.flash("success","Cập nhật vị trí thành công");
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
        //deletedAt: new Date() //new Date() là hàm trong javascript giúp cập nhập thời gian hiện tại
        deletedBy: {
            account_id: res.locals.user.id,//khi đăng nhập thì res.locals.user là biến toàn cục,từ đấy chấm vào id sẽ ra được id(này chỉ lưu id chứ không cần chỉ rõ như tên như người tạo)
            deletedAt: new Date(),
        }
    }); //(xóa mềm) truy cập vào item qua id của nó,sau đó sửa thuộc tính deleted của nó sang true,lúc này nếu lọc sẽ không lọc được cái anyf do nó đã chuyển sang true =>xóa mềm(không mất item trong database)
    res.redirect("back");
};
//[GET] /admin/products/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false,
    };
   
    const category = await ProductCategory.find(find);//tìm các cha để lựa chọn

    const newCategory = createTreeHelper.tree(category);//hàm này dùng đệ quy để tìm các con cho bố(không hiểu vào helper xem lại)

    res.render("admin/pages/products/create", {
        //khi dùng render thì nó tự động vào views
        pageTitle: "Thêm mới sản phẩm",
        category:newCategory
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

    req.body.createdBy = {//trƯớc khi lưu vào thì thêm 1 biến createdBy vào
        account_id: res.locals.user.id //do biến res.locals.user là biến toàn cục(không hiểu xem lại auth) nên ta chấm vào id để gán biến account_id cho nó(còn phần cretaedAt thì nó làm hàm rồi nên ko cần gán(xem lại model))
    };

    // if (req.file) { // kiểm tra xem đã đưa ảnh vào chưa rồi ms chạy
    //     req.body.thambnail = `/uploads/${req.file.filename}`; //lưu thêm link ảnh vào database;req.file.filename là id ramdom của ảnh}
    
    const product = new Product(req.body); // đây là cú pháp tạo mới 1 sản phẩm sao lưu key value của object req.body đã nhập vào sang 1 product mới
    await product.save(); //lưu dữ liệu product vừa tạo ra vào database

    res.redirect(`${systemConfig.prefixAdmin}/products`); // sau khi xong chạy đến trang nào cũng được,ở đây chạy đến tráng ản phẩm /admin/product
};
//[GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    //console.log(req)//là cái người dùng nhập vào,req.query là nhwungx cái sau dấu ?; còn req.param là 1 object những cái thuộc tính của vật được chọn để thay đổi
    // console.log(req.params.id) //lấy ra id của sản phẩm
    try {//sở người ta nhập bừa id sẽ làm lỗi server nên phải đưa vào try catch để chắc chắn nó đúng
        const find = { // có id của sản phẩm nên ta sẽ tạo 1object find để tìm sản phẩm(tương tự phần tìm kiếm)
            deleted: false,
            _id: req.params.id
        }

        const product = await Product.findOne(find); //truyền hàm find vào findOne để tìm được 1 object bản ghi(nếu chỉ dùng find thì nó sẽ trả ra 1 mảng accs object nhưng vì id chỉ có 1 nên trong mảng ấy cũng chỉ có 1 object,vẫn có thể dùng find rồi trỏ đến phần tử 0 cũng được) 
       
        const category = await ProductCategory.find({
            deleted:false
        });//tìm các cha để lựa chọn
    
        const newCategory = createTreeHelper.tree(category);//hàm này dùng đệ quy để tìm các con cho bố(không hiểu vào helper xem lại)
        res.render("admin/pages/products/edit", {
            //khi dùng render thì nó tự động vào views
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product, //truyền biến product ra view
            category:newCategory
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
        const updatedBy = {//phải tạo object để khi push vào mảng các object khác không bị mất dữ liệu
            account_id: res.locals.user.id,//gán account_id bằng id của người update
            updatedAt: new Date(),//gán biến thời gian
        }

        //req.body.updatedBy = updatedBy;//dùng cách như anyf thì nó chủ push 1 phần tử vào trong database 1 lượt thôi(không lưu được số lượt sửa wed) nên phải dùng cách khác
        await Product.updateOne( { _id : id} ,{
            ...req.body,//lấy ra tất cả phần tử trong req.body
            $push : { updatedBy: updatedBy},//hàm $push là ahmf có sẵn trong mongoose nó giúp push tất cả các phần tử của object updatedBy vào trong updateBy trong model(mongosedb) mà không bị mất dữ liệu trước đã lưu 
        });
        req.flash("success","Cập nhật thành công");
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

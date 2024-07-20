const express = require("express");
const multer = require("multer"); //nhúng file multer vào sẽ giúp tải ảnh lên được
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const router = express.Router();

// const storageMulter=require("../../helpers/storageMulter");//nhungs storage vào không hiểu thì sang file storage trong helper mà xem lại
// const upload=multer({dest: storageMulter()});// đường dẫn đẫn tới thư mục upload trong public(thay đổi đường dẫn tùy muốn,không bắt buộc)
const upload = multer(); //nếu làm như 2 dòng bên trên thì khi upload thì sẽ upload vào file upload trong thư mục,còn ở đây là up load nên cloudy

const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validates/admin/product.validate"); //nhúng validate vào

const uploadCloud= require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus); //:status,:id là 2 route động(có thể thay đổi),patch là cập nhập

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem); //:id là route động

router.get("/create", controller.create); //đi vào route /create  khi bấm vào tạo mới thì phương thức get là để lấy ra trang tạo sản phẩm,trả lại giao diện

router.post(
    "/create",
    upload.single("thumbnail"), //upload singe ở đây là upload 1 ảnh vào,và lưu ảnh ở trường thmbnail
    uploadCloud.upload,//hàm upload online
    validate.createPost, //đây gọi là midlewhere hàm trung gian nó sẽ check hàm trên đúng chưa nếu đúng rồi nó sẽ trả về next() để xuống dòng phía dưới,còn nếu không thì code ngừng luôn
    controller.createPost // cũng đi vào route /create nhưng phương thức khác khi vào trang create bằng phương thức get rồi thì khi tạo mới sẽ dùng đến phương thức post,
  );

router.get("/edit/:id", controller.edit); //id ở đây là route động,đang đi đến trang /edit/:id còn xử lí logic sẽ là phương thức pathch ở phái dưới 

router.patch( //thắc mắc đọc ở phương thức post ở create phái trên
  "/edit/:id",
  upload.single("thumbnail"), //upload singe ở đây là upload 1 ảnh vào,và lưu ảnh ở trường thmbnail
  uploadCloud.upload,//hàm upload online
  validate.createPost,
  controller.editPatch
);

router.get("/detail/:id", controller.detail); //id ở đây là route động,đang đi đến trang /detail/:id 

module.exports = router;
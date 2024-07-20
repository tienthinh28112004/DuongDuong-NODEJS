const cloudinary = require('cloudinary').v2;//do trang này dùng nên khai báo ở trong này,nếu file khác uốn dùng file ày thì vẫn dc
const streamifier = require('streamifier');

//Cloudinary
cloudinary.config({//không liên quan đến config trong file mà liên quan đến cloudinary(không hiểu nên đọc lại)
    cloud_name: process.env.CLOUD_NAME,//nhét vào env để bảo quản
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET, // Click 'View Credentials' below to copy your API secret(giúp có thể upload ảnh cái này là bí mật,do demo nên để ở đây thôi)
});
//End Cloudinary

module.exports.upload = (req, res, next)=> { //nên set up cloudinary tìm hiểu thêm
    if (req.file) {//kiểm tra xem có ảnh đi vào không
      let streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });

          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };

      async function upload(req) {
        let result = await streamUpload(req);
        req.body[req.file.fieldname] = result.secure_url; //sử dụng [req.file.fieldname] (req.file.fieldname lấy từ file createproducts) để cho tổng quát(còn nếu dung hẳn sẽ là req.body.thumbnail),kể cả khi nó là image hay thmabnail cũng tổng quát được(ko hiểu thì console.log(req) ra)
        next(); //nếu nó gán xong data rồi chạy sang bước tiếp theo luôn(kể cả có ảnh hay không)
      }
      upload(req); // phải có await nếu không nó sẽ chạy sang next luôn và hàm controller sẽ không nhận được thumbnail
    } else {
      next();
    }
  };
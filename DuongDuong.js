const express =require("express");// nhúng express
const path=require('path');// path là hàm có sẵn trong express
const methodOverride = require("method-override");
const bodyParser=require("body-parser");
const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("express-flash");//thư viện hiển thị thông báo cho bên forntend
const moment = require("moment");//thư viện có tác dụng chuyển ngày tháng trong javascript
require("dotenv").config();// nhúng thư viện dotevn vào file

const database= require("./config/database");

const systemConfig = require("./config/system");//nhúng file system vào file chính

const route =require("./routes/client/index.route");//nhúng index.route vào file DuongDuong
const routeAdmin =require("./routes/admin/index.route");//đi vào route của admin
database.connect();// gọi hàm connect của database

const app=express();//tạo app
const port=process.env.PORT;//truy cập vào file .env lấy hằng số

app.use(methodOverride('_method'));// để sử dụng được method thì phải khai báo sai khia báo app của express

//parser application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));//phải đứng sau khai báo app

app.set("views",`${__dirname}/views`);//./views tức là đi vào folder views,để deloy onl thì cần phải có dirname
app.set("view engine","pug");//pug là sử dụng pug,views engine là cố định.2 dòng này để cấu hình bug vào dự án

//Flash
app.use(cookieParser('keyboard cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());
//End Flash

//TinyMCE(giúp tạo các kiểu định dang chữ)
app.use(
    '/tinymce', 
    express.static(path.join(__dirname, 'node_modules', 'tinymce'))
);
//End TinyMCE

// App Locals Variable
app.locals.prefixAdmin = systemConfig.prefixAdmin;// gán giá trị cố định để có thể sử dụng /admin ở nhiều nơi(từ file js không thể đi được vào file pug nên phải dùng cách này)
//prefixadmin lúc này có thể tồn tại trong bất kì file pug nào,app.local có thể tạo ra các biến toàn cục
app.locals.moment = moment;//chuyển sang biến toàn cục

app.use(express.static(`${__dirname}/public`));// dòng này là để có thể sử dụng được file tĩnh Public chỉ sử dụng được trong các file pug,__dirname chính là cấu trcus thư mục của chúng ta luôn,deloy onl thfi cầng có dirname

//Route
route(app); //truyền app vào route
routeAdmin(app);
app.listen(port,()=>{
    console.log(`App listening on port ${port}`);
});
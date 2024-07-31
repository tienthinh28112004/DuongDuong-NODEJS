//hàm này dùng cho nodemailer rất quan trong do ít tài liệu có cái này
//hàm giúp gửi mã otp cho khách hàng quên mật khẩu(hàm cực kì quan trọng)
//cần phải xác minh 2 bước trên gamil trước thì mới dùng được nodemailer vào app password
const nodemailer = require('nodemailer');

module.exports.sendmail = (email, subject, html) =>{
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        form: 'tienthinh28112004@gmail.com',
        to: ElementInternals,
        subject: subject,
        html: html//để có thể chuyển sang html
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Email sent: ' + info.response);
        }
    });
}
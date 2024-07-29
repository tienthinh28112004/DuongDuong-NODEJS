//Show Alert//hiện thông báo khi thành công 1 cái gì đó
const ShowAlert = document.querySelector("[show-alert]");
if(ShowAlert){
    const time=parseInt(ShowAlert.getAttribute("data-time"));//do lấy ra từ data-time nên kiểu nó của nó là string,muốn ép kiểu phải dùng parseInt
    const closeAlert=ShowAlert.querySelector("[close-alert]");
    
    setTimeout(()=>{//hàm settimeout là sau 1 khoảng thời gian mới hoạt động(giúp thông báo tồn tại)
        ShowAlert.classList.add("alert-hidden");//add thêm vào class 1 cái alert-hidden,add class này vào thì sẽ giúp alert biến mất
    },time);
    closeAlert.addEventListener("click",()=>{//hàm này giúp khi click vào nút tắt nó tắt đi luôn,không cần phải chờ thời gian
        ShowAlert.classList.add("alert-hidden");//add thêm vào class 1 cái alert-hidden
    },time);
}
//End Show Alert
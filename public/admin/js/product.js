// Change Status thay đổi trạng thái (hoạt động hay không hoạt động)//xử lí forntend
const buttonsChangeStatus=document.querySelectorAll("[button-change-status]");
if(buttonsChangeStatus.length > 0){
    const formChangeStatus=document.querySelector("#form-change-status");//tìm from thì dùng queryselector chỉ đến value trong form
    const path= formChangeStatus.getAttribute("data-path");//tìm value thì đi qua key dùng getattribute(tìm thuộc tính)
    
    buttonsChangeStatus.forEach(button =>{
        button.addEventListener("click",()=>{
            const statusCurrent=button.getAttribute("data-status");
            const id=button.getAttribute("data-id");
            
            let statusChange = statusCurrent == "active" ? "inactive" : "active";
            const action = path + `/${statusChange}/${id}?_method=PATCH`;//vì ở đây là câp nhập (không phải nối chuỗi) nên phải dùng PATCH thay vì GET mà html không có PATCH nên phải cài method và cần thêm đuôi _mehtod=PACTH mới sử dụng được(do action có việc cần rồi nên phải làm như này),nối chuỗi tại url
            formChangeStatus.action = action;// action là thuộc tính mặc định lên có thể chấm rồi chọn còn nếu thuộc tính tự định nghĩa thì phải cần setatribute mới gán được 

            formChangeStatus.submit();//hàm submit() formchangestatus lên (lên tra mạng)
        });
    });
}
//End change status

//Delete Item
const buttonDelete=document.querySelectorAll("[button-delete]");
if(buttonDelete.length > 0){
    const formDeleteItem=document.querySelector("#form-delete-item");
    const path=formDeleteItem.getAttribute("data-path");

    buttonDelete.forEach(button=>{
        button.addEventListener("click",()=>{
            const isConfirm=confirm("Bạn có chắc muốn xóa sản phẩm này?");

            if(isConfirm){
                const id=button.getAttribute("data-id");

                const action = `${path}/${id}?_method=DELETE`;
                formDeleteItem.action=action;// gans action vào aaction trong form trong index.pug
                formDeleteItem.submit();// gửi cái form trong index.pug lên sever kết thúc phần fornend đến phần backend để xử lí
            };
        });
    });
}
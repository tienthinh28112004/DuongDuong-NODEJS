//Permissions:phân quyền
const tablePermissions = document.querySelector("[table-permissions]");
if(tablePermissions){
    const buttonSubmit = document.querySelector("[button-submit]");
    buttonSubmit.addEventListener("click", () => {
        let permissions = [];//tạo ra 1 mảng để chứa các object gồm id và 1 mảng permissions

        const rows=tablePermissions.querySelectorAll("[data-name]");//lọc ra tát cả các phần tửu có  key là data-name
        
        rows.forEach(row =>{
            const name=row.getAttribute("data-name");//từ data-name lọc ra value(giá trị của thuộc tính data-name)
            const inputs=row.querySelectorAll("input");
            
            if(name=="id"){

                inputs.forEach(input =>{
                    const id=input.value;
                    permissions.push({
                        id: id,
                        permissions: [] //tạo ra 1 mảng permissions khác rỗng để chứa các name
                    });
                });
            }else{
                console.log("ok2");

                inputs.forEach((input,index) =>{//dùng thêm 1 biến index là chỉ số(vd chỉ số 0 là quảng trị viên,chỉ số 1 là quản lí nội dung)
                    const checked=input.checked;//nếu đã tích được vào nút thì check bằng true
                    if(checked){
                        permissions[index].permissions.push(name);//từ mảng permission ban đầu gồm id và 1 mảng permission khác,push giá trị name vào mảng permission khác ấy
                    }
                });
            }
        });
        //muốn đưa nên thì có thể dùng callApi nhưng ở đây chưa học nên sẽ gửi qua form
        if(permissions.length > 0){
            const formChangePermissions = document.querySelector("#form-change-permissions");
            
            const inputPermissions = formChangePermissions.querySelector("input[name='permissions']");
            
            inputPermissions.value = JSON.stringify(permissions);//chuyển mảng permissions sang dạng chuỗi Json,và gán giá trị value của inputPermission bằng chuỗi json ấy(không hiểu mở file role.js lướt đến cuối)
            
            formChangePermissions.submit();//submit cái anyf lên để chuyển sang bên backend
        }
    });
}
//End permission


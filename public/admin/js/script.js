// xử lí bên forntend
//buuton status //tìm các trạng thái(nhìn lại index trong view/page/product sẽ hiểu)
const buttonStatus = document.querySelectorAll("[button-status]");//các thuộc tính do chúng ta tự định nghĩa nên phải thêm dấu ngoặc vuông
if(buttonStatus.length > 0){
    let url=new URL(window.location.href);// js có hàm new URL() để sử dụng

    buttonStatus.forEach(button =>{
        button.addEventListener("click",()=>{
            const status=button.getAttribute("button-status");

            if(status){// nếu status có tồn tại
                url.searchParams.set("status",status);//câu lệnh để thêm status thay cho searchpram string url ban đầu
            }else{
                url.searchParams.delete("status");//xóa key status trên url
            }
            window.location.href=url.href;//câu lệnh để chuyển hướng sang trang url.href 
        });
    });
}
//End button Status

//Form Search
const formSearch=document.querySelector("#form-search");
if(formSearch){
    let url=new URL(window.location.href);// js có hàm new URL() để sử dụng

    formSearch.addEventListener("submit",(e)=>{
        e.preventDefault();//ngăn chặn sự kiện mặc định để nó không load lại trang
        const keyword=e.target.elements.keyword.value;

        if(keyword){// nếu keyword có tồn tại
            url.searchParams.set("keyword",keyword);//câu lệnh để thêm keyword thay cho searchpram string url ban đầu
        }else{
            url.searchParams.delete("keyword");//xóa keyword trên url
        }
        window.location.href=url.href;// nếu bấm vào status rồi mới bấm tìm kiếm thì nó sẽ tự động nối chuỗi VD status=active&keyword=iphone
    });
}
//End form search

//pagination
const buttonsPagination=document.querySelectorAll("[button-pagination]");//thuộc tính tự định nghĩa thì phải thêm [] vào
if(buttonsPagination){
    let url=new URL(window.location.href);// js có hàm new URL() để sử dụng
    
    buttonsPagination.forEach(button=>{
        button.addEventListener("click",()=>{
            const page=button.getAttribute("button-pagination");
            // biến page lúc này là số,thắc mắc xem lại views/admin/page/product/index(pagination)
            url.searchParams.set("page",page);

            window.location.href=url.href;//chuyển sang trang
        })
    })
}

//End pagination

//Checkbox Multi:nếu bấm vào all thì tất cả các ô phải thành xanh
const checkboxMulti=document.querySelector("[checkbox-multi]");
if(checkboxMulti){
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId=checkboxMulti.querySelectorAll("input[name='id']");
    inputCheckAll.addEventListener("click",()=>{
        //console.log(inputCheckAll.checked);// tích vào rồi thì trả ra true còn chưa tích thì chả ra false(checked là 1 hàm)
        if(inputCheckAll.checked){
            inputsId.forEach(input =>{
                input.checked=true;
            });
        }else{
            inputsId.forEach(input =>{
                input.checked=false;
            });
        }
    });
    //nếu tất chọn thì check all phải được chọn,nếu 1 ô không được chọn thì check all cũng không được chọn(tô xanh)
    inputsId.forEach(input=>{
        input.addEventListener("click",()=>{
            const cuontChecked=checkboxMulti.querySelectorAll("input[name='id']:checked").length;// bên trong là css tìm ra ô input đã check
            if(cuontChecked==inputsId.length){
                inputCheckAll.checked=true;
            }else{
                inputCheckAll.checked=false;
            }
        });
    });
}
//End checkbox multi

//Form change multi
const formChangemulti = document.querySelector("[form-change-multi]");
if(formChangemulti){
    formChangemulti.addEventListener("submit",(e)=>{
        e.preventDefault();//ngăn ngừa hành động mặc định load lại trang
        
        const checkboxMulti=document.querySelector("[checkbox-multi]");
        const inputsChecked=checkboxMulti.querySelectorAll("input[name='id']:checked");// bên trong là css tìm ra ô input đã check
        //khúc sau này là giúp xóa tất cả
        const typeChange=e.target.elements.type.value;//đây là trong phần xóa tất cả 
        
        if(typeChange=="delete-all"){
            const isConfirm=confirm("Bạn có muốn xóa không?");
            if(!isConfirm){
                return ;// nếu người ta muốn hủy thì dùng từ khóa return ; từ khóa này giúp các đoạn code phái sau không được chạy nữa
            }
        }
        //nếu không muốn xóa thì chạy vào return còn nếu muốn xóa thì chạy xuống dưới này
        if(inputsChecked.length>0){
            let ids=[];
            const inputIds=formChangemulti.querySelector("input[name='ids']");

            inputsChecked.forEach(input =>{
                const id=input.value; //do value là thuộc tính mặc định rồi nên không cần sử dụng getattribute nữa

                if(typeChange=="change-position"){// nếu đúng,chạy hàm thay đổi trạng thái thứ tự sản phẩm tùy thuộc vào position của sản phẩm
                    const position=input.closest("tr").querySelector("input[name='ids']").value;//sử dụng hàm closest để lấy ra thẻ cha của thẻ input là thẻ tr rồi từ thẻ tr dùng queryselector để lấy được thuộc tính rồi lấy value
                
                    ids.push(`${id}-${position}`);
                }else{//chạy vào đây thì là chạy hàm thay đổi trạng thái sản phẩm từ inactive sang active và ngược lại
                    ids.push(id);// push id vào mảng ids
                }
                
            });
            inputIds.value=ids.join(", ");//chuyển từ mảng sang string rồi gán vào value
            formChangemulti.submit();//submit thì nó sẽ link sangd dường dẫn action trong index
        }else{
            alert("Vui lòng chọn ít nhất 1 bản ghi");
        }
        //xuống đến dưới này là nó sẽ chuyển dữ liệu sang product.controll
    });
}
//End form change multi

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

//Upload Image:để có thể nhìn được ảnh(preview) trước khi upload
const uploadImage=document.querySelector("[upload-image]");
if(uploadImage){
    const uploadImageInput=document.querySelector("[upload-image-input]");
    const uploadImagePreview=document.querySelector("[upload-image-preview]");

    uploadImageInput.addEventListener("change",(e)=>{
        //trả e về luôn là 1 object và trong object luôn có 1 cái key là target và key target đấy chính là ô input mà chúng ta bắt sự kiện;e.target chũng chính là acsi mà chúng ta đang bắt sự kiện e.target=uploadImageInput
        const file=e.target.files[0];//(mặc định suất hiện là lấy cái đầu tiên)từ e.target chấm vào file rồi lấy phần tử số 0;có thể dùng phá vỡ cấu trúc destrutering  const [file]=e.target.files ;lúc này thì file chính là phần tử đầu tiên của mảng e.target.files
        if(file){
            uploadImagePreview.src=URL.createObjectURL(file);//nếu có file,gọi đến hàm uploadImagePrevie đi vào src=RL.createObjectURL(),truyền file vào trong đây nó sẽ tạo url cho file ảnhlà preview được(tạo ra đường dẫn ảnh)
        }
    });
}
//End Upload Page

//Sort
const sort=document.querySelector("[sort]");
if(sort){
    let url=new URL(window.location.href);// js có hàm new URL() để sử dụng

    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");
    //Sắp xếp
    sortSelect.addEventListener("change",(e)=>{
        const value= e.target.value; //cái này chính là option nó chọn
        const [sortKey,sortValue]=value.split("-");//sử dụng phá vỡ cấu trúc

        url.searchParams.set("sortKey",sortKey);//đưa sortKey=sortKey lên url (set up)
        url.searchParams.set("sortValue",sortValue)

        window.location.href=url.href;//đưa lên url(đi đến trang khác)
    });
    //Xóa sắp xếp
    sortClear.addEventListener("click",()=>{
        url.searchParams.delete("sortkey");
        url.searchParams.delete("sortValue");
        window.location.href=url.href;//đưa lên url(đi đến trang khác)
    });

    //Thêm selected cho option(khi chọn option nào thì nó sẽ hiện ngay trong ô bảng)
    const sortKey = url.searchParams.get("sortkey");//lấy dữ liệu trên params
    const sortValue = url.searchParams.get("sortValue");//lấy luôn dữ liệu trên url luôn

    if(sortKey && sortValue){
        const stringSort = `${sortKey}-${sortValue}`;
        const optionSelected = sortSelect.querySelector(`option[value='${stringSort}']`);
        optionSelected.selected = true;//do selected là thuộc tính mặc định nên gán luôn không cần setattribute nữa
    }

}
//End Sort

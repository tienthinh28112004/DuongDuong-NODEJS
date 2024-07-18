module.exports =(query)=>{
    let filterStatus=[
        {
            name:"Tất cả",
            status:"",
            class:""
        },
        {
            name:"Hoạt động",
            status:"active",
            class:""
        },
        {
            name:"Dừng hoạt động",
            status:"inactive",
            class:""
        }
    ]
    if(query.status){
        const index=filterStatus.findIndex(item=>//tìm ra vị trí phù hợp
            item.status==query.status//ở đây phải so sánh bằng   
        );
        filterStatus[index].class="active";
    }else{
        const index=filterStatus.findIndex(item=>//tìm ra vị trí phù hợp
            item.status==""//ở đây phải so sánh bằng   
        );
        filterStatus[index].class="active";
    }
    return filterStatus;
}
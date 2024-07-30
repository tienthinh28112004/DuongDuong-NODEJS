//Cập nhật lại số lượng sản phẩm trong giỏ hàng
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if(inputsQuantity.length > 0){
    inputsQuantity.forEach(input => {
        input.addEventListener("change", () => {
            const productId = input.getAttribute("product-id");
            const quantity = input.value;//lấy ra số lượng mới

            window.location.href = `/cart/update/${productId}/${quantity}`;//hàm này ở bên forntend giúp link sang trang mới tương tự redirect
        });
    });
}
//hết cập nhật số lượng sản phẩm trong giỏ hàng
const btnConfirm = document.getElementById('xac-nhan-rut-tien');
let successfulMsg = btnConfirm.getAttribute("data-message");

if (successfulMsg == 'successful') {
    btnConfirm.click();
}
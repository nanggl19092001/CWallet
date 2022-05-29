const btnXacNhanNapTien = document.getElementById('xac-nhan-nap-tien');
if (btnXacNhanNapTien != null) {
    let successfulMsgNapTien = btnXacNhanNapTien.getAttribute("data-message");
    if (successfulMsgNapTien == 'successful') {
        btnXacNhanNapTien.click();
    }
}


const btnXacNhanRutTien = document.getElementById('xac-nhan-rut-tien');
let successfulMsgRutTien = btnXacNhanRutTien.getAttribute("data-message");


if (successfulMsgRutTien == 'successful') {
    btnXacNhanRutTien.click();
}
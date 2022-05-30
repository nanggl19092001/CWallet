//1. Xem profile user(admin)
//2. Thao tác với user (admin)
//3. load giao dịch user (admin)
//4. thông tin giao dịch user (admin) Bao gồm cả gửi request duyệt giao dịch
//5. Giao dịch một user (admin)
//6. Mua thẻ (user)
//7. Giao dịch một user (User)
//8. Thông tin giao dịch rút tiền (admin)
//9. lịch sử rút tiền (user)
//10. onload rút tiền (user)
//11. onload nạp tiền (user)

//1. Xem profile user(admin)
function profile(username){
  window.location.replace('/admin/profile/'+username)
}

//2. Thao tác với user (admin)
function adminUserProfileModal(username,hanhdong){
  let modalBg = document.getElementById('profile-modal-bg')
  let modalBox = document.getElementById('profile-modal-box')
  let modalText = document.getElementById('modal-text')

  modalBg.style.display = 'block'
  modalBox.style.display = 'block'

  document.getElementById('modal-confirm').style.display = 'inline-block'
  if(hanhdong == 'xacminh') modalText.innerText = 'Bạn có muốn xác minh tài khoản này'
  if(hanhdong == 'huy') modalText.innerText = 'Bạn có muốn khóa tài khoản này'
  if(hanhdong == 'bosung') modalText.innerText = 'Yêu cầu tài khoản bổ sung thông tin'
  if(hanhdong == 'mokhoa') modalText.innerText = 'Bạn muốn mở khóa tài khoản này'
  if(hanhdong == 'khoa') modalText.innerText = 'Bạn muốn khóa tài khoản này'

  document.getElementById('modal-confirm').addEventListener('click', (e)=>{
    let trangthai = ''
    if(hanhdong == 'xacminh') trangthai = 1
    if(hanhdong == 'huy') trangthai = 2
    if(hanhdong == 'khoa') trangthai = 3
    if(hanhdong == 'bosung') trangthai = 4
    if(hanhdong == 'mokhoa') trangthai = 1
    fetch('/admin/profile', {
      method: 'POST',
      body: new URLSearchParams({
        username: username,
        trangthai: trangthai
      })
    }).then(res => res.json())
    .then(json => {
      if(json.code == 200){
        window.location.replace('/admin')
      }
    })
  })

  document.getElementById('modal-close').addEventListener('click', (e)=>{
    modalBg.style.display = 'none'
    modalBox.style.display = 'none'
  })
}

//3. load giao dịch user (admin)
function loadTransaction(username){
  fetch('/admin/transaction/' + username, {
    method: 'GET',
  }).then(res => res.json())
  .then(json => {
    console.log(json)
    if(json.length > 0){
        for (const x of json){
          let trangthai = ''
          if(x.TrangThai == 1) trangthai = 'Hoàn thành'
          if(x.TrangThai == 2) trangthai = 'Bị hủy'
          if(x.TrangThai == 3) trangthai = 'Đang chờ'
          let tr = document.createElement('tr')

          tr.addEventListener('click', (e) => {
            userTransactionInfo(x.IDChuyenTien,username,x.SDTNguoiNhan,x.SoTien,x.BenChiuPhi)
          })

          tr.innerHTML = `
          <td>${x.IDChuyenTien}</td>
          <td>${x.SDTNguoiNhan}</td>
          <td>${x.SoTien}</td>
          <td>${x.TrangThai}</td>`

          document.getElementById('giaodich').appendChild(tr)
        }
      }
    })
}

//4. thông tin giao dịch user (admin) Bao gồm cả gửi request duyệt giao dịch
function transactionInfo(IDChuyenTien,username,SDTNguoiNhan,SoTien,BenChiuPhi){

  let chiuPhi = ''
  if (BenChiuPhi == 0) chiuPhi = 'Người chuyển'
  else chiuPhi = 'Người nhận'

  let modalBg = document.getElementById('profile-modal-bg')
  let modalBox = document.getElementById('profile-modal-box')
  let modalText = document.getElementById('modal-text')

  modalBg.style.display = 'block'
  modalBox.style.display = 'block'

  document.getElementById('modal-refuse').style.display = 'inline-block'
  document.getElementById('modal-confirm').style.display = 'inline-block'
  fetch('/admin/user', {
    method: 'POST',
    body: new URLSearchParams({
      username: username
    })
  }).then(res => res.json())
  .then(json => {
    if(json.code == 404) return false
    else{
      fetch('/admin/user', {
        method: 'POST',
        body: new URLSearchParams({
          SoDienThoai: SDTNguoiNhan
        })
      }).then(response => response.json())
      .then(nguoinhan => {
        modalText.innerHTML = `
        <div>Người gửi --</div>
        <table>
          <tr>
            <td>Số tài khoản</td>
            <td>: ${json.username}</td>
          </tr>
          <tr>
            <td>Số điện thoại</td>
            <td>: ${json.SoDienThoai}</td>
          </tr>
          <tr>
            <td>Họ và tên</td>
            <td>: ${json.HoVaTen}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>: ${json.Email}</td>
          </tr>
        </table>
        <div>Người nhận --</div>
        <table>
          <tr>
            <td>Số tài khoản</td>
            <td>: ${nguoinhan.username}</td>
          </tr>
          <tr>
            <td>Số điện thoại</td>
            <td>: ${SDTNguoiNhan}</td>
          </tr>
          <tr>
            <td>Họ và tên</td>
            <td>: ${nguoinhan.HoVaTen}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>: ${nguoinhan.Email}</td>
          </tr>
        </table>
        <hr>
        <div>Số tiền chuyển : ${SoTien}</div>
        <div>Bên chịu phí: ${chiuPhi}</div>
        `

        document.getElementById('modal-confirm').addEventListener('click', (e)=>{
          modalText.innerText = 'Bạn có muốn duyệt giao dịch này'
          document.getElementById('modal-refuse').style.display = 'none'
          document.getElementById('modal-confirm').addEventListener('click', (e)=>{
            
            fetch('/admin/transaction', {
              method: 'POST',
              body: new URLSearchParams({
                IDChuyenTien: IDChuyenTien,
                TrangThai: 1,
                username: username,
                usernameNguoiNhan: nguoinhan.username,
                BenChiuPhi: BenChiuPhi,
                SoTien: SoTien
              })
            }).then(resTransaction => resTransaction.json())
            .then(result => {
              console.log(result)
              if(result.code == 200){
                modalText.innerText = 'Giao dịch thành công'
                document.getElementById('modal-confirm').style.display = 'none'
                document.getElementById('modal-close').addEventListener('click',(e) => {
                  window.location.replace('/admin/transaction/transfer')
                })
              }
              else{
                modalText.innerText = result.msg
                document.getElementById('modal-confirm').style.display = 'none'
                document.getElementById('modal-close').addEventListener('click',(e) => {
                  window.location.replace('/admin/transaction/transfer')
                })

              }
            })
            
          })

        })

        document.getElementById('modal-refuse').addEventListener('click', (e) => {
          modalText.innerText = 'Bạn có muốn từ chối giao dịch này'

          document.getElementById('modal-refuse').style.display = 'none'

          document.getElementById('modal-confirm').addEventListener('click', (e)=>{
            
            fetch('/admin/transaction/refuse', {
              method: 'POST',
              body: new URLSearchParams({
                IDChuyenTien: IDChuyenTien
              })
            }).then(resTransaction => resTransaction.json())
            .then(result => {
              console.log(result)
              if(result.code == 200){
                modalText.innerText = 'Giao dịch đã bị hủy'
                document.getElementById('modal-confirm').style.display = 'none'
                document.getElementById('modal-close').addEventListener('click',(e) => {
                  window.location.replace('/admin/transaction/transfer')
                })
              }
              else{
                modalText.innerText = result.msg
                document.getElementById('modal-confirm').style.display = 'none'
                document.getElementById('modal-close').addEventListener('click',(e) => {
                  window.location.replace('/admin/transaction/transfer')
                })
              }
            })
          })
        })

      })
    }
  })

  document.getElementById('modal-close').addEventListener('click', (e)=>{
    modalBg.style.display = 'none'
    modalBox.style.display = 'none'
  })
}


//5. Giao dịch một user (admin)
function userTransactionInfo(IDChuyenTien,username,SDTNguoiNhan,SoTien,BenChiuPhi){

  let chiuPhi = ''
  if (BenChiuPhi == 0) chiuPhi = 'Người chuyển'
  else chiuPhi = 'Người nhận'

  let modalBg = document.getElementById('profile-modal-bg')
  let modalBox = document.getElementById('profile-modal-box')
  let modalText = document.getElementById('modal-text')

  modalBg.style.display = 'block'
  modalBox.style.display = 'block'

  document.getElementById('modal-confirm').style.display = 'none'
  fetch('/admin/user', {
    method: 'POST',
    body: new URLSearchParams({
      username: username
    })
  }).then(res => res.json())
  .then(json => {
    if(json.code == 404) return false
    else{
      fetch('/admin/user', {
        method: 'POST',
        body: new URLSearchParams({
          SoDienThoai: SDTNguoiNhan
        })
      }).then(response => response.json())
      .then(nguoinhan => {
        modalText.innerHTML = `
        <div>Người gửi --</div>
        <table>
          <tr>
            <td>Số tài khoản</td>
            <td>: ${json.username}</td>
          </tr>
          <tr>
            <td>Số điện thoại</td>
            <td>: ${json.SoDienThoai}</td>
          </tr>
          <tr>
            <td>Họ và tên</td>
            <td>: ${json.HoVaTen}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>: ${json.Email}</td>
          </tr>
        </table>
        <div>Người nhận --</div>
        <table>
          <tr>
            <td>Số tài khoản</td>
            <td>: ${nguoinhan.username}</td>
          </tr>
          <tr>
            <td>Số điện thoại</td>
            <td>: ${SDTNguoiNhan}</td>
          </tr>
          <tr>
            <td>Họ và tên</td>
            <td>: ${nguoinhan.HoVaTen}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>: ${nguoinhan.Email}</td>
          </tr>
        </table>
        <hr>
        <div>Số tiền chuyển : ${SoTien}</div>
        <div>Bên chịu phí: ${chiuPhi}</div>
        `
      })
    }
  })

  document.getElementById('modal-close').addEventListener('click', (e)=>{
    modalBg.style.display = 'none'
    modalBox.style.display = 'none'
  })
}

//6. Mua thẻ
function muathe(){
  let menhgia10000 = document.getElementById('10000').value
  let menhgia20000 = document.getElementById('20000').value
  let menhgia50000 = document.getElementById('50000').value
  let menhgia100000 = document.getElementById('100000').value
  let nhamang = document.getElementById('nhamang').value

  document.getElementById('modal-confirm').style.display = 'inline-block'
  document.getElementById('muathe-modal-bg').style.display = 'flex'
  document.getElementById('muathe-modal-box').style.display = 'block'

  if(menhgia10000 == 0 && menhgia20000 == 0 && menhgia50000 == 0 && menhgia100000 == 0){
    document.getElementById('modal-text').innerHTML = 'Vui lòng lựa chọn ít nhất một thẻ tương ứng với mệnh giá'
    document.getElementById('modal-confirm').style.display = 'none'
  }
  else{
    let text = '<div>Bạn có xác nhận mua thẻ với thông tin --</div><div> Nhà mạng : '+nhamang+'</div>'
    if(menhgia10000 > 0){
      text += '<div>Mệnh giá 10,000 VND : '+menhgia10000+'</div>'
    }
    if(menhgia20000 > 0){
      text += '<div>Mệnh giá 20,000 VND : '+menhgia20000+'</div>'
    }
    if(menhgia50000 > 0){
      text += '<div>Mệnh giá 50,000 VND : '+menhgia50000+'</div>'
    }
    if(menhgia100000 > 0){
      text += '<div>Mệnh giá 100,000 VND : '+menhgia100000+'</div>'
    }

    document.getElementById('modal-text').innerHTML = text

    document.getElementById('modal-confirm').addEventListener('click', (e)=>{
      fetch('/muathe/confirm', {
        method: 'POST',
        body: new URLSearchParams({
          menhgia10000: menhgia10000,
          menhgia20000: menhgia20000,
          menhgia50000: menhgia50000,
          menhgia100000: menhgia100000,
          nhamang: nhamang
        })
      }).then(res => res.json())
      .then(json => {
        if(json.code == 200){
          window.location.replace('/lichsu/thedienthoai/'+json.IDGiaoDich)
        }
      })
    })
  }

  document.getElementById('modal-close').addEventListener('click', function(){
    document.getElementById('muathe-modal-bg').style.display = 'none'
    document.getElementById('muathe-modal-box').style.display = 'none'
  })

  
}

//7. Giao dịch chuyển tiền một user (User)
function transactionUserInfo(IDChuyenTien,username,SDTNguoiNhan,SoTien,BenChiuPhi){

  let chiuPhi = ''
  if (BenChiuPhi == 0) chiuPhi = 'Người chuyển'
  else chiuPhi = 'Người nhận'

  let modalBg = document.getElementById('muathe-modal-bg')
  let modalBox = document.getElementById('muathe-modal-box')
  let modalText = document.getElementById('modal-text')

  modalBg.style.display = 'block'
  modalBox.style.display = 'block'

  document.getElementById('modal-confirm').style.display = 'none'
  fetch('/admin/user', {
    method: 'POST',
    body: new URLSearchParams({
      username: username
    })
  }).then(res => res.json())
  .then(json => {
    if(json.code == 404) return false
    else{
      fetch('/admin/user', {
        method: 'POST',
        body: new URLSearchParams({
          SoDienThoai: SDTNguoiNhan
        })
      }).then(response => response.json())
      .then(nguoinhan => {
        modalText.innerHTML = `
        <div>Người gửi --</div>
        <table>
          <tr>
            <td>Số tài khoản</td>
            <td>: ${json.username}</td>
          </tr>
          <tr>
            <td>Số điện thoại</td>
            <td>: ${json.SoDienThoai}</td>
          </tr>
          <tr>
            <td>Họ và tên</td>
            <td>: ${json.HoVaTen}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>: ${json.Email}</td>
          </tr>
        </table>
        <div>Người nhận --</div>
        <table>
          <tr>
            <td>Số tài khoản</td>
            <td>: ${nguoinhan.username}</td>
          </tr>
          <tr>
            <td>Số điện thoại</td>
            <td>: ${SDTNguoiNhan}</td>
          </tr>
          <tr>
            <td>Họ và tên</td>
            <td>: ${nguoinhan.HoVaTen}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>: ${nguoinhan.Email}</td>
          </tr>
        </table>
        <hr>
        <div>Số tiền chuyển : ${SoTien}</div>
        <div>Bên chịu phí: ${chiuPhi}</div>
        `
      })
    }
  })

  document.getElementById('modal-close').addEventListener('click', (e)=>{
    modalBg.style.display = 'none'
    modalBox.style.display = 'none'
  })
}

// 8. Thông tin giao dịch rút tiền (admin)
function transactionWithdrawInfo(IDChuyenTien,username,SDTNguoiNhan,SoTien,BenChiuPhi){

  let chiuPhi = ''
  if (BenChiuPhi == 0) chiuPhi = 'Người chuyển'
  else chiuPhi = 'Người nhận'

  let modalBg = document.getElementById('modal-bg')
  let modalBox = document.getElementById('modal-box')
  let modalText = document.getElementById('modal-text')

  modalBg.style.display = 'block'
  modalBox.style.display = 'block'

  document.getElementById('modal-confirm').style.display = 'inline-block'

  document.getElementById('modal-refuse').style.display = 'inline-block'

  fetch('/admin/user', {
    method: 'POST',
    body: new URLSearchParams({
      username: username
    })
  }).then(res => res.json())
  .then(json => {
    if(json.code == 404) return false
    else{
        modalText.innerHTML = `
        <table>
          <tr>
            <td>Số tài khoản</td>
            <td>: ${json.username}</td>
          </tr>
          <tr>
            <td>Số điện thoại</td>
            <td>: ${json.SoDienThoai}</td>
          </tr>
          <tr>
            <td>Họ và tên</td>
            <td>: ${json.HoVaTen}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>: ${json.Email}</td>
          </tr>
        </table>
        <hr>
        <div>Số tiền : ${SoTien}</div>
        `

        document.getElementById('modal-confirm').addEventListener('click', (e)=>{
          modalText.innerText = 'Bạn có muốn duyệt giao dịch này'
          document.getElementById('modal-refuse').style.display = 'none'
          document.getElementById('modal-confirm').addEventListener('click', (e)=>{
            
            fetch('/admin/transaction/withdraw', {
              method: 'POST',
              body: new URLSearchParams({
                IDChuyenTien: IDChuyenTien,
                TrangThai: 1,
                username: username,
                SoTien: SoTien
              })
            }).then(resTransaction => resTransaction.json())
            .then(result => {
              console.log(result)
              if(result.code == 200){
                modalText.innerText = 'Giao dịch thành công'
                document.getElementById('modal-confirm').style.display = 'none'
                document.getElementById('modal-close').addEventListener('click',(e) => {
                  window.location.replace('/admin/transaction')
                })
              }
              else{
                modalText.innerText = result.msg
                document.getElementById('modal-confirm').style.display = 'none'
                document.getElementById('modal-close').addEventListener('click',(e) => {
                  window.location.replace('/admin/transaction')
                })

              }
            })
            
          })
    })
  }

  document.getElementById('modal-close').addEventListener('click', (e)=>{
    modalBg.style.display = 'none'
    modalBox.style.display = 'none'
  })

  document.getElementById('modal-refuse').addEventListener('click', (e) => {
    modalText.innerText = 'Bạn có muốn từ chối giao dịch này'

    document.getElementById('modal-refuse').style.display = 'none'

    document.getElementById('modal-confirm').addEventListener('click', (e)=>{
      
      fetch('/admin/transaction/refuse', {
        method: 'POST',
        body: new URLSearchParams({
          IDChuyenTien: IDChuyenTien
        })
      }).then(resTransaction => resTransaction.json())
      .then(result => {
        console.log(result)
        if(result.code == 200){
          modalText.innerText = 'Giao dịch đã bị hủy'
          document.getElementById('modal-confirm').style.display = 'none'
          document.getElementById('modal-close').addEventListener('click',(e) => {
            window.location.replace('/admin/transaction')
          })
        }
        else{
          modalText.innerText = result.msg
          document.getElementById('modal-confirm').style.display = 'none'
          document.getElementById('modal-close').addEventListener('click',(e) => {
            window.location.replace('/admin/transaction')
          })
        }
      })
    })
  })
})
}

//9. lịch sử rút tiền (user)
function userTransactionWithdraw(IDChuyenTien,username,TrangThai,NgayThucHien, SoTien){

  
    let modalBg = document.getElementById('modal-bg')
    let modalBox = document.getElementById('modal-box')
    let modalText = document.getElementById('modal-text')
  
    modalBg.style.display = 'block'
    modalBox.style.display = 'block'
  
    document.getElementById('modal-confirm').style.display = 'inline-block'
  

          modalText.innerHTML = `
          <table>
            <tr>
              <td>Số tài khoản</td>
              <td>: ${username}</td>
            </tr>
            <tr>
            </tr>
            <tr>
              <td>Trạng thái</td>
              <td>: ${TrangThai}</td>
            </tr>
            <tr>
              <td>Ngày thực hiện</td>
              <td>: ${NgayThucHien}</td>
            </tr>
          </table>
          <hr>
          <div>Số tiền : ${SoTien}</div>
          `

  document.getElementById('modal-close').addEventListener('click', (e) => {
    modalBg.style.display = 'none'
    modalBox.style.display = 'none'
  })
}

function isEmail(Email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(Email);
}

//10. onload đăng ký
$(document).ready(() => {
  $('#btn-register').click(() => {
    var err
    if ($('#HoVaTen').val() == "")
      err = 'Chưa nhập họ và tên!'
    else if ($('#Email').val() == "")
      err = 'Chưa nhập email!'
    else if (!isEmail($('#Email').val()))
      err = 'Email không hợp lệ!'
    else if ($('#SoDienThoai').val() == "")
      err = 'Chưa nhập số điện thoại!'
   
    else if ($('#NgayThangNamSinh').val() == "")
      err = 'Chưa nhập ngày tháng năm sinh!'

     else if ($('#DiaChi').val() == "")
      err = 'Chưa nhập địa chỉ!'
    
    if (err) {
      $('#alter-message').html('<div class="alert alert-danger alert-dismissible fade show">' +
        '<button id="btn-close" type="button" class="close" data-dismiss="alert">&times;</button>' +
        err)
    }
    else
      $('#form-register').submit()
  })
})

//11. onload rút tiền
function onloadRuttien(){
  const btnXacNhanRutTien = document.getElementById('xac-nhan-rut-tien');
  let successfulMsgRutTien = btnXacNhanRutTien.getAttribute("data-message");
  
  
  if (successfulMsgRutTien == 'successful') {
      btnXacNhanRutTien.click();
  }
  }


//12. onload nạp tiền
function onloadNaptien(){
  const btnXacNhanNapTien = document.getElementById('xac-nhan-nap-tien');
  if (btnXacNhanNapTien != null) {
    let successfulMsgNapTien = btnXacNhanNapTien.getAttribute("data-message");
    if (successfulMsgNapTien == 'successful') {
        btnXacNhanNapTien.click();
    }
}
}
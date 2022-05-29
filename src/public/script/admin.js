function profile(username){
  window.location.replace('/admin/profile/'+username)
}

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

//Bao gồm cả gửi request duyệt giao dịch
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

function isEmail(Email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(Email);
  }
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

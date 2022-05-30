$(document).ready(() => {
    $('#btn-login').click(() => {
      console.log(1)
      var err
      if ($('#Email').val() == "")
        err = 'Chưa nhập email!'
      else if ($('#password').val() == "")
        err = 'Chưa nhập mật khẩu!'
      else if ($('#password').val().length < 6)
        err = 'Mật khẩu phải ít nhất 6 ký tự!'
      if (err) {
        $('#alter-message').html('<div class="alert alert-danger alert-dismissible fade show">' +
          '<button id="btn-close" type="button" class="close" data-dismiss="alert">&times;</button>' +
          err)
      }
      else
        $('#form-login').submit()
    })
  })
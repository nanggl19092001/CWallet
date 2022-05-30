// ########### PROFILE ######################
const image_input = document.querySelector("#image-input");
function display_IMG(){
      image_input.addEventListener("change", function() { 
        const reader = new FileReader(); reader.addEventListener("load", () => { 
          const uploaded_image = reader.result;
        document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`; }); 
        reader.readAsDataURL(this.files[0]); 
      });
    }
function uploadCMND(){
  const btn_cmnd = document.querySelector(".btn_CMND");
  btn_cmnd.addEventListener("click", async (e) => {
    e.preventDefault();
    const username = btn_cmnd.getAttribute("data-id")
    const URL = `profileKH/${username}`
    let images = image_input.files;
    let formData = new FormData();
    
    formData.append('image', images[0]);
   
    $.ajax({
      method: 'PUT',
      data: formData,
      contentType: false, 
      processData: false,
      success: function (data) {
        console.log(data)
        alert(data.message); 
        location.reload(); 
      }
    })
  })
}
      

      // ########### RESTORE PASSWORD ######################
      // ########### RESTORE PASSWORD ######################
      
  function restorePassword(){
    let btn_restore = document.querySelector("#btn-restorePassword");
    
    btn_restore.addEventListener("click", (e) =>{
      e.preventDefault();
      const URL = "/auth/restorePassword/send";
      var email = document.querySelector('#email-restore').value;

      $.ajax({
          method: 'POST',
          url: URL,
          data: JSON.stringify({
            "email": email,
          }),
          dataType: 'json',
          contentType: "application/json", 
          processData: false,
          success: function (data) {
            const state = data.state;
            if (state === 0) {
              alert("Email này không tồn tại!");
            }
            else {
              document.querySelector('.contact').style.display = 'none';
              document.querySelector('.contact.verifyOtp').style.display = 'block';
              verifyOtp(data.id)
            }
          },
        })
    })
  }
      
      function verifyOtp(id) {
        let btnOtp = document.querySelector("#btn-verifyOtp");
        btnOtp.addEventListener("click", (e) =>{
          e.preventDefault();
          const URL = "/auth/verifyOtp";
          var otp = document.querySelector('#opt-restore').value;
  
          $.ajax({
            method: 'POST',
            url: URL,
            data: JSON.stringify({
              "otp": otp,
              "id": id,
            }),
            dataType: 'json',
            contentType: "application/json", 
            processData: false,
            success: function (data) {
              const state = data.state;
              if (state === 0) {
                alert("OTP này không đúng!");
              }
              else {
                location.href = '/auth/changePassword?username='+data.username
              }
            },
          })
        })
      }

      // ########### Change Password ######################
      // ########### Change Password ######################
      function changePassword(){
        document.getElementById("btn_changePW").disabled = true;
        document.getElementById("btn_changePW").style.background = "black";
        let message = document.getElementById('message')
        
        let cfmpassword = document.querySelector("#cnfrm-password");
        cfmpassword.addEventListener('change', function(e){
          let newpassword = document.getElementById("password").value;
          if (newpassword != e.target.value){
            message.innerHTML="Password không họp lệ!!!"
            document.getElementById("btn_changePW").disabled = true;
          }else{
            message.innerHTML="Password họp lệ!!!"
            message.style.color="green"
            document.getElementById("btn_changePW").disabled = false;
            document.getElementById("btn_changePW").style.background = "green";

          }
        })
        let username = window.location.search
        username = username.slice(username.indexOf("=")+1)
        console.log(username)
        let form = document.querySelector("form");
        let url = form.getAttribute("action") + "?username=" + username + '&_method=PATCH';
        form.setAttribute("action", url)
      }
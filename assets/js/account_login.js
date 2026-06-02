$(document).ready(function(){

    $("#uname").blur(function(){
        var uname = $("#uname").val();
        $.ajax({
            type: "POST",
            data: { type: 'checkUser', uname: uname },
            url: "includes/account_login.php",
            dataType: 'json',
            cache: false,
            beforeSend: function(){
            if (!$.trim(uname)){
                document.getElementById("login-btn").disabled = true;
                document.getElementById("uname").style.borderColor = "red";
                xhr.abort();
            }else{
                document.getElementById("login-btn").disabled = false;
                document.getElementById("uname").style.borderColor = "green";
            }
          },
            success: function(response){
                if(response.status == 'success'){
                    document.getElementById("login-btn").disabled = false;
                    document.getElementById("uname").style.borderColor = "green";
                }else{

                    Swal.fire({

                        title: "WARNING",
                        text: "Username is not registered",
                        imageUrl: "assets/images/pikachu.png",
                        imageWidth: 200,
                        imageHeight: 150,

                        confirmButtonText: "OKAY",

                        customClass: {

                            popup: 'poke-popup',

                            title: 'poke-title',

                            htmlContainer: 'poke-text',

                            confirmButton: 'poke-confirm',

                            cancelButton: 'poke-cancel'
                        }

                    });
                    document.getElementById("login-btn").disabled = true;
                    document.getElementById("uname").style.borderColor = "red";
                }
            }
        });
    });

        /* form submit */
    $('#loginForm').on('submit',(function(e) {
        e.preventDefault();

        var uname = $("#uname").val();
        var upass = $("#upass").val();

            $.ajax({
                type: "POST",
                url: "includes/account_login.php",
                data : { type: 'loginUser', uname:uname, upass:upass },
                dataType: 'json',
                cache: false,
                success: function(response){
                    $("#login-btn").html('Login');
                    if(response.status == "success"){
                        $('#loginForm').empty();
                        $('.progress').fadeIn();

                        $('body').css({"background":"#28a745", "transition":"background .8s ease-in-out"});
                        $('.fa-globe').css({"color":"red"});

                        var data = "";
                        data += '<div class="text-center"><i class="fa fa-globe fa-spin fa-fw fa-5x text-primary" aria-hidden="true" ></i>';
                        data += '<div>Connecting...</div>';
                        data += '<div class="progress progress-sm mb-5"><div id="progressBar" class="progress-bar bg-success progress-bar-striped progress-bar-animated"  style="width: 0%"></div></div>';
                        data += '</div>';

                        var counter = 0;
                        var maxCounter = 100;
                        var seconds = 1;
                        var interval = (seconds*1000) /  maxCounter
                        var loop = setInterval(function(){
                            $('#progressBar').css({"width": counter+"%"});
                            if (counter === maxCounter) {
                                $('#progressBar').removeClass('progress-bar-striped progress-bar-animated');
                                window.location = "mycollectr.php";
                                stopLoop();
                            }
                            counter++ }, interval);

                        function stopLoop () {
                          clearInterval(loop)
                        }


                      
                    }
                    else{


                    Swal.fire({

                        title: "WARNING",
                        text: "Invalid Password, please try again",
                        imageUrl: "assets/images/pikachu.png",
                        imageWidth: 200,
                        imageHeight: 150,

                        confirmButtonText: "OKAY",

                        customClass: {

                            popup: 'poke-popup',

                            title: 'poke-title',

                            htmlContainer: 'poke-text',

                            confirmButton: 'poke-confirm',

                            cancelButton: 'poke-cancel'
                        }

                    });
                        document.getElementById("upass").style.borderColor = "red";
                    }
                }
            });

    }));


    });//END FUNC;

const togglePassword = document.querySelector('.toggle-password');
const passwordInput = document.querySelector('#upass');
const icon = document.querySelector('.toggle-password i');

togglePassword.addEventListener('click', function(){

    if(passwordInput.type === 'password'){

        passwordInput.type = 'text';

        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');

    }else{

        passwordInput.type = 'password';

        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }

});
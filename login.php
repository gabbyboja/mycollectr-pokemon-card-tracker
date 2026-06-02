<?php session_start(); if(isset($_SESSION['token'])){ header('location: mycollectr.php');} require_once "includes/dbconfig.php"; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
     <link rel="stylesheet" href="assets/css/log_in.css">
    <title>Login</title>
</head>
<body>
    <div class="container">
        <div class="login-container">
                <div class="login-box">
                    <div class="logo">
                        <img src="assets/images/newerlogo.png" alt="" width="153px" height="30px">
                    </div>
                    <div>
                        <h2>Welcome!</h2>
                        <p>Log in and start your collection journey!</p>
                        <form id="loginForm" enctype="multipart/form-data" method="POST">
                            <label for="uname">Username</label>
                            <input type="text" id="uname"  required><br><br>
                            <label for="upass">Password</label>
                        <div class="password-wrapper">
                            <input type="password" id="upass" required>

                            <span class="toggle-password">
                                <i class="fa-solid fa-eye"></i>
                            </span>
                        </div>
                            <button id="login-btn" type="submit">Log in</button>
                        </form>
                    <h5>Don't have an account? <a href="register.php">Register here</a></h5>
                    </div>
                </div>

                <div class="right-side">
                    Growing Web app, 

                </div>
        </div>
    
    </div>   
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="assets/js/account_login.js"></script>
</body>
</html>


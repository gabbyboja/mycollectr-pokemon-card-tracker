<?php
require_once 'dbconfig.php';
session_start();


$type = $_POST['type'];

if($type == 'checkUser'){

	$uname = $_POST['uname'];
	$stmt = $conn->prepare("SELECT username FROM users WHERE username = ?");
	$stmt->execute([$uname]);
	$row = $stmt->fetch(PDO::FETCH_ASSOC);

	if($row['username'] == $uname){
		$data = array('status'=>'success');
	}else{
		$data = array('status'=>'checkError');
	}
    echo json_encode(utf8ize($data));
}

if($type == 'loginUser'){

	$uname = $_POST['uname'];
	$upass = $_POST['upass'];

		$stmt = $conn->prepare("SELECT id, nickname, username FROM users  WHERE username = ? AND password = ? ");
		$stmt->execute([$uname, $upass]);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);

        
    
		if(!empty($row['id'])){
			$id = $row['id'];

			$token = bin2hex(random_bytes(10));

			$_SESSION['token'] = $token;

			$_SESSION['user_id'] = $row['id'];
			$_SESSION['nickname'] = $row['nickname'];
			$_SESSION['username'] = $row['username'];

            $data = array('status'=>'success');
	        echo json_encode(utf8ize($data));
    }else{
        echo json_encode(['status' => 'error']);
    }


	}
<?php

if(isset($_POST['name'],$_POST['email'],$_POST['message'])){
    mb_internal_encoding("UTF-8");

    $sender = $_POST['name'];
    $message = "Message from ".$sender." : \r\n";
    $message.=$_POST['message'];

    $to = "info@hirokazunakajima.com";
    $from = $_POST['email'];

    $header = "From : ".$from."\r\n";
    $header.= "To : ".$to;

    $subject = 'Request from : "'.$sender.'"';


    // send email
    if(mail($to,$subject,$message,$header))
    {
        // return data as JSON format
        echo json_encode(
            array(
                'status'=>'1',
                'response'=>'Thank you!! I\'ll read your message and replay soon!'

            ));

    }else{

        echo json_encode(
            array(
                'status'=>'0',
                'response'=>'Sorry, Something went wrong...Could you send email to info@hirokazunakajima.com, please?'
            ));
    }

}else{

    echo json_encode(
        array(
            'status'=>'2',
            'response'=>'Something\'s not right here. Double check your email and try again.'
        ));

}
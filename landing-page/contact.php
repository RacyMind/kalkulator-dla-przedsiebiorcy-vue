<?php
function validData() {
    $data = $_POST;
    $errorMessage = null;

    if(empty($data['subject'])) {
        $errorMessage = 'Wybierz temat';
    }
    if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errorMessage = 'Wpisz adres email';
    }
    if(empty($data['message'])) {
        $errorMessage = 'Wpisz wiadomość';
    }

    if($errorMessage) {
        http_response_code(400);
        echo $errorMessage;
        exit;
    }
}
$_POST = json_decode(file_get_contents("php://input"), true);

if (isset($_POST)) {
    validData();

    $headers = "From: \"".$_POST['name']."\" <".$_POST['email'].">\n";
    $headers.="Return-Path: \"".$_POST['name']."\" ".$_POST['email'].">\n";
    $headers.="X-Sender: \"".$_POST['name']."\" <".$_POST['email'].">\n";
    $headers.="X-Mailer: PHP\n";
    $headers.="X-Priority: 3 (Normal)\n";
    $headers.="X-MSMail-Priority: Normal\n";
    $headers.="MIME-Version: 1.0\n";
    $headers.="Content-Type: text/plain; charset=utf-8\n";
    $headers.="Content-Transfer-Encoding: quoted-printable\n\n";
    $content_mail = 'Od: ' . $_POST['name'] . ' ' . $_POST['email'] . '
Treść: ' . $_POST['message'];
    if (mail('kontakt@lukasz-socha.pl', 'Kalkulator finansowy - ' . $_POST['subject'], $content_mail, $headers)) {
        http_response_code(200);
        exit;
    } else {
        http_response_code(400);
        echo 'Wiadomość nie została wyłana. Spróbuj ponownie';
        exit;
    }
}
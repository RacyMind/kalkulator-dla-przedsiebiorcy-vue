<?php

$json = array();
if (isset($_POST)) {
    $json['post'] = $_POST;
    $headers = "From: \"Racy Mind\" <noreply@racymind.pl>\n";
    $headers.="Return-Path: \"Racy Mind\" <noreply@racymind.pl>\n";
    $headers.="X-Sender: \"Racy Mind\" <noreply@racymind.pl>\n";
    $headers.="X-Mailer: PHP\n";
    $headers.="X-Priority: 3 (Normal)\n";
    $headers.="X-MSMail-Priority: Normal\n";
    $headers.="MIME-Version: 1.0\n";
    $headers.="Content-Type: text/plain; charset=utf-8\n";
    $headers.="Content-Transfer-Encoding: quoted-printable\n\n";
    $content_mail = 'Od: ' . $_POST['name'] . ' ' . $_POST['email'] . '
Treść: ' . $_POST['content'];
    if (mail('kontakt@lukasz-socha.pl', 'Ze strony kalkulatora', $content_mail, $headers)) {
        $json['status'] = 'ok';
    } else {
        $json['status'] = 'error';
    }
}
header('Content-Type: application/json');
echo json_encode($json);
?>
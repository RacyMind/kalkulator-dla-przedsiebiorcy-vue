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
    $headers.="Content-Type: text/html; charset=utf-8\n";
    $headers.="Content-Transfer-Encoding: quoted-printable\n\n";
    $content_mail = '<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Kalkulator dla przedsiębiorcy</title>
</head>

<body style="margin: 0; padding: 0" bgcolor="#FFFFFF">
<table width="100%" bgcolor="#FFFFFF" border="0" align="center" cellpadding="0" cellspacing="0">
	<tbody>
    	<tr>
        	<td align="center">
            <table width="600" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="padding: 0; margin: 0;">
              		<tbody>
                    	<tr>
                        	<td height="50" bgcolor="#ffffff">
                            </td>
                        </tr>
                    </tbody>
                </table>
            	<table width="600" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#ebf4f6" style="padding: 0; margin: 0;">
              		<tbody>
                    	<tr>
                        	<td height="140" bgcolor="#d12526">
                            	<img src="http://kalkulator.racymind.pl/mailing//top.jpg"/>
                            </td>
                        </tr>
                    </tbody>
                </table>
               <table width="600" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#ebf4f6" style="padding: 0; margin: 0;">
              		<tbody>
                    	<tr>
                        	<td height="40" bgcolor="#ebf4f6">
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table width="600" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#ebf4f6" style="padding: 0; margin: 0;">
              		<tbody>
                    	<tr>
                        	<td class="spacer" width="40" align="left" bgcolor="#ebf4f6" style="margin: 0; padding: 0; line-height: 0;"></td>
                        	<td height="140" bgcolor="#ebf4f6">
                            	<p style="font-size: 17px; font-family: Arial; color: #232323; margin: 0; padding: 0; font-weight: bold;">
                                Witaj,<br/>Twój znajomy ('.$_POST['your-email'].') poleca Ci aplikację <a href="http://kalkulator.racymind.pl" style="color: #d12526; text-decoration:none;">Kalkulator dla przedsiębiorcy</a>!</p>
                                <p></p>
                                <p style="font-size: 15px; font-family: Arial; color: #232323; line-height: 21px; margin: 0; padding: 0;">
                                Aplikacja "Kalkulator dla przedsiębiorcy" jest bezpłatnym programem na Androida umożliwiającym łatwe obliczenie wynagrodzeń dla samozatrudnienia (jednoosobowej firmy), umowy o pracę, umowy zlecenie, umowy o dzieło oraz kwotę odsetek za płatności po terminie. Poza wynagrodzeniem aplikacja generuje szczegółowe zestawienie składek ZUS.
                                </p>
                                <p></p>
                                <p><a href="http://kalkulator.racymind.pl" target="_blank" style="font-size: 17px; font-family: Arial; color: #d12526; padding: 0; padding: 0; font-weight: bold; text-decoration: none">dowiedz się więcej</a></p>                       
                            </td>
                            <td class="spacer" width="50" align="left" bgcolor="#ebf4f6" style="margin: 0; padding: 0; line-height: 0;"></td>
                        </tr>
                    </tbody>
                </table>
                <table width="600" height="40" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#ebf4f6" style="padding: 0; margin: 0;">
              		<tbody>
                    	<tr>
                        	<td height="40"></td>
                        </tr>
                    </tbody>
                </table>
                <table width="600" height="40" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#ebf4f6" style="padding: 0; margin: 0;">
              		<tbody>
                    	<tr>
                        	<td><p style="text-align: center;"><a href="https://play.google.com/store/apps/details?id=racyMind.kalkulator" style="border: 0"><img src="http://kalkulator.racymind.pl/mailing//google-play.jpg" /></a></p></td>
                        </tr>
                    </tbody>
                </table>
                <table width="600" height="40" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#ebf4f6" style="padding: 0; margin: 0;">
              		<tbody>
                    	<tr>
                        	<td height="40"></td>
                        </tr>
                    </tbody>
                </table>
                <table width="600" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#ebf4f6" style="padding: 0; margin: 0;">
              		<tbody>
                    	<tr>
                        	<td><p style="text-align: center; padding:0; margin:0;"><img src="http://kalkulator.racymind.pl/mailing//screens.jpg" style="margin:0; padding:0;"/></p></td>
                        </tr>
                    </tbody>
                </table>
                <table width="600" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#d12526" style="padding: 0; margin: 0;">
              		<tbody>
                    	<tr>
                        	<td height="30" bgcolor="#d12526">
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table width="600" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="padding: 0; margin: 0;">
              		<tbody>
                    	<tr>
                        	<td height="40" bgcolor="#ffffff">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </td>
        </tr>
    </tbody>
</table>
</body>
</html>
';
    if (mail($_POST['friend-email'], 'Znajomy polecił ci naszą aplikację', $content_mail, $headers)) {
        $json['status'] = 'ok';
    } else {
        $json['status'] = 'error';
    }
}
header('Content-Type: application/json');
echo json_encode($json);
?>
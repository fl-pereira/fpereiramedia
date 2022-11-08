<? 
include "funcao.php";

if(strlen($_POST['nome']))
{
    if(sendMail($_POST['email'],'falecom@fpereiramedia.com.br', $_POST['mensagem'], 'Formul&aacute;rio de contato'))
    {
        echo "Sua mensagem foi enviada com sucesso!";
    }
    else
    {
        echo "Ocorreu um erro ao enviar";
    }
    echo "<br><a href='http://fpereiramedia.com.br/'>Voltar</a>";
    exit();
}
?>

<!DOCTYPE html>
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
		<title> F.Pereira | Media - Fotografia e Vídeo </title>
		<meta name="description" content="">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
        
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon">

		<!--[if lt IE 9]>
		<script src="../../js/vendor/html5shiv.min.js"></script>
		<![endif]-->

		<link href='http://fonts.googleapis.com/css@family=Lobster' rel='stylesheet' type='text/css'>
		<link rel="stylesheet" href="../css/font_icons.css">
		<link rel="stylesheet" href="../css/style.css">
		<link rel="stylesheet" href="../css/custom.css">
		<link rel="stylesheet" href="../css/jquery.fancybox-1.3.4.css">
		<link rel="stylesheet" href="../css/flexslider.css">
		<link rel="stylesheet" href="style.css">

		<script src="../js/vendor/modernizr-2.6.1.min.js"></script>
	</head>
	<body>
		<header id="mpcth_header">
			<a href="../default.htm" target="_self"><img src="../images/logo.png" style="margin-top: 10px; margin-left: 10px;"></a>
			<form id="mpcth_search_form" action="#">
				<input name="search" value="Procurar" onfocus="if (this.value == 'Search...') {this.value = '';}" onblur="if (this.value == '') {this.value = 'Search...';}" type="text">
			</form>
			<nav id="mpcth_menu">
				<ul>
					<li><a href="../index.html">Home</a></li>
					<li><a href="sobre.html">Sobre</a></li>
					<li><a href="contact.php">Contato</a></li>
				</ul>
			</nav>
		</header>

		<div id="mpcth_main_container">
			<div id="mpcth_content" class="mpcth-fullscreen">
				<iframe width="100%" height="400" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https:/maps.google.com/maps?ie=UTF8&ll=-23.3170853,-51.1689407&spn=0.007325,0.016512&t=v&z=17&output=embed"></iframe>

				<div id="mpcth_article">
					<h2>Converse com a gente:</h2>
					<hr>
					<p>Gostou do nosso trabalho? Entre em contato conosco e vamos fazer algo legal para você ou sua empresa também!</p>
					<div class="column one_third">
						<p>
							F.Pereira | Media - Fotografia e Vídeo<br>
							Rua Paranguá, 1255 - Sl. 22 - Londrina/PR
						</p>
						<ul class="mpcth-list">
							<li class="mpcth-icon-right-open-mini">Fone: +55 43 3027 5334</li>
							<li class="mpcth-icon-right-open-mini">E-mail: falecom@fpereiramedia.com.br</li>
							<li class="mpcth-icon-right-open-mini">Facebook: www.fb.com/fpereira.media</li>
						</ul>
					</div>
                    
					<div class="column two_third last">
                    
   					 <form method="post" id="formulario_contato" onsubmit="validaForm(); return false;" class="form">
					  <p class="name">
         			   <input type="text" name="nome" id="nome" placeholder="Seu Nome" />
					  
          			   <input type="text" name="email" id="email" placeholder="mail@exemplo.com.br" />
					  </p>		
	
					  <p class="text">
            		   <textarea name="mensagem" id="mensagem" placeholder="Escreva sua mensagem" /></textarea>
					  </p>
		
					  <p class="submit">
            		   <input type="submit" value="Enviar" />
					  </p>
					 </form>
                     
					</div>
                    
					<div class="mpcth-clearboth"></div>
				</div>
			</div>
		</div>

		<a href="#" id="mpcth_footer_toggler">
			<span class="mpcth-icon plus"></span>
			<span class="mpcth-icon minus"></span>
		</a>
		<footer id="mpcth_footer">
			<div id="mpcth_copyright">© 2014 F.Pereira | Media, Todos os Direitos Reservados</div>
			<div id="mpcth_socials">
				<ul>
					<li><a href="https://www.facebook.com/fpereira.media" class="social mpcth-icon-facebook-circled"></a></li>
					<li><a href="https://vimeo.com/fpereiramedia" class="social mpcth-icon-vimeo-circled"></a></li>
					<li><a href="https://www.flickr.com/photos/fpereiraphotos/" class="social mpcth-icon-flickr-circled"></a></li>
				</ul>
			</div>
		</footer>

		<script src="../js/vendor/jquery-1.8.1.js"></script>
		<script src="../js/vendor/jquery.isotope.min.js"></script>
		<script src="../js/vendor/jquery.fancybox-1.3.4.js"></script>
		<script src="../js/vendor/jquery.flexslider.min.js"></script>
		<script src="../js/vendor/jquery.validate.min.js"></script>
		<script src="../js/scripts.js"></script>
	</body>
</html>
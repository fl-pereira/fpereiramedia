jQuery(document).ready(function($) {
	var $menu = $('#mpcth_menu'),
		$mobileMenu = $('<select id="mpcth_mobile_menu"></select>'),
		$footer = $('#mpcth_footer'),
		$footerToggler = $('#mpcth_footer_toggler'),
		$contactForm = $('#mpcth_cf'),
		$tabs = $('.mpcth-tabs'),
		$toggle = $('.mpcth-toggle')
		$frame = $('iframe'),
		$search = $('#mpcth_search_form'),
		$flexslider = $('.flexslider'),
		$grid = $('#mpcth_grid'),
		$window = $(window);

	var footerVisible = false;

	$window.load(function() {
		$window.trigger('resizeFrames');

		$window.on('setShortcodes', function() {
			if($flexslider.length) {
				$flexslider.flexslider({
					controlNav: false
				});
			}
		})
		$window.trigger('setShortcodes');

		if($grid.length) {
			if($grid.is('.mpcth-blog')) {
				initBlogGrid();
			} else {
				initPortfolioGrid();
			}
		}
	});

	$window.on('resizeFrames', function() {
		if($frame.length) {
			$frame.each(function() {
				var $this = $(this);

				if(($this.attr('src').indexOf('vimeo') != -1 || $this.attr('src').indexOf('youtube') != -1 || $this.attr('src').indexOf('maps.google') != -1) && $this.hasClass('mpcth-fullwidth-frame')) {
					var baseWidth = $this.attr('width');
						baseHeight = $this.attr('height');

					$this.width('100%');

					var newWidth = $this.width(),
						ratio = newWidth / baseWidth;

					$this.height(baseHeight * ratio);
				}
			});
		}
	})
	$window.trigger('resizeFrames');

	$window.on('setShortcodes', function() {
		if($toggle.length) {
			$toggle.each(function() {
				var $this = $(this);
				var $title = $this.children('.mpcth-toggle-title');
				var $content = $this.children('.mpcth-toggle-content');
				
				$content.hide();

				$title.off('click');
				$title.on('click', function(e) {
					e.preventDefault();

					var $this = $(this);
					
					if($this.hasClass('open')) {
						$this.removeClass('open');

						$content.stop(true, true).slideUp();
					}
					else {
						$this.addClass('open');

						$content.stop(true, true).slideDown();
					}
				})
			});
		}
	})

	$window.on('setShortcodes', function() {
		if($tabs.length) {
			$tabs.each(function() {
				var $this = $(this);
				var $tab = $this.find('.mpcth-tab a');
				var $content = $this.find('.mpcth-tab-content');
				
				$content
					.hide()
					.first()
						.show();

				$tab
					.first()
						.addClass('active');

				$tab.off('click');
				$tab.on('click', function(e) {
					e.preventDefault();

					var $this = $(this);

					if(!$this.hasClass('active')) {
						var id = $this.attr('href');
						
						$tab.removeClass('active');
						$this.addClass('active');

						$content
							.hide()
							.filter(id)
							.fadeIn();
					}
				})
			});
		}
	})

	$window.on('setShortcodes', function() {
		if($contactForm.length) {
			var $name = $('#mpcth_cf_name'),
				$mail = $('#mpcth_cf_mail'),
				$message = $('#mpcth_cf_message'),
				$submit = $('#mpcth_cf_submit'),
				$curtain = $('#mpcth_cf_curtain'),
				$info = $('#mpcth_cf_info');

			$.validator.addMethod("notEqual", function(value, element, param) {
				if(element.value == param)
					return false;
				else if(element.text == param)
					return false;
				else
					return true;
			}, "O campo deve ser preenchido.");
			
			$.validator.addMethod("notEqual", function(value, element, param) {
				return value !== param;
			}, "O campo deve ser preenchido.");

			$contactForm.validate({
				rules: {
					name: {
						required: true,
						minlength: 2,
						notEqual: 'Nome *'
					},
							
					mail: {
						required: true,
						email: true, 
						notEqual: 'E-mail *'
					},
					
					message: {
						required: true,
						minlength: 5,
						notEqual: 'Mensagem *'	
					}		
				},	
				messages: {
					name: 'Insira um nome válido.',
					mail: 'Insira um e-mail válido.',
					message: 'Sua mensagem deve ter ao menos 5 caracteres.'
				},
				submitHandler: function() {
					$curtain.fadeIn(100);

					$.ajax({
						url: document.location.origin + '/php/simple_mailer.php',
						type: 'POST',
						dataType: 'text',
						data: {
							mpc_submit: true,
							name: $name.val(),
							mail: $mail.val(),
							message: $message.val()
						},
						complete: function(respond, status) {
							$curtain.fadeOut(100);

							if(status == 'success' && respond.responseText == 'mpc_success') {
								$name.val('');
								$mail.val('');
								$message.val('');

								$info
									.removeClass()
									.addClass('correct')
									.text('Obrigado, retornaremos em breve. :)')
									.fadeIn(500)
									.delay(2000)
									.fadeOut(500);
							}
							else {
								$info
									.removeClass()
									.addClass('incorrect')
									.text('Desculpe, algo está errado! :(')
									.fadeIn(500)
									.delay(2000)
									.fadeOut(500);
							}
						}
					})
				},
				invalidHandler: function() {
					$info
						.removeClass()
						.addClass('incorrect')
						.text('Por favor, preencha os campos corretamente.')
						.fadeIn(500)
						.delay(2000)
						.fadeOut(500);
				}
			});
		}
	})

/* ---------------------------------------------------------------- */
/* Grid functions
/* ---------------------------------------------------------------- */

	function updateVars() {
		$flexslider = $('.flexslider');
		$contactForm = $('#mpcth_cf');
		$tabs = $('.mpcth-tabs');
		$toggle = $('.mpcth-toggle');
		$frame = $('iframe');
	}

	function initBlogGrid() {
		var $page = $('#mpcth_content');
		var $items = $grid.children('.mpcth-grid-item');
		var $loadMore = $('#mpcth_grid_load_more');

		var ITEM_MAX_WIDTH = 620;

		var itemSpace = 20;

		if($window.width() < 650)
			var rowItems = 1;
		else
			var rowItems = Math.ceil(($page.width() - itemSpace) / ITEM_MAX_WIDTH);

		var width = Math.ceil(($page.width() - itemSpace) / rowItems);
		var resizeTimer;

		if($loadMore.length) {
			var path = $loadMore.data('path');
			var name = $loadMore.data('name');
			var index = 1;
			var $loader = $('<div></div>');

			$loadMore.animate({
				'right': 0
			}, 100)

			$loadMore.on('click', function(e) {
				e.preventDefault();

				$loadMore.animate({
					'right': '-100%'
				}, 100)

				$loader.load(path + '/' + name + index + '.html .mpcth-grid-item', function(responseText, textStatus, XMLHttpRequest) {

					if(textStatus == 'success')
						$loader.imagesLoaded(function(){
							var $newItems = $loader.find('.mpcth-grid-item');

							$newItems.width(width - itemSpace);

							$grid.isotope('insert', $newItems, function() {
								if($newItems.find('iframe')) {
									$window.trigger('resizeFrames');
									$grid.isotope('reLayout');
								}
							});

							$items = $grid.children('.mpcth-grid-item');

							updateVars();

							$window.trigger('setShortcodes');

							$.ajax({
								url: path + '/' + name + index + '.html',
								type: 'HEAD',
								error: function() {
									$loadMore.hide();
								},
								success: function() {
									$loadMore.animate({
										'right': 0
									}, 100)
								}
							});
						});
					else
						$loadMore.hide();
				})

				index++;
			})
		}

		$grid.width(width * rowItems);
		$items.width(width - itemSpace);

		$window.trigger('resizeFrames');

		if($.browser.msie && $.browser.version[0] == '8') {
			$grid.isotope({
				resizable: false,
				itemSelector: '.mpcth-grid-item',
				animationOptions: {
					duration: 300
				},
				transformsEnabled: false,
				masonry: {
					columnWidth: width,
				}
			});

			$items.stop(true).fadeTo(500, 1);
		} else {
			$grid.imagesLoaded(function(){
				$grid.isotope({
					resizable: false,
					itemSelector: '.mpcth-grid-item',
					animationOptions: {
						duration: 300
					},
					transformsEnabled: false,
					masonry: {
						columnWidth: width,
					}
				});

				$items.stop(true).fadeTo(500, 1);
			});
		}

		$window.resize(function(){
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(resizeGrid, 200);
		});

		function resizeGrid() {
			if($window.width() < 650)
				rowItems = 1;
			else
				rowItems = Math.ceil(($page.width() - itemSpace) / ITEM_MAX_WIDTH);
			width = Math.ceil(($page.width() - itemSpace) / rowItems);

			$grid.width(width * rowItems);
			$items.width(width - itemSpace);

			$window.trigger('resizeFrames');

			$grid.isotope({
				masonry: {
					columnWidth: width
				}
			});
		}
	}

	function initPortfolioGrid() {
		var $filter = $('#mpcth_grid_filter');
		var $page = $('#mpcth_content');
		var $items = $grid.children('.mpcth-grid-item');
		var $lightbox = $items.find('.mpcth-grid-item-lightbox:not(.mpcth-iframe-lightbox)');
		var $lightboxIF = $items.find('.mpcth-grid-item-lightbox.mpcth-iframe-lightbox');
		var $loadMore = $('#mpcth_grid_load_more');

		var ITEM_MAX_WIDTH = $grid.is('.mpcth-portfolio-big') ? 670 : 420;
		var ITEM_MAX_HEIGHT = Math.round(ITEM_MAX_WIDTH * 0.65);

		if($window.width() < 650)
			var rowItems = 1;
		else
			var rowItems = Math.ceil($page.width() / ITEM_MAX_WIDTH);

		var width = Math.ceil($page.width() / rowItems);
		var ratio = width / ITEM_MAX_WIDTH;
		var height = Math.ceil(ITEM_MAX_HEIGHT * ratio);
		var resizeTimer;

		$lightbox.fancybox({
			padding: 0
		});
		$lightboxIF.fancybox({
			padding: 0,
			width: '80%',
			height: '80%',
			type: 'iframe'
		});

		if($loadMore.length) {
			var path = $loadMore.data('path');
			var name = $loadMore.data('name');
			var index = 1;
			var $loader = $('<div></div>');

			$loadMore.animate({
				'right': 0
			}, 100)

			$loadMore.on('click', function(e) {
				e.preventDefault();

				$loadMore.animate({
					'right': '-100%'
				}, 100)

				$loader.load(path + '/' + name + index + '.html .mpcth-grid-item', function(responseText, textStatus, XMLHttpRequest) {

					if(textStatus == 'success')
						$loader.imagesLoaded(function(){
							var $newItems = $loader.find('.mpcth-grid-item');

							if($grid.is('.mpcth-portfolio-3d'))
								$newItems.each(function() {
									$(this).children().addClass('mpcth-grid-item-3d-enabled');
								})

							$newItems
								.width(width)
								.height(height);

							if($.browser.msie || $.browser.opera) {
								$newItems.find('.mpcth-grid-item-vignette').remove();
							}

							$grid.isotope('insert', $newItems);

							$items = $grid.children('.mpcth-grid-item');

							cutParagraph();

							updateVars();

							$window.trigger('setShortcodes');

							$.ajax({
								url: path + '/' + name + index + '.html',
								type: 'HEAD',
								error: function() {
									$loadMore.hide();
								},
								success: function() {
									$loadMore.animate({
										'right': 0
									}, 100)
								}
							});
						});
					else
						$loadMore.hide();
				})

				index++;
			})
		}

		if($filter.length) {
			$filter.find('a').first().addClass('active');

			$filter.on('click', 'a', function(e) {
				e.preventDefault();

				$filter.find('a').removeClass('active');
				var $this = $(this);
				$this.addClass('active');

				$grid.isotope({
					filter: $this.data('filter')
				});
			})
		}

		if(!Modernizr.csstransforms3d)
			$grid.removeClass('mpcth-portfolio-3d');

		if($grid.is('.mpcth-portfolio-3d')) {
			$items.each(function() {
				var $this = $(this);
				$this.children().addClass('mpcth-grid-item-3d-enabled');
			})

			$grid.on('mouseenter', '.mpcth-grid-item', function() {
				var $this = $(this);
				$this.children().addClass('hover');
			})
			$grid.on('mouseleave', '.mpcth-grid-item', function() {
				var $this = $(this);
				$this.children().removeClass('hover');
			})
		} else {
			$grid.on('mouseenter', '.mpcth-grid-item', function() {
				var $this = $(this);
				$this.children('.mpcth-grid-item-back').stop(true, true).fadeTo(200, 1);
			})
			$grid.on('mouseleave', '.mpcth-grid-item', function() {
				var $this = $(this);
				$this.children('.mpcth-grid-item-back').stop(true, true).fadeTo(200, 0);
			})
		}

		$grid.width(width * rowItems);
		$items
			.width(width)
			.height(height);

		cutParagraph($items, height);

		$window.trigger('resizeFrames');

		if($.browser.msie || $.browser.opera) {
			$items.find('.mpcth-grid-item-vignette').remove();
		}
		
		if($.browser.msie && $.browser.version[0] == '8') {
			$grid.isotope({
				resizable: false,
				itemSelector: '.mpcth-grid-item',
				animationOptions: {
					duration: 300
				},
				transformsEnabled: false,
				layoutMode: 'cellsByRow',
				cellsByRow: {
					columnWidth: width,
					rowHeight: ITEM_MAX_HEIGHT * ratio
				}
			});

			$items.stop(true).fadeTo(500, 1);
		} else {
			$grid.imagesLoaded(function(){
				$grid.isotope({
					resizable: false,
					itemSelector: '.mpcth-grid-item',
					animationOptions: {
						duration: 300
					},
					transformsEnabled: false,
					layoutMode: 'cellsByRow',
					cellsByRow: {
						columnWidth: width,
						rowHeight: ITEM_MAX_HEIGHT * ratio
					}
				});

				$items.stop(true).fadeTo(500, 1);
			});
		}

		$window.resize(function(){
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(resizeGrid, 200);
		});

		function cutParagraph() {
			var fontSize = parseInt($('body').css('font-size'), 10) * 1.5;

			$items.each(function() {
				var $back = $(this).children('.mpcth-grid-item-back'),
					headerHeight = $back.children('header').outerHeight() + 10,
					paragraphLines = Math.floor((height - headerHeight) / fontSize) - 4,
					paragraphHeight = paragraphLines * fontSize + 10;
				
				$back.children('p').height(paragraphHeight);
			})
		}

		function resizeGrid() {
			if($window.width() < 650)
				rowItems = 1;
			else
				rowItems = Math.ceil($page.width() / ITEM_MAX_WIDTH);
			width = Math.ceil($page.width() / rowItems);
			ratio = width / ITEM_MAX_WIDTH;
			height = Math.ceil(ITEM_MAX_HEIGHT * ratio);

			$grid.width(width * rowItems);
			$items
				.width(width)
				.height(height);

			cutParagraph($items, height);

			$window.trigger('resizeFrames');

			$grid.isotope({
				cellsByRow: {
					columnWidth: width,
					rowHeight: ITEM_MAX_HEIGHT * ratio
				}
			});
		}
	}

/* ---------------------------------------------------------------- */
/* Page elements
/* ---------------------------------------------------------------- */

	$menu.on('click', 'a', function(e) {
		var $this = $(this);
		if($this.attr('href') == '#')
			e.preventDefault();
	})
	$menu.find('li').each(function() {
		var $this = $(this);

		if($this.children('ul').length) {
			$this.hover(function() {
				$this.children('ul').stop(true, true).fadeIn(200);
			}, function() {
				$this.children('ul').stop(true, true).fadeOut(200);
			})
		}

		var $item = $this.children('a');
		var href = $item.attr('href');
		var level = $this.parents('li').length * 2;
		
		$mobileMenu.append('<option value="' + href + '">' + ('- - - - - - - - - - - - ').substr(0, level) + $item.text() + '</option>');

		if(href == window.location.href)
			$mobileMenu.children().last().attr('selected', 'selected');
	});

	if($.browser.msie) { $('html, body').addClass('msie') }
	$mobileMenu.appendTo('#mpcth_header');
	$mobileMenu.on('change', function() {
		window.location.href = $mobileMenu.children(':selected').val();
	})

	$footerToggler.on('click', function(e) {
		e.preventDefault();

		if(footerVisible) {
			$footerToggler.children('.minus').fadeOut();
			$footerToggler.children('.plus').fadeIn();

			$footer.animate({
				'left': '-100%'
			}, 'easeOutExpo')
		}
		else {
			$footerToggler.children('.minus').fadeIn();
			$footerToggler.children('.plus').fadeOut();

			$footer.animate({
				'left': 0
			}, 'easeOutExpo')
		}

		footerVisible = !footerVisible;
	});
});
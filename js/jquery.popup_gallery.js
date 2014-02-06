	(function($){
		$.fn.popup_gallery = function(opts){
		opts = $.extend({}, $.fn.popup_gallery.defaults, opts);
			return this.each(function(){
				$.fn.popup_gallery.instances[$(this).attr('id')] = new PopupGallery(this, opts, $(this).attr('id') );
				return $.fn.popup_gallery.instances[$(this).attr('id')];
			});
		};
		
		$.fn.popup_gallery.instances = new Object();
		$.fn.popup_gallery_refresh = function(){
		};	
		
		// default options
		$.fn.popup_gallery.defaults = {
			'itemClass' : 'popup-gallery-preview-item',
			'previewCount' : 100,
			'title' : 'Фотогалерея',
			'inlineTitle' : false,
			'addHtml' : false
		};

		var PopupGallery = function(obj, o, instance_id){

		var j_popup_gallery; // элемент с контентом галереи для всплыващего окна
		var popap_gallery; // элемент с контентом в всплывающем окне
		// текущий пункт превью (можем узнать индекс, подсветить текущую)
		var currentPreview = null;
		var countElements = 0;
		var countItem; // номер текущей выбранной превьюшки
		var thumbIndex = 0;

        var renderHTML = function () {
            var j_gallery = $(obj);
            j_gallery.each(function () {
                
            	elements = $(obj).find("."+o.itemClass);
            	$(elements).each(function(){
            		$(this).attr("index", thumbIndex);
            		thumbIndex++;
            	});

                j_popup_gallery = $("<div class='j-popup-gallery'" + "/>");
                popup_gallery = $("<div class='popup-gallery'" + "/>");
                j_popup_gallery.append(popup_gallery);
                $(this).append(j_popup_gallery);
                popup_gallery.html(
                    "<div class='popup-gallery-prev-next'>" +
                        "<a href='#' class='popup-gallery-prev'>предыдущая</a>" +
                        "<a href='#' class='popup-gallery-next'>следующая</a>" +
                    "</div>" +
                    "<div class='j-popup-gallery-thumbs context'></div>" +
                    "<div class='j-popup-gallery-images'></div>" +
                    "<div class='j-popup-gallery-image-view' style='text-align: center;'>&nbsp;</div>"+
                    "<div class='j-popup-gallery-image-view-hidden' style='position: absolute; height: 1000px; left: -2000px;'></div>"
                );
                thumbsMenu = popup_gallery.children(".j-popup-gallery-thumbs");
                var images = popup_gallery.children(".j-popup-gallery-images")
                var previewcount = o.previewCount;
                $(elements).each(function () {
                    var thumbs_item = $("<div class='j-popup-gallery-thumbs-item'>"+
                    "<a href='#' style='background: url(" + $(this).attr("rel") + ") center center no-repeat'></a></div>");
                    thumbsMenu.append(thumbs_item);
                    var images_item = $("<a href=''></a>");
                    images_item.attr("href", $(this).attr("href"));
                    images.append(images_item);
                    if ($(this).prevAll().length < previewcount) {
                        $(this).css("display", "block");
                    }
                });

            });
        };

		// инициализация галереи, галерея - div-контейнера галереи есть класс j-gallery
		var init = function () {
            renderHTML();
			previewHandler();
		};

		// обработка при нажатии на превью
		var previewHandler = function () {
			var first_load = true;
			// создали попап и навесили его на элементы превью
			$(obj).find("."+o.itemClass).popup({
				title: o.title,
				content: ""
			}).bind("click", function () {
				// для соответствующего блока превью добавляем в попап галерею
				var current_gallery_preview = $(j_popup_gallery);
				setContent(current_gallery_preview);
				setCurrentPreview(this);
				setBigImage();
				setArrow();
				arrowHandler();
				thubmsHandler();
				setTitle();
                if (first_load) {
                    clickBigImage();
                    first_load = false;
                }
			});
		};

		// обработка при нажатии на стрелочки
		var arrowHandler = function () {
			var arrows = popap_gallery.find(".popup-gallery-prev-next");
			popap_gallery.parents(".js_popup_frame").eq(0).css("verticalAlign", "top");

			arrows.delegate("a", "click", function (e) {
				var menu = $(popap_gallery).find(".j-popup-gallery-thumbs");
				// предыдущая текущая позиция, она сдвигается влево либо вправо
				var preview = menu.children(".j-popup-gallery-thumbs-item-current");
				var currentItem = preview.prevAll().length;
				// если ткнули назад
				if ($(this).hasClass("popup-gallery-prev")) {
					--currentItem;
				} else {
					++currentItem;
				}

				countItem = currentItem;
				// подготовили контекст для стрелочек
				var newCurrentPreview = menu.children().eq(currentItem).addClass("j-popup-gallery-thumbs-item-current");
				setCurrentPreview(newCurrentPreview);
				setBigImage();
				setArrow();

				e.preventDefault();
			});
		};

		// обработка при нажатии на картинки в галерее
		var thubmsHandler = function () {
			var thumbs = popap_gallery.find(".j-popup-gallery-thumbs");
			thumbs.delegate("a", "click", function (e) {
				countItem = $(this).parents(".j-popup-gallery-thumbs-item").prevAll().length;
				var newCurrentPreview = $(this).parents(".j-popup-gallery-thumbs").children().eq(countItem);
				// подготовил контекст для картинок в галерее
				setCurrentPreview(newCurrentPreview);
				setBigImage();
				setArrow();
				e.preventDefault();
			});
		};

        // обработка при нажатии на большую картинку
        var clickBigImage = function () {
            popap_gallery.find(".j-popup-gallery-image-view img").live('click', function (e) {
                var current = popap_gallery.find(".j-popup-gallery-thumbs-item-current");
                countItem = current.prevAll().length + 1;
                current.removeClass('j-popup-gallery-thumbs-item-current');
                if (countItem == popap_gallery.find(".j-popup-gallery-thumbs-item").length) {
                    countItem = 0;
                }
                console.log(countItem);
                var newCurrentPreview = popap_gallery.find(".j-popup-gallery-thumbs").children().eq(countItem);
				// подготовил контекст для картинок в галерее
				setCurrentPreview(newCurrentPreview);
				setBigImage();
				setArrow();
				e.preventDefault();
            });
        };

		// ниже методы по обработке запроса на изменение состояния галереи

		// устанавливаем галерею в попап
		// currentPreview - элемент с классом j-popup-gallery - содержимое которого содержится в галерее
		var setContent = function (currentPreview) {
			var currentPhotoblock = currentPreview.html();
			$(".js_popup_content").html(currentPhotoblock);
			if (o.addHtml) {
				// чтобы использовать этот функционал, необходимо подключить docwrite jQuery plugin v1.2.0
		        $(document).bind('beforedocwrite', function (event, data) {
		            data.target = $('.js_popup_content');
		        });
		        document.write(o.addHtml); // execute script
	    	}
			// для удобства доступа к галерее внутри попапа
			popap_gallery = $(".js_popup .popup-gallery");
		};

		// устанавливаем текущий пункт меню
		// currentItem - картинка в превью галереи, при клике на нее открывается попап
		var setCurrentPreview = function (currentItem) {
			if ($(currentItem).hasClass(o.itemClass))
			{
				index = $(currentItem).attr("index");
				currentItem = popap_gallery.find(".j-popup-gallery-thumbs").children().eq(index);
			}
			var menuItem = popap_gallery.find(".j-popup-gallery-thumbs");

			// центрируем картинки превью
			var countChildrens = menuItem.children().length;
			var real_width = 85 * countChildrens;
			var max_width = parseInt(menuItem.css("width"));
			var offset_left = parseInt((max_width - real_width)/2);
			if (countChildrens < 8) {
				menuItem.css("marginLeft", offset_left);
			}
			// если уже выбирали пункт меню
			if (countItem !== undefined) {
				menuItem.children(".j-popup-gallery-thumbs-item").removeClass("j-popup-gallery-thumbs-item-current");
			}
			// номер превьюшки
			countItem = $(currentItem).prevAll().length;
			menuItem.children(".j-popup-gallery-thumbs-item").eq(countItem).addClass("j-popup-gallery-thumbs-item-current");
			countElements = menuItem.children(".j-popup-gallery-thumbs-item").length;
		};

		// ставим большую фотку
		var setBigImage = function () {
			var images = popap_gallery.find(".j-popup-gallery-images");
			var newSrc = images.children("a").eq(countItem).attr("href");
			var image_container = popap_gallery.find(".j-popup-gallery-image-view");
			var hidden_contanier = $(".j-popup-gallery-image-view-hidden");
			var oldheightImage = image_container.children('img').attr("offsetHeight");
			if (oldheightImage) {
				var newimg = $("<img alt='' src='" + newSrc + "' />");
				var clearFinally = 100, i = 1;

				hidden_contanier.html(newimg);
				var clear = setInterval(function () {
					var height = hidden_contanier.children("img").attr("offsetHeight");
					if (height) {
						image_container.css({height: height + "px"});
						image_container.html(newimg);
						clearInterval(clear);
						i = 0;
					}
					// если не можем загрузить картинку
					++i;
					if (i > 100) {
						clearInterval(clear);
					}
				}, 50);
			} else {
				image_container.html("<img alt='' src='" + newSrc + "' />");
			}

		};

		// управляем стрелочками: стрелочка может быть активна либо неактивна
		var setArrow = function () {
			var leafing = popap_gallery.find(".popup-gallery-prev-next");

			// по-умолчанию
			var content_leafing = "<a class='popup-gallery-prev' href='#'>предыдущая</a><a class='popup-gallery-next' href='#'>следующая</a>";
			// ткнули на первую
			if (countItem == 0) {
				content_leafing = "<span class='popup-gallery-prev'>предыдущая</span><a class='popup-gallery-next' href='#'>следующая</a>"
			} else if (countItem == countElements - 1) {	// последнюю
				content_leafing = "<a class='popup-gallery-prev' href='#'>предыдущая</a><span class='popup-gallery-next'>следующая</span>";
			}
			if (countElements == 1) {
				content_leafing = "<span class='popup-gallery-prev'>предыдущая</span><span class='popup-gallery-next'>следующая</span>";
			}
			leafing.html(content_leafing);
		};
		
		var setTitle = function () {
				customPopupTitle = $(obj).attr('popupTitle');
				if(customPopupTitle!=undefined && o.inlineTitle && customPopupTitle.length > 0) {
//					console.log(customPopupTitle);
					popupTitle = customPopupTitle;
					$("." + $.popup.initOptions.classes.title).html(popupTitle);
				}

		};
		
		
	    init();
	};

})(jQuery);

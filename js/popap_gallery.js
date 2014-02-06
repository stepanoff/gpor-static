$(document).ready(function () {
    var gallery = {

		popap_gallery: null,

		// текущий пункт превью (можем узнать индекс, подсветить текущую)
		currentPreview: null,

		countElements: 0,

        renderHTML: function () {
            var j_gallery = $(".j-gallery");
            j_gallery.each(function () {
                var photoblock = $("<div class='j-popup-gallery-photoblock'" + "/>");
                var ul = $(this).find("ul");
                photoblock.append(ul);
                $(this).append(photoblock);
                ul.addClass("j-popup-gallery-preview context");
                ul.children("li").addClass("preview-item");
                ul.children("li").each(function () {
                    var linkHref = $(this).children("a").attr("rel");
                    $(this).css({
                        background: "url(" + linkHref + ") 0 0 no-repeat",
                        display: "none"
                    });
                });

                var j_popup_gallery = $("<div class='j-popup-gallery'" + "/>");
                var popup_gallery = $("<div class='popup-gallery'" + "/>");
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
                var thumbs = popup_gallery.children(".j-popup-gallery-thumbs");
                var images = popup_gallery.children(".j-popup-gallery-images")
                var previewcount = ul.attr("previewcount") || 100;
                ul.children("li").each(function () {
                    var that = this;
                    var thumbs_item = $("<div class='j-popup-gallery-thumbs-item'>"+
                    "<a href='#' style='background: url(" + $(that).children("a").attr("rel") + ") center center no-repeat'></a></div>");
                    thumbs.append(thumbs_item);
                    var images_item = $("<a href=''></a>");
                    images_item.attr("href", $(that).children("a").attr("href"));
                    images.append(images_item);
                    if ($(that).prevAll().length < previewcount) {
                        $(that).css("display", "block");
                    }
                });
            });
        },

		// инициализация галереи, галерея - div-контейнера галереи есть класс j-gallery
		init: function () {
            this.renderHTML();
			this.previewHandler();
		},

		// обработка при нажатии на превью
		previewHandler: function () {
			var that = this;
			var first_load = true;
			// создали попап и навесили его на элементы превью
			$(".j-popup-gallery-preview .preview-item").popup({
				title: "Галерея",
				content: ""
			}).bind("click", function () {
				// для соответствующего блока превью добавляем в попап галерею
				var current_gallery_preview = $(this).parents(".j-popup-gallery-photoblock").next();
				// this - контекст при при раскрытии попапа
				that.setContent(current_gallery_preview);
				that.setCurrentPreview(this);
				that.setBigImage();
				that.setArrow();
				that.arrowHandler();
				that.thubmsHandler();
                if (first_load) {
                    that.clickBigImage();
                    first_load = false;
                }
			});
		},

		// обработка при нажатии на стрелочки
		arrowHandler: function () {
			var arrows = this.popap_gallery.find(".popup-gallery-prev-next");
			this.popap_gallery.parents(".js_popup_frame").eq(0).css("verticalAlign", "top");

			var that = this;
			arrows.delegate("a", "click", function (e) {
				var menu = $(this).parents(".popup-gallery-prev-next").next();
				// предыдущая текущая позиция, она сдвигается влево либо вправо
				var preview = menu.children(".j-popup-gallery-thumbs-item-current");
				var currentItem = preview.prevAll().length;
				// если ткнули назад
				if ($(this).hasClass("popup-gallery-prev")) {
					--currentItem;
				} else {
					++currentItem;
				}

				this.countItem = currentItem;
				// подготовили контекст для стрелочек
				var newCurrentPreview = menu.children().eq(currentItem).addClass("j-popup-gallery-thumbs-item-current");
				that.setCurrentPreview(newCurrentPreview);
				that.setBigImage();
				that.setArrow();

				e.preventDefault();
			});
		},

		// обработка при нажатии на картинки в галерее
		thubmsHandler: function () {
			var that = this;
			var thumbs = this.popap_gallery.find(".j-popup-gallery-thumbs");
			thumbs.delegate("a", "click", function (e) {
				this.countItem = $(this).parents(".j-popup-gallery-thumbs-item").prevAll().length;
				var newCurrentPreview = $(this).parents(".j-popup-gallery-thumbs").children().eq(this.countItem);
				// подготовил контекст для картинок в галерее
				that.setCurrentPreview(newCurrentPreview);
				that.setBigImage();
				that.setArrow();
				e.preventDefault();
			});
		},

        // обработка при нажатии на большую картинку
        clickBigImage: function () {
            var that = this;
            that.popap_gallery.find(".j-popup-gallery-image-view img").live('click', function (e) {
                var current = that.popap_gallery.find(".j-popup-gallery-thumbs-item-current");
                that.countItem = current.prevAll().length + 1;
                current.removeClass('j-popup-gallery-thumbs-item-current');
                if (that.countItem == that.popap_gallery.find(".j-popup-gallery-thumbs-item").length) {
                    that.countItem = 0;
                }
                console.log(that.countItem);
                var newCurrentPreview = that.popap_gallery.find(".j-popup-gallery-thumbs").children().eq(that.countItem);
				// подготовил контекст для картинок в галерее
				that.setCurrentPreview(newCurrentPreview);
				that.setBigImage();
				that.setArrow();
				e.preventDefault();
            });
        },

		// ниже методы по обработке запроса на изменение состояния галереи

		// устанавливаем галерею в попап
		// currentPreview - элемент с классом j-popup-gallery - содержимое которого содержится в галерее
		setContent: function (currentPreview) {
			var currentPhotoblock = currentPreview.html();
			$(".js_popup_content").html(currentPhotoblock);
			// для удобства доступа к галерее внутри попапа
			this.popap_gallery = $(".js_popup .popup-gallery");
		},

		// устанавливаем текущий пункт меню
		// currentItem - картинка в превью галереи, при клике на нее открывается попап
		setCurrentPreview: function (currentItem) {
			var menuItem = this.popap_gallery.find(".j-popup-gallery-thumbs");

			// центрируем картинки превью
			var countChildrens = menuItem.children().length;
			var real_width = 85 * countChildrens;
			var max_width = parseInt(menuItem.css("width"));
			var offset_left = parseInt((max_width - real_width)/2);
			if (countChildrens < 8) {
				menuItem.css("marginLeft", offset_left);
			}
			// если уже выбирали пункт меню
			if (this.countItem !== undefined) {
				menuItem.children(".j-popup-gallery-thumbs-item").eq(this.countItem).removeClass("j-popup-gallery-thumbs-item-current");
			}
			// номер превьюшки
			this.countItem = $(currentItem).prevAll().length;
			menuItem.children(".j-popup-gallery-thumbs-item").eq(this.countItem).addClass("j-popup-gallery-thumbs-item-current");
			this.countElements = menuItem.children(".j-popup-gallery-thumbs-item").length;
		},

		// ставим большую фотку
		setBigImage: function () {
			var images = this.popap_gallery.find(".j-popup-gallery-images");
			var newSrc = images.children("a").eq(this.countItem).attr("href");
			var image_container = this.popap_gallery.find(".j-popup-gallery-image-view");
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

		},

		// управляем стрелочками: стрелочка может быть активна либо неактивна
		setArrow: function () {
			var leafing = this.popap_gallery.find(".popup-gallery-prev-next");

			// по-умолчанию
			var content_leafing = "<a class='popup-gallery-prev' href='#'>предыдущая</a><a class='popup-gallery-next' href='#'>следующая</a>";
			// ткнули на первую
			if (this.countItem == 0) {
				content_leafing = "<span class='popup-gallery-prev'>предыдущая</span><a class='popup-gallery-next' href='#'>следующая</a>"
			} else if (this.countItem == this.countElements - 1) {	// последнюю
				content_leafing = "<a class='popup-gallery-prev' href='#'>предыдущая</a><span class='popup-gallery-next'>следующая</span>";
			}
			if (this.countElements == 1) {
				content_leafing = "<span class='popup-gallery-prev'>предыдущая</span><span class='popup-gallery-next'>следующая</span>";
			}
			leafing.html(content_leafing);
		}
	};

    gallery.init();
});
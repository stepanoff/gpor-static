/*
При клике на ссылку показывает контент урла ссылки в всплывающем окне
Слушает событие contentReplaced
 */
js_show_popup = function(opts){

            var defaults = {
                'popupOptions' : {}, // настройки попапа
                'containerSelector' : '', // селекор для контейнера. Если отсутствует берется вся страница
                'itemSelectors' : '' // селекоры для ссылок, открывающих попап
            };

            var o = $.extend({}, defaults, opts);
            var obj = false;
            if (o.containerSelector)
                var obj = $(o.containerSelector);
            if (!obj)
                obj = $(document);

            var openPopup = function (el) {
                var popupOpts = o.popupOptions;
                popupOpts['content'] = '<div class="js_popup_close js_popup_close_small"></div><iframe style="background-color: #fff;" width="'+o.popupOptions['width']+'" height="'+o.popupOptions['height']+'" src="'+$(el).attr('href')+'"></iframe>';
	            $.popup.show(popupOpts);
            };

            var initUi = function (evt) {
                evt = evt ? evt : false;
                var el = obj;
                if (evt) {
                    var targ = evt['target'] ? evt['target'] : false;
                    if (targ && o.containerSelector) {
                        var containerFound = false;
                        var closestContainer = $(targ).find(o.containerSelector);
                        if (!closestContainer.length)
                            closestContainer = $(targ).parent().find(o.containerSelector);
                        if (closestContainer.length) {
                            containerFound = true;
                            el = closestContainer;
                        }
                        if (!containerFound)
                            return;
                    }
                    else if (!o.containerSelector)
                        el = obj;
                }
                for (i in o.itemSelectors) {
                    $(el).find(o.itemSelectors[i]).unbind('click');
                    $(el).find(o.itemSelectors[i]).bind('click', function(){
                        openPopup($(this));
                        return false;
                    });
                }
            };

            // start
            this.init = function () {
                app.addListener ('contentReplaced', initUi);
            };

            this.initUi = function () {
                initUi();
            };
        };


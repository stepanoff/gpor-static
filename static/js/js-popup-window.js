/*
При клике на ссылку показывает контент урла ссылки в всплывающем окне
Слушает событие contentReplaced
 */
js_popup_window = function(opts){

            var defaults = {
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
	            window.open(el.attr('href'), '', 'width=992,height=735,resizable=0,resize=0,scrollbars=no');
//	            $.popup.show({
//		            content:'<iframe width="800" height="600" src="'+$(el).attr('href')+'"></iframe>',
//		            title:'Бронирование билета'
//	            });
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


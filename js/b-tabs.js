/*
Скрипт переключения табов
todo: сделать опциональную подгрузку контента табов ajax'ом
 */
b_tabs = function(opts){

            var defaults = {
                'containerSelector' : '',

                'tabContainerClass' : '',
                'tabClass' : '',
                'tabActiveClass' : '',
                'tabContentContainerClass' : '',
                'tabContentClass' : '',
                'tabContentActiveClass' : '',
                'tabLinkClass' : '',
                'changeUrl' : true,
                'regUrlBegin' : false,
                'regUrlValue' : false
            };

            var o = $.extend({}, defaults, opts);
            var obj = false;
            if (o.containerSelector)
                obj = $(o.containerSelector);
            var tabs= obj.find("."+o.tabClass);
            var texts = obj.find("."+o.tabContentClass);

            /**
             * Обработчик изменения урла при нажатии на кнопках "вперед/назад" в браузере
             */
            var onUrlChanged = function (evt) {
                var url = evt.url;

                if(typeof url == 'undefined')
                    url = $.url();

                var res = url.attr('source').match( o.regUrlBegin.source + "(" + o.regUrlValue.source + ")" );
                var el = false;

                if (res && res[1])
                    el = obj.find("."+o.tabLinkClass+'[rel="'+res[1]+'"]');
                else
                    el = obj.find("."+o.tabLinkClass).filter(":first");

                toggleTab(el, false);
            };

            var toggleTab = function (el, changeUrl) {
                changeUrl = changeUrl ? changeUrl : false;
                var tab = el.closest("."+o.tabClass);
                if (tab.hasClass(o.tabActiveClass))
                    return false;
                tabs.removeClass(o.tabActiveClass);
                texts.removeClass(o.tabContentActiveClass).hide();

                tab.addClass(o.tabActiveClass);
                var rel = el.attr("rel");
                var val = el.attr("href");
                obj.find("."+o.tabContentClass+'[rel="'+rel+'"]').addClass(o.tabContentActiveClass).show();

                if (o.changeUrl && changeUrl) {
                    app.ajax.setHistory(null, '', val);
                }
            }


            if (o.changeUrl)
                app.addListener ('urlChanged', onUrlChanged);

            // start
            this.init = function () {
                texts.hide();
                obj.find("."+o.tabContentActiveClass).show();
            }

            obj.delegate("."+o.tabLinkClass, 'click', function() {
                    var el = $(this);
                    toggleTab(el, true);
                    return false;
                });

            this.initUi = function () {

            }
        };
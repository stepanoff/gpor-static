b_grey_menu_selectors__container = function(opts){

            var defaults = {
                'containerSelector' : 'b-events-list-cards',
                'activeClass' : 'b-events-list-cards__col__item',
                'itemClass' : 'b-events-list-cards__col__item_type_green',
                'pageDataContext' : '',
                'type' : 'filter', // filter or reloadPage
                'fireEvent' : 'filter', // event name to be fired when filter type used
                'regUrlBegin' : /\/tags\//,
                'regUrlValue' : /\d+/
            };

            var o = $.extend({}, defaults, opts);
            var obj = $(o.containerSelector);
            var items = false;

            // tag from url for working back-button in browser
            var urlTag = false;

            var afterReloadPage = function (event) {
                // todo: redraw elements
            }

            var reloadPage = function (el, enableHistory) {
                if (enableHistory==undefined)
                    enableHistory = true;
                app.ajax.ajaxPage(el.attr("href"), enableHistory);
            }

            var toggleTab = function (el, enableHistory) {
                var elContainer = el.closest("."+o.itemClass);
                if (elContainer.hasClass(o.activeClass))
                    return false;

                items.removeClass(o.activeClass);
                elContainer.addClass(o.activeClass);
                if (o.type == 'reloadPage') {
                    reloadPage(el, enableHistory);
                }
                else if (o.type == 'filter') {
                    app.fire({'type' : o.fireEvent, 'value' : el.attr("rel")});
                }
                return false;
            }

            /**
             * Обработчик изменения урла при нажатии на кнопках "вперед/назад" в браузере
             */
            var onUrlChanged = function (evt) {
                var url = evt.url;
                var res = url.attr('source').match( o.regUrlBegin.source + "(" + o.regUrlValue.source + ")" );
                var v = false;
                if (res && res[1])
                    v = res[1];

                // Если сменился тег в урле, то перемещаемся на предыдущий или на 0
	            if (v !== urlTag || (v === false && urlTag === false)) {
                    var tagId = v? v : 0;
                    urlTag = v;

                    var tagsLink = $("."+o.itemClass+" a[rel]");
                    for (i=0; i<tagsLink.length; i++) {
                        if (tagId==$(tagsLink[i]).attr('rel')) {
                            toggleTab($(tagsLink[i]), false);
                            break;
                        }
                    }
                }
            }

            // start
            this.init = function () {
                app.addListener ('pageReloaded', afterReloadPage);
                app.addListener ('urlChanged', onUrlChanged);
                items = obj.find("."+o.itemClass);
                obj.delegate("."+o.itemClass+" a", 'click', function(){
                    toggleTab ($(this));
                    return false;
                });

            }

            this.initUi = function () {

            }
        };
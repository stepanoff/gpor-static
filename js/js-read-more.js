/*
При клике на ссылку показывает расписание сеансов
Слушает событие contentReplaced
 */
js_read_more = function(opts){

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
                        if ($(this).hasClass('b-read-more__control__label_layout_closed')) {
                            $(this).closest(".b-read-more").find(".b-read-more__text").show();
                            $(this).closest(".b-read-more__control").removeClass("b-read-more__control_state_close").addClass("b-read-more__control_state_open");
                            return false;
                        }
                        if ($(this).hasClass('b-read-more__control__label_layout_opened')) {
                            $(this).closest(".b-read-more").find(".b-read-more__text").hide();
                          	$(this).closest(".b-read-more__control").removeClass("b-read-more__control_state_open").addClass("b-read-more__control_state_close");
                            return false;
                        }
                        if ($(this).hasClass('b-read-more__control__label_layout_innactive')) {
                            return false;
                        }
                    });
                }
            }

            // start
            this.init = function () {
                app.addListener ('contentReplaced', initUi);
            }

            this.initUi = function () {
                initUi();
            }
        };


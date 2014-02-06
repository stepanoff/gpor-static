/*
При ховере на элементы hoverSelectors показывает кнопку play на элементе buttonContainer
Слушает событие contentReplaced
 */
js_effect_play_button = function(opts){

            var defaults = {
                'containerSelector' : '', // селекор для контейнера. Если отсутствует берется вся страница
                'itemSelector' : '', // селекор контейнера, внутри которого располагаются hoverSelectors
                'hoverSelectors' : '', // селекоры эелементов, при наведении на которые появляется изображение кнопки
                'buttonSelector' : '', // контейнер, в который нужно положить кнопку play
                'buttonContentContainer' : '', // контейнер, в котором изначально  содержится кнопка play
                'shadowClass' : '', // класс слоя с тенью
                'activeClass' : '' // класс, который делает кнопку видимой
            };

            var o = $.extend({}, defaults, opts);
            var obj = false;
            if (o.containerSelector)
                var obj = $(o.containerSelector);
            if (!obj)
                obj = $(document);

            var butContent = $(o.buttonContentContainer).html();
            var showing = false;
            var hiding = false;

            var showButton = function (el) {
                var par = $(el).closest(o.itemSelector);
                var butContainer = par.find(o.buttonSelector);
                butContainer.addClass(o.activeClass);
                showing = true;
                if (hiding) {
                    butContainer.find("."+o.shadowClass).stop();
                    hiding = false;
                }
                butContainer.find("."+o.shadowClass).animate({'opacity' : '0.5'}, 200, function(){
                    showing = false;
                });
            }

            var hideButton = function (el) {
                var par = $(el).closest(o.itemSelector);
        		var butContainer = par.find(o.buttonSelector);
                hiding = true;
                if (showing) {
                    butContainer.find("."+o.shadowClass).stop();
                    showing = false;
                }
                butContainer.find("."+o.shadowClass).animate({'opacity' : '0'}, 200, function(){
                    butContainer.removeClass(o.activeClass);
                    hiding = false;
                });
            }

            var initUi = function (evt) {
                evt = evt ? evt : false;
                var el = obj;
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

                $(el).find(o.buttonSelector).css('position', 'relative');
                $(el).find(o.buttonSelector).append(butContent);

                for (i in o.hoverSelectors) {
                    $(el).find(o.hoverSelectors[i]).unbind('mouseover');
                    $(el).find(o.hoverSelectors[i]).unbind('mouseout');
                    $(el).find(o.hoverSelectors[i]).bind('mouseover', function(){
                        showButton($(this));
                        return false;
                    });
                    $(el).find(o.hoverSelectors[i]).bind('mouseout', function(){
                        hideButton($(this));
                        return false;
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


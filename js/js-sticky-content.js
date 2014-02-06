js_sticky_content = function(opts){

            var defaults = {
                'itemSelector' : 'b-events-list-cards', // селектор элементов для залипания
                'containerSelector' : 'b-events-list-cards__col__item', // контейнер, в котором находятся залипающие элементы
                'targetSelector' : 'b-events-list-cards__col__item', // относительно какого элемента будут залипать указанные элемент
                'topPadding' : '10', // отступ сверху
                'stickyBoxClass' : 'stickyBox'  // класс, который навешивается на элемент при залипании
            };

            var o = $.extend({}, defaults, opts);
            var obj = $(o.targetSelector);

            var container = $("body");
            if (o.containerSelector)
                container = $(o.containerSelector);
            var items = container.find(o.itemSelector);

            var div = $("<div>");
            div.addClass(o.stickyBoxClass);
            obj.after(div);
            var stickyBox = obj.parent().find("."+o.stickyBoxClass);
            stickyBox.css("position", "fixed");
            stickyBox.hide();

            var checkStick = function () {
                if (stickyBox.hasClass('initalizing'))
                    return;
                var positionScreen = jQuery(window).scrollTop();
                var rightBlockHeight = obj.height() + obj.offset().top;

                if (rightBlockHeight < positionScreen) {
                    // перемещаем контент в зону для залипания
                    if (!stickyBox.hasClass("copied")) {
                        items.clone().show().appendTo(stickyBox);
                        stickyBox.addClass("copied");
                    }

                    // выравниваем зону залипания
                    if(!stickyBox.hasClass('sticked')) {
                        stickyBox.css("left", obj.parent().offset().left + "px");
                        stickyBox.css("width", obj.parent().width() + "px");
                    }
                    // показываем анимацию в первый раз, или просто залипалку
                    if (!stickyBox.hasClass("initialized")) {
                        stickyBox.addClass('sticked');
                        stickyBox.addClass('initalizing').css("top", "-200px");
                        stickyBox.show();
                        stickyBox.animate({top: o.topPadding}, 300, function(){
                            stickyBox.removeClass('initalizing')
                            stickyBox.addClass("initialized");
                        });
                    } else if (!stickyBox.hasClass('sticked')) {
                        stickyBox.addClass('sticked');
                        stickyBox.css('top',o.topPadding);
                        stickyBox.show();
                    }

                } else {
                    stickyBox.removeClass('sticked');

                    if (stickyBox.hasClass("copied")) {
                        stickyBox.hide();
                        items.show();
                    }
                }
            }

            // start
            this.init = function () {
                checkStick();
                $(window).resize(function() {
                    stickyBox.removeClass('sticked');
                    checkStick();
                });

                $(window).scroll(function() {
                    stickyBox.removeClass('sticked');
                    checkStick();
                });
            }

            this.initUi = function () {

            }
        };
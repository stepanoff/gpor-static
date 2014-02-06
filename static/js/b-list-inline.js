/*
фикс ширины элементов списка в зависимости от разрешения экрана
 */
b_list_inline = function(opts){

            var defaults = {
                'containerClass' : '',
                'itemClass' : '',
                'maxColItems' : 5 // максимальное число элементов в колонке
            };

            var o = $.extend({}, defaults, opts);
            var obj = $("."+o.containerClass);
            var container = obj;

            var items = false;
            var maxColItems = o.maxColItems;

            var itemsFixWidth = function () {
                var containerWidth = $(container).width();
                var itemWidth = 1;
                if (!containerWidth) {
                    containerWidth = $(container).parent().width();
                }
                if (containerWidth < 800) {
                    itemWidth = ((containerWidth - 10) / (maxColItems - 1)) - 10;
                } else {
                    itemWidth = ((containerWidth - 10) / (maxColItems)) - 10;
                }
                obj.find("."+o.itemClass).css({"width": itemWidth + "px"});
            }

            var init = function (opts) {
                opts = opts ? opts : o;

                itemsFixWidth();
            }

            items = $(container).find("."+o.itemClass);

            $(window).resize(function(){
                itemsFixWidth();
            });

            // init
            this.init = function (opts) {
                init(opts);
            }

            this.initUi = function () {

            }
        };
js_adapted = function(opts){

            var defaults = {
                'containerSelector' : ''
            };
			
            var o = $.extend({}, defaults, opts);
            var obj = $(o.containerSelector);
			var blockClass = o.blockClass;
			var screenWidth = $(window).width();
			var bClassName = "";
			
			function getScreenWidthClass(screenWidth, blockClass) {
				screenWidth = $(window).width();

				if (screenWidth <= 1024) {
                    bClassName = blockClass + "_adapted_w1024";
                }
                else if ((screenWidth > 1024) && (screenWidth <= 1152)) {
                    bClassName = blockClass + "_adapted_w1152";
                } else if ((screenWidth > 1152) && (screenWidth <= 1280)) {
                    bClassName = blockClass + "_adapted_w1280";
                } else {
                    if (screenWidth > 1280) bClassName = blockClass + "_adapted_wMax";
                }
				obj.removeClass(blockClass + "_adapted_w1024").removeClass(blockClass + "_adapted_w1152").removeClass(blockClass + "_adapted_w1280").removeClass(blockClass + "_adapted_wMax").addClass(bClassName);
			}

            this.init = function () {
				getScreenWidthClass(screenWidth, blockClass);
            }

            this.initUi = function () {
            }

			$(window).resize(function() {
				getScreenWidthClass(screenWidth, blockClass);
			});
			
}

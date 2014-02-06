$(document).ready(function() {
	//$(".b-dropdown").leftFixedToGrid();
	
});


$(window).resize(function() {
	//$(".b-dropdown").leftFixedToGrid();
});



b_dropdown = function(opts){

            var defaults = {
                'containerSelector' : '.b-dropdown',
                'currentItemClass' : 'b-dropdown__current-link',
                'datesContainerClass' : 'b-dropdown__bubble',
                'inactiveItemClass' : 'b-dropdown__bubble__item_state_inactive',
                'pageDataContext' : '',
                'fireEvent' : 'reloadPage' // event name fired when new date chosen
            };

            var o = $.extend({}, defaults, opts);
            var obj = $(o.containerSelector);
            var bubble = obj.find("."+o.datesContainerClass);
            var currentItem = obj.find("."+o.currentItemClass);

            var afterReloadPage = function (event) {
                // todo: redraw elements
            }

            var reloadPage = function (el) {
                app.ajax.ajaxPage(el.attr("href"));
            }

            // start
            this.init = function () {
                app.addListener ('pageReloaded', afterReloadPage);
                obj.delegate("."+o.currentItemClass, 'mouseover', function(e){
				
                    e.preventDefault();
                    e.stopPropagation();

                    var dropWidth = $(this).width();
                    bubble.css("left", $(this).position().left -14 + "px");
                    bubble.find("ul").css("width", dropWidth - 1 + "px");
                    bubble.css("visibility", "visible");
                });
                obj.delegate("."+o.currentItemClass, 'mouseout', function(e){
                    if (!$(e.relatedTarget).closest("."+o.datesContainerClass).eq(0).length) {
                        bubble.css("visibility", "hidden");
                    }
                });
                obj.delegate("."+o.datesContainerClass, 'mouseout', function(e){
                    if (!$(e.relatedTarget).closest("."+o.datesContainerClass).eq(0).length) {
                        bubble.css("visibility", "hidden");
                    }
                });
                bubble.delegate("a", 'click', function(){
                    randDate = new Date($(this).attr("rel"));
                    curDate = new Date(currentItem.attr("rel"));
					insToggle = '<ins class="b-dropdown__current-link__drop"></ins>';
                    plashkaText = $(this).find("ins").html();
                    currentItem.find("span").html(plashkaText + insToggle);
                    bubble.css("visibility", "hidden");

                    if (o.fireEvent == 'reloadPage') {
                        reloadPage($(this));
                    }
                    else {
                        app.fire({'type' : o.fireEvent, 'value' : $(this).attr("rel")});
                    }
                    return false;
                });

            }

            this.initUi = function () {

            }
        };


$(document).ready(function() {
	jQuery.fn.leftFixedToGrid = function(options){
		var options = jQuery.extend({
			left: 0
		});
		return this.each(function() {
			var leftPositionScreen = jQuery(".page-col-1-span-15").offset().left;
			leftPaddingVal = leftPositionScreen/100;
			if ($(".b-afisha-date-select-fixed-box").css("display") == "block") {
				jQuery(this).css("left", leftPaddingVal + leftPositionScreen + options.left*1 + 10 + "px");
			} else {
				jQuery(this).css("left", "auto");
			}
		});
	};
	$(".b-afisha-date-select").leftFixedToGrid();
});


$(window).resize(function() {
	$(".b-afisha-date-select").leftFixedToGrid();
});



b_afisha_date_select = function(opts){

            var defaults = {
                'containerSelector' : '.b-afisha-date-select',
                'currentItemClass' : 'b-afisha-date-select__current-link',
                'currentDayClass' : 'b-afisha-date-select__time',
                'datesContainerClass' : 'b-afisha-date-select__bubble',
                'inactiveItemClass' : 'b-afisha-date-select__bubble__item_state_inactive',
                'pageDataContext' : '',
                'fireEvent' : 'reloadPage', // event name fired when new date chosen
                'regUrlBegin' : /.*?/,
                'regUrlValue' : /\d{2}-\d{2}-\d{4}/
            };

            // date from url for working back-button in browser
            var urlDate = false;

            var o = $.extend({}, defaults, opts);
            var obj = $(o.containerSelector);
            var bubble = obj.find("."+o.datesContainerClass);
            var currentItem = obj.find("."+o.currentItemClass);

            var afterReloadPage = function (event) {
                $('.'+o.currentDayClass).find('.b-afisha-date-select__time__value').html(event.result.dateSelect.time);
            }

            var reloadPage = function (el, enableHistory) {
                if (enableHistory==undefined)
                    enableHistory = true;
                app.ajax.ajaxPage(el.attr("href"), enableHistory);
            };

            var changeText = function(el) {
                plashkaText = el.find("ins").text();
                currentItem.find("span").html(plashkaText);
                bubble.css("visibility", "hidden");
            };

            /**
             * Обработчик изменения урла при нажатии на кнопках "вперед/назад" в браузере
             */
            var onUrlChanged = function (evt) {
                var url = evt.url;
                var res = url.attr('source').match( o.regUrlBegin.source + "(" + o.regUrlValue.source + ")" );
                var v = false;
                if (res && res[1])
                    v = res[1];
                // Если сменилась дата в урле, то перемещаемся на предыдущую дату или на стартовый день
                if (v !== urlDate || (v === false && urlDate === false))
                {
                    // Перебираем все даты из выбиралки, проверяем в их HREF наличие нашей даты
                    var tagsLink = bubble.find('a');
                    var el = false;
                    for (i=0; i<tagsLink.length; i++)
                    {
                        // Запоминаем первый элемент, если совпадение дат не будет найдено, будем использовать его
                        if (i==0)
                            el = $(tagsLink[i]);

                        // Выдираем дату из href
                        dateLinkArr = $(tagsLink[i]).attr('href').match( o.regUrlBegin.source + "(" + o.regUrlValue.source + ")" );

                        // Если нашли дату в списке и она совпадает с нашей, то грузим эту страницу
                        if (dateLinkArr && dateLinkArr[1] && dateLinkArr[1]==v) {
                            el = $(tagsLink[i]);
                            break;
                        }
                    }
                    if (el) {
                        changeText(el);
                        reloadPage(el, false);
                    }
                    urlDate = v;
                }
            };

            // start
            this.init = function () {
                app.addListener ('pageReloaded', afterReloadPage);
                
                // Только для ajax выставляем обработчик смены урла
                if (o.fireEvent == 'reloadPage')
                    app.addListener ('urlChanged', onUrlChanged);

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
                bubble.delegate("a", 'click', function() {
                    changeText($(this));
                    // Перегружаем страницу либо по ajax либо целиком (для афиши телепрограмм)
                    if (!o.fireEvent)
                        return true;

                    if (o.fireEvent == 'reloadPage')
                        reloadPage($(this));
                    else
                        app.fire({'type' : o.fireEvent, 'value' : $(this).attr("rel")});
                    return false;
                });

            };

            this.initUi = function () {

            };
        };


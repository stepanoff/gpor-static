/*
Отрисовывает список каналов,
обрабатывает события 
 */
b_afisha_channels_grid_filter = function(opts){

            var defaults = {
                'containerClass' : 'b-afisha-channels-grid',
                'itemsContainerClass' : 'b-afisha-channels-grid__pad',
                'progItemClass' : 'b-afisha-channels-grid__card__item',
                'inactiveClass' : 'b-afisha-channels-grid__card__item_time_past',
                'progCaptionClass' : 'b-afisha-channels-grid__card__item__caption',
                'progActiveClass' : 'b-afisha-channels-grid__card__item_state_opened',
                'channelTemplate' : false,
                'pageDataContext' : {}
            };

            var o = $.extend({}, defaults, opts);
            var obj = false;
            var dayType = false;
            var progType = false;

            if (o.containerClass)
                var obj = $("."+o.containerClass);
            var items = obj.find("."+o.progItemClass);
            var itemsContainer = obj.find("."+o.itemsContainerClass);

            var obtainAjaxData = function (evt) {
                progType = false;
                dayType = false;

                app.renderTemplate(o.channelTemplate, itemsContainer, {
                    'context' : o.pageDataContext,
                    'data' : evt['result'] ? evt['result'] : false,
                    'list' : true
                });

                items = obj.find("."+o.progItemClass);
            }

            var filterProgType = function (evt) {
                var value = typeof evt == "string" ? evt : evt['value'];
                progType = value;
                if (value) {
                    items.hide();
                    obj.find('.'+o.progItemClass+'[rel="'+value+'"]').show();
                }
                else {
                    items.show();
                }

                if (dayType) {
                    obj.find('.'+o.inactiveClass).hide();
                }
            };

            var filterDayType = function (evt) {
                var value = typeof evt == "string" ? evt : evt['value'];
                dayType = value;
                if (value) {
                    obj.find('.'+o.inactiveClass).hide();
                }
                else {
                    if (progType)
                        obj.find('.'+o.progItemClass+'[rel="'+progType+'"]').show();
                    else
                        obj.find('.'+o.inactiveClass).show();
                }
            }


            // start
            this.init = function () {
                progType = false;
                dayType = false;

                //app.addListener ('pageReloaded', obtainAjaxData);
                app.addListener ('filterProgType', filterProgType);
                app.addListener ('filterDayType', filterDayType);
                app.addListener ('pageReloaded', obtainAjaxData);

                obj.delegate("."+o.progItemClass+" a", 'click', function(){
                    var parent = $(this).closest("dl");
                    var cap = parent.find("."+o.progCaptionClass);
                    if (parent.hasClass(o.progActiveClass)) {
                        cap.hide();
                        parent.removeClass(o.progActiveClass);
                    } else {
                        cap.show();
                        parent.addClass(o.progActiveClass);
                    }
                    return false;
                });
            }

            this.initUi = function () {

            }
        };


b_afisha_time_line = function(opts){

            var defaults = {
                'containerSelector' : '',
                'linkClass' : '',
                'itemContainerClass' : '',
                'eventTemplate' : '',
                'eventItemsContext' : '',
                'fireEvent' : 'dateChanged',
	            'regUrlBegin' : /.*?\/afisha\/event\//,
	            'regUrlValue' : /\d{2}-\d{2}-\d{4}/
            };

            var o = $.extend({}, defaults, opts);
            var obj = false;

            if (o.containerSelector)
                var obj = $(o.containerSelector);

            var itemsContainer = obj.find("."+o.itemContainerClass);

            var obtainAjaxData = function (evt) {
                var result = evt['result'] ? evt['result'] : false;
                if (result && result['timeline']['visible'])
                    obj.show();
                else
                    obj.hide();
                
                itemsContainer.html('');

                app.renderTemplate (o.eventTemplate, itemsContainer, {
                    'context' : o.eventItemsContext,
                    'data' : result,
                    'insertType' : 'append',
                    'list' : true
                });
                app.effect.ajaxReloadingEnd(itemsContainer);
            }

            var beforePageReloaded  = function (evt) {
                app.effect.ajaxReloadingStart(itemsContainer);
            }

            var init = function (data) {
                obj.delegate("."+o.linkClass, 'click', function(){
	                var date = $(this).attr('rel');
	                app.url.changePart( app.date.timestampToDate(date), o.regUrlBegin, o.regUrlValue );
	                app.fire({'type' : o.fireEvent, 'value' : date});
                    return false;
                });
            }

            app.addListener ('beforePageReloaded', beforePageReloaded);
            app.addListener ('pageReloaded', obtainAjaxData);

            // start
            this.init = function () {
                init();
            }

            this.initUi = function () {

            }
        };


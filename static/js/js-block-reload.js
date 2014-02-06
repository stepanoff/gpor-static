/*
Слушать события перезагрузки контента страницы.
Отрисовывает заново контент блока
 */
js_block_reload = function(opts){

            var defaults = {
                'containerSelector' : '',
                'template' : false, // ф-ция, возвращает контент блока
                'reconstructionClass' : '',
                'pageDataContext' : {},
                'effect' : 'ajaxReloading' // ajaxReloading, slideInLeft, slideInRight, slideOutLeft, slideOutRight
            };

            var o = $.extend({}, defaults, opts);
            var obj = false;
            var effect = o.effect ? o.effect : 'ajaxReloading';
            if (o.containerSelector)
                var obj = $(o.containerSelector);

            var obtainAjaxData = function (evt) {
                if (effect == 'ajaxReloading') {
                    obj = app.renderTemplate(o.template, obj, {
                        'context' : o.pageDataContext,
                        'data' : evt['result'] ? evt['result'] : false
                    });
                    obj = $(o.containerSelector);
                    app.effect[effect](obj, 'end');
                }
                else {
                    var div = $("<div>");
                    var oldObj = obj;
                    obj = app.renderTemplate(o.template, div, {
                        'context' : o.pageDataContext,
                        'data' : evt['result'] ? evt['result'] : false
                    });
                    var parObj = oldObj.parent().parent();
                    app.effect['slideIn'](obj, parObj, {
                        'create' : true,
                        'callback' : function (newObj) { oldObj.remove(); obj = $(o.containerSelector); }
                    });
                    app.effect['ajaxReloading'](oldObj, 'end', {
                        'speed' : 1
                    });

                }

            }

            var beforePageReloaded  = function (evt) {
                if (effect == 'ajaxReloading') {
                    app.effect[effect](obj, 'start');
                }
                else {
                    app.effect['ajaxReloading'](obj, 'start');
                }
            }

            // start
            this.init = function () {
                app.addListener ('pageReloaded', obtainAjaxData);
                app.addListener ('beforePageReloaded', beforePageReloaded);
            }

            this.initUi = function () {

            }
        };


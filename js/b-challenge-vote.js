/*
Скрипт для голосования в фотоконкурсе.
Слушает событияе pageReloaded и заменяет фотографии для голосования
Вызывает ajaxPage при клике на кнопку "Голосовать"
todo: обрабатывать действие "Назад" в браузере
 */
b_challenge_vote = function(opts){

            var defaults = {
                'containerSelector' : false,
                'leftCardContext' : [],
                'rightCardContext' : [],

                'leftContainerClass' : '',
                'rightContainerClass' : '',
                'cardContainerClass' : '',
                'cardLinkSelector' : '',
                'shadowClass' : '',
                'itemClass' : '',
                'itemShadowClass' : '',

                'leftCardTemplate' : false,
                'rightCardTemplate' : false
            };

            var o = $.extend({}, defaults, opts);
            var obj = false;
            var items = false;
            if (o.containerSelector)
                obj = $(o.containerSelector);
            var leftContainer = obj.find("."+o.leftContainerClass);
            var rightContainer = obj.find("."+o.rightContainerClass);
            var choosen;
            var reloading = false;

            var obtainAjaxData = function (evt) {
                removeHover();

                var leftDiv = $("<div>");
                var oldLeftObj = leftContainer.find("."+o.itemClass);
                var leftObj = app.renderTemplate(o.leftCardTemplate, leftDiv, {
                    'context' : o.leftCardContext,
                    'data' : evt['result'] ? evt['result'] : false
                });

                var rightDiv = $("<div>");
                var oldRightObj = rightContainer.find("."+o.itemClass);
                var rightObj = app.renderTemplate(o.rightCardTemplate, rightDiv, {
                    'context' : o.rightCardContext,
                    'data' : evt['result'] ? evt['result'] : false
                });

                app.effect['slideIn'](leftObj, leftContainer, {
                    'create' : true,
                    'callback' : function (newObj) { oldLeftObj.remove(); }
                });
                app.effect['ajaxReloading'](oldLeftObj, 'end', {
                    'speed' : 1
                });

                app.effect['slideIn'](rightObj, rightContainer, {
                    'create' : true,
                    'direction' : 'right',
                    'callback' : function (newObj) { oldRightObj.remove(); reloading = false; }
                });
                app.effect['ajaxReloading'](oldRightObj, 'end', {
                    'speed' : 1
                });

            }

            var beforePageReloaded  = function (evt) {
                for (i=0; i<items.length; i++) {
                    app.effect.ajaxReloading(items.eq(i).find("."+o.itemClass), 'start');
                }
            }

            var makeHover = function (el, callback) {
                var otherItems = el.closest("."+o.cardContainerClass).siblings("."+o.cardContainerClass);
                var curItem = el.closest("."+o.cardContainerClass);
                var _callback = callback ? callback : false;
                shadow.stop().animate({"opacity" : "0.3"}, 400);
                otherItems.find("."+o.itemShadowClass).show().stop().animate({"opacity": "0.3"}, 400, function(){
                    choosen = true;
                    if(_callback)
                        _callback();
                });
                curItem.find("."+o.itemShadowClass).stop().animate({"opacity": "0.0"}, 400, function(){
                    curItem.find("."+o.itemShadowClass).hide();
                });
            }

            var removeHover = function (el) {
                shadow.stop().animate({"opacity" : "0"}, 400);
                el = el ? el : false;

                items.find("."+o.itemShadowClass).stop().animate({"opacity": "0"}, 400, function(){
                    choosen = false;
                    items.find("."+o.itemShadowClass).hide();
                });
            }

            // start
            this.init = function () {
                app.addListener ('pageReloaded', obtainAjaxData);
                app.addListener ('beforePageReloaded', beforePageReloaded);
                items = obj.find("."+o.cardContainerClass);
            }

            var shadow = obj.find("."+o.shadowClass);

            obj.delegate(o.cardLinkSelector, 'mouseover', function() {
                    if (reloading)
                        return false;
                    makeHover($(this));
                });
            obj.delegate(o.cardLinkSelector, 'mouseout', function() {
                    if (reloading)
                        return false;
                    removeHover($(this));
                }
            );

            obj.delegate(o.cardLinkSelector, 'click', function() {
                if (reloading)
                    return false;
                reloading = true;
                if (!choosen) {
                    var _el = $(this);
                    makeHover($(this), function(){
                        app.ajax.ajaxPage(_el.attr("href"), false);
                    });
                }
                else {
                    app.ajax.ajaxPage($(this).attr("href"), false);
                }
                return false;
            });

            this.initUi = function () {

            }
        };

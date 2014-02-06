/*
Виджет с подпиской
 */
b_subscriber = function(opts){

            var defaults = {
                'containerSelector' : false,

                'moreSubscribesContext' : [],
                'moreSubscribesSuccessContext' : [],
                'successContext' : [],
                'errorContext' : [],

                'contentSelector' : '', // селектор контейнера под заголовком. Где располанаются инпуты и сабмиты
                'formRowSelector' : '', // селектор строки формы
                'submitBtnSelector' : '', // селектор кнопки абмита формы
                'submitBtnDisableClass' : '', // класс неактивной кнопки
                'errorContainerClass' : '', // класс контейнера ошибки
                'errorTextSelector' : '', // селектор тега, внутри которого лежит текст ошибки
                
                'moreLinkClass' : '', // класс ссылки, которая разворачивает контент с дополнительными подписками
                'moreLinkClassClosed' : '', // класс ссылки, когда разворачиваемый ею контент скрыт
                'moreLinkClassOpened' : '', // класс ссылки, когда разворачиваемый ею контент открыт
                'moreLinkText' : '', // текст ссылки, когда разворачиваемый ею контент скрыт
                'moreLinkOpenedText' : '', // текст ссылки, когда разворачиваемый ею контент открыт

                'successTemplate' : false,
                'moreSubscribesTemplate' : false,
                'moreSubscribesSuccessTemplate' : false
            };

            var o = $.extend({}, defaults, opts);
            var obj = false;

            if (o.containerSelector)
                obj = $(o.containerSelector);
            var formObj = obj.find("form");
            var contentObj = obj.find(o.contentSelector);
            var div = $("<div>");
            div.addClass("tmp");
            contentObj.wrap(div);
            contentObj = contentObj.parent();

            var moreSubscribesObj = false;

            var onSubscribeError  = function (evt) {
                if (evt['target']) {
                    if ($(evt['target']).attr("class") != obj.attr("class"));
                    return false;
                }
                var sbmt = formObj.find(o.submitBtnSelector);
                sbmt.addClass(o.submitBtnDisableClass);
                alert ("Ошибка при передачи данных. Попробуйте позже.");
            }

            var onSubscribeSuccess = function (evt) {
                if (evt['target']) {
                    if (! $(evt['target']).attr("class") == obj.attr("class") )
                        return false;
                }
                else
                    return false;

                var sbmt = formObj.find(o.submitBtnSelector);
                sbmt.removeClass(o.submitBtnDisableClass);

                var result = evt['result'] ? evt['result'] : {};
                var contextData = false;
                var i = false;

                // errors
                contextData = result;
                if (!result['success']) {
                    if (contextData) {
                        for (i in o.errorContext) {
                            if (contextData[o.errorContext[i]]){
                                contextData = contextData[o.errorContext[i]];
                            }
                            else {
                                contextData = false;
                                break;
                            }
                        }
                    }
                    if (contextData) {
                        putErrors(contextData);
                    }
                    return false;
                }

                // success template
                var html = ''
                html = o.successTemplate();
                contextData = result;
                if (contextData) {
                    for (i in o.successContext) {
                        if (contextData[o.successContext[i]]){
                            contextData = contextData[o.successContext[i]];
                        }
                        else {
                            contextData = false;
                            break;
                        }
                    }
                }
                if (contextData) {
                    html = o.successTemplate(contextData);
                }
                else {
                    contextData = result;
                    if (contextData) {
                        for (i in o.moreSubscribesSuccessContext) {
                            if (contextData[o.moreSubscribesSuccessContext[i]]){
                                contextData = contextData[o.moreSubscribesSuccessContext[i]];
                            }
                            else {
                                contextData = false;
                                break;
                            }
                        }
                    }
                    if (contextData) {
                        html = o.moreSubscribesSuccessTemplate(contextData);
                    }
                }

                // more subscribes template
                moreSubscribesObj = false;
                var moreDiv = false;

                contextData = result;
                if (contextData) {
                    for (i in o.moreSubscribesContext) {
                        if (contextData[o.moreSubscribesContext[i]]){
                            contextData = contextData[o.moreSubscribesContext[i]];
                        }
                        else {
                            contextData = false;
                            break;
                        }
                    }
                }
                if (contextData) {
                    var moreHtml = o.moreSubscribesTemplate(contextData);
                    var moreDiv = $("<div>");
                    moreDiv.addClass("moreContent");
                    moreDiv.html(moreHtml);
                }

                contentObj.css({"height" : contentObj.height()+"px", 'overflow' : "hidden" });

                contentObj.children().addClass("remove").slideUp(200, function(){
                    contentObj.find(".remove").remove();
                    contentObj.css({"height" : "auto", 'overflow' : "visible" });
                });


                contentObj.append(html);

                if (moreDiv) {
                    contentObj.append(moreDiv);
                    moreSubscribesObj = contentObj.find(".moreContent");
                    moreSubscribesObj.slideToggle(1);
                }

                init();

            }

            var putErrors = function (errors) {
              for (i in errors) {
                    var errorInput = obj.find('[name="'+i+'"]').eq(0);
                    var errorRow = errorInput.closest(o.formRowSelector);
                    errorRow.find("."+o.errorContainerClass).stop().animate({"right" : "-5px", "opacity" : "1"}, 200);
                    errorRow.find(o.errorTextSelector).html(errors[i]);
                }

            }

            var removeErrors = function () {
                obj.find("."+o.errorContainerClass).stop().animate({"right" : "15px", "opacity" : "0"}, 200, function(){
                });
            }

            var init = function () {
                obj.find(o.errorTextSelector).each(function(){
                    if ($(this).html() == '') {
                        $(this).closest("."+o.errorContainerClass).css({"opacity" : "0", "right" : "15px"});
                    }
                });
            }

            // start
            this.init = function () {
                init();
            }

            app.addListener ('onSubscribeError', onSubscribeError);
            app.addListener ('onSubscribeSuccess', onSubscribeSuccess);

            formObj.submit(function() {
                removeErrors();
                var sbmt = formObj.find(o.submitBtnSelector);
                sbmt.addClass(o.submitBtnDisableClass);

                var send_ar = {
                    'success' : function(data) {app.fire({'type':'onSubscribeSuccess', 'target':obj, 'result' : data}); },
                    'error' : function() {app.fire({'type':'onSubscribeError', 'target':obj})},
                    'type' : formObj.attr('method'),
                    'data' : formObj.serializeArray()
                };

                app.ajax.send(formObj.attr("action"), send_ar, false);

                return false;
            });
            obj.delegate("."+o.moreLinkClass, 'click', function() {
                if ($(this).hasClass(o.moreLinkClassClosed)) {
                    $(this).removeClass(o.moreLinkClassClosed);
                    $(this).addClass(o.moreLinkClassOpened);
                    moreSubscribesObj.slideToggle(200);
                }
                else {
                    $(this).removeClass(o.moreLinkClassOpened);
                    $(this).addClass(o.moreLinkClassClosed);
                    moreSubscribesObj.slideToggle(200);
                }
                return false;
            });

            this.initUi = function () {

            }
        };

/*
todo: вызывать указанное событие при переходе на индекс
переход на индекс при клике на карточку
вставлять в паджинатор новые элементы (как в прошлое так и в будущее). Логика: находить куда был переход (назад или в вперед), и в соответ. место вставлять элементы.
При пролистывании назад еще и придется пересчитывать текущий индекс и ставить его активным.
отслеживать кнопку "Назад" в браузере
стопорить листалку при подгрузке (при анимации тоже можно)
 */
b_pager_slider = function(opts){

            var defaults = {
                'containerClass' : '',
                'itemClass' : '',
                'itemActiveClass' : '',
                'itemCardClass' : '',
                'itemCardActiveClass' : '',
                'itemCardInactiveClass' : '',
                'sliderContainerClass' : '',

                'itemLoadingClass' : '',

                'startIndex' : 1,
                'maxVisibleItems' : 5,
                'nextLinkClass' : '',
                'prevLinkClass' : '',
                'totalItems' : 8,
                'itemTemplate' : false,
                'itemRefreshTemplate' : false,
                'type' : 'reloadPage', // reloadPage, raiseEvent
                'onChangeEvent' : false,
                'ajaxUpload' : true,
                'itemsDataContext' : [],
                'regUrlBegin' : '',
                'regUrlValue' : '',
                'itemIdPrefix' : ''
            };

            var o = $.extend({}, defaults, opts);
            var obj = $("."+o.containerClass);
            var container = obj;

            var items = false;
            var totalItems = false;
            var gCurIndex = false;
            var loadedItemsCount = false;
            var itemWidth = 200;

            var slideContainer = $(container).find("."+o.sliderContainerClass);
            var nextLink = $(container).find("."+o.nextLinkClass);
            var prevLink = $(container).find("."+o.prevLinkClass);

            var maxVisibleItems = o.maxVisibleItems;
            var visibleItems = o.maxVisibleItems;

            var loadingProcess = false;
            var loadingDirection = false;
            var loopInitialized = false;
            var slidingProcess = false;

            var itemsFixWidth = function () {
                var containerWidth = $(container).width();
                if (containerWidth < 700) {
                    itemWidth = ((containerWidth + 10) / (maxVisibleItems - 1)) - 10;
                    visibleItems = maxVisibleItems - 1;
                } else {
                    itemWidth = ((containerWidth + 10) / (maxVisibleItems)) - 10;
                    visibleItems = maxVisibleItems;
                }
                obj.find("."+o.itemClass).css({"width": itemWidth + "px"});

                slideContainer.css({"width": ((o.totalItems * itemWidth * 3)) + "px"});
                var containerHeight = $(slideContainer).height();
                obj.find("."+o.itemClass).children().css({"height": containerHeight + "px"});

                // дорисовка дополнительных эелемнтов для циклического листания
                if (loadedItemsCount >= totalItems) {
                    if (!loopInitialized) {
                        var tmp = false;
                        var tmpId = '';
                        var i = false;
                        for (i = 0; i < maxVisibleItems; i++ ) {
                            tmp = items.eq(i).clone();
                            tmpId = tmp.attr("id");
                            tmp.attr("id", "-"+tmpId);
                            tmp.addClass("duplicate");
                            tmp.attr("duplicateIndex", (i + maxVisibleItems) );
                            slideContainer.append(tmp);
                        }
                        var x = loadedItemsCount - 1;
                        for (i = 0; i < maxVisibleItems; i++ ) {
                            tmp = items.eq(x).clone();
                            tmpId = tmp.attr("id");
                            tmp.addClass("duplicate");
                            tmp.attr("id", "+"+tmpId);
                            tmp.attr("duplicateIndex",  (x + maxVisibleItems));
                            slideContainer.prepend(tmp);
			                x--;
                        }
                        var w = (maxVisibleItems + gCurIndex -1) * (-itemWidth - 10);
                        gCurIndex = gCurIndex+maxVisibleItems;
                        slideContainer.css('margin-left', w+"px");
                        loopInitialized = true;
                        initItems ();
                    }
                }

            };

            var afterSlide = function (shift) {
                var index = gCurIndex;

                // подгрузка новых элементов
                var needToUpload = false;
                if (loadedItemsCount < totalItems && shift) {
                    if (gCurIndex + visibleItems >= loadedItemsCount)
                        needToUpload = true;
                    else if (gCurIndex <= 1)
                        needToUpload = true;
                }
                if (needToUpload) {
                    var el = false;
                    if (shift > 0) {
                        el = items.filter(":last");
                    }
                    else if (shift < 0) {
                        el = items.filter(":first");
                    }
                    if (el)
                        uploadItems(el, shift);
                }
                // зацикливание в листании
                else if (loopInitialized) {
                    var el = items.eq(gCurIndex);
                    if (el.hasClass("duplicate")) {
                        var moveTo = parseInt(el.attr("duplicateIndex"));
                        var w = (moveTo - 1) * (-itemWidth - 10);
                        gCurIndex = moveTo;
                        slideContainer.css('margin-left', w+"px");
                    }
                }
                items.eq(gCurIndex).find("."+o.itemCardClass).removeClass(o.itemCardInactiveClass).addClass(o.itemCardActiveClass);
                slidingProcess = false;
            };

            var slideItems = function (i) {
                switch (i) {
                    case (1): {
                        moveToIndex((gCurIndex+1), true, true);
                    }
                    break;
                    case (-1): {
                        moveToIndex((gCurIndex-1), true, true);
                    }
                    break;
                }
            };

            var reloadPage = function (el, setHistory) {
		setHistory = setHistory ? setHistory : false;
                app.ajax.ajaxPage(el.attr("rel"), setHistory);
            }

            var moveToIndex = function (index, setHistory, raiseEvent) {
                if (loadingProcess) {
                    return false;
                }
                if (slidingProcess) {
                    return false;
                }
                index = index ? index : index === 0 ? 0 : gCurIndex;
                var shift = (index != gCurIndex) ? (index - gCurIndex) : false;
                raiseEvent = raiseEvent ? raiseEvent : false;
		setHistory = setHistory ? setHistory : false;
                var oldGCurIndex = gCurIndex;
                gCurIndex = index;
                var defaultWidth = itemWidth+10;
                var w = -defaultWidth;
                for (i=0; i<index; i++)
                    w += itemWidth+10;
                if (w < 0)
                    w = defaultWidth;
                else
                    w = '-'+w;

                slidingProcess = true;
                items.find("."+o.itemCardClass).removeClass(o.itemCardActiveClass).addClass(o.itemCardInactiveClass);
                $(slideContainer).animate({marginLeft: w+"px"}, 400, function(){
                    afterSlide(shift);
                });

                if (!shift) {
                    return;
                }

                if (raiseEvent) {
                    var el = items.eq(index);
                    if (o.type == 'reloadPage') {
                        reloadPage(el, setHistory);
                    }
                    else if (o.type == 'raiseEvent') {
                        app.fire({'type' : o.onChangeEvent, 'value' : el.attr("rel")});
                    }
                }

            }

            var uploadItems = function (el, shift) {
                var link = el.attr("rel");
                var indexName = shift > 0 ? 'last' : 'first';
                var sendData = {};
                sendData[indexName] = el.attr("id");

                loadingProcess = true;
                loadingDirection = shift;
                app.ajax.send (link, {
                    'success' : obtainAjaxData,
                    'data' : sendData
                });
            }

            var obtainAjaxData = function (result) {
                var contextData = result;

                var context = o.itemsDataContext;
                if (context) {
                    var html = '';
                    if (contextData) {
                        for (i in context) {
                            if (contextData[context[i]]) {
                                contextData = contextData[context[i]];
                            }
                            else {
                                contextData = false;
                                break;
                            }
                        }
                    }
                }

                var newItemsCount = 0;
                var html = '';
                if (contextData) {
                    for (i in contextData) {
			var elHtml = o.itemTemplate(contextData[i]);
			var _elId = $(elHtml).attr("id");
			if (!container.find("#"+_elId).length) {
			  html += elHtml;
			  newItemsCount++;
			}
                    }

                    if (loadingDirection > 0) {
                        slideContainer.append(html);
                    }
                    else if (loadingDirection < 0) {
                        gCurIndex = gCurIndex + newItemsCount;
                        var w = (gCurIndex-1) * (-itemWidth-10);
                        slideContainer.prepend(html);
                        slideContainer.css('margin-left', w+"px");
                    }

                }

                initItems ();
                itemsFixWidth();

                loadingProcess = false;
                loadingDirection = false;
            }

            /**
             * Обработчик изменения урла при нажатии на кнопках "вперед/назад" в браузере
             */
            var onUrlChanged = function (evt) {
                var index = getStartIndex(evt.url);
                moveToIndex(index, false, true);
            };

            var getStartIndex = function(url) {
                var cardId = false;
                if(typeof url == 'undefined')
                    url = $.url();

                var res = url.attr('source').match( o.regUrlBegin.source + "(" + o.regUrlValue.source + ")" );

                if (res && res[1])
                    cardId = res[1];
                else
                    return gCurIndex; // значения нет в урле - не меняем карточку
                    
                // Ищем индекс элемента по дате в урле
		var el = container.find("#"+o.itemIdPrefix+cardId);
                var index = items.index(el);
                if (!index || index < 0)
                    index = gCurIndex;

                return index;
            };


            var init = function (opts) {
                opts = opts ? opts : o;
                totalItems = opts.totalItems ? opts.totalItems : gCurIndex;
                gCurIndex = opts.startIndex ? opts.startIndex : gCurIndex;
		
		if (totalItems <= (maxVisibleItems - 1)) {
		  loopInitialized = true;
		  nextLink.hide();
		  prevLink.hide();
		}

                initItems();
                itemsFixWidth();

                moveToIndex (false, false, false);
            }

            var initItems = function () {
                items = $(container).find("."+o.itemClass);
                loadedItemsCount = items.length;
            }

            app.addListener ('urlChanged', onUrlChanged);

            container.delegate('.'+o.itemClass+" a", 'click', function(){
                var el = $(this).closest('.'+o.itemClass);
                var index = items.index(el);
                moveToIndex(index, true, true);
                return false;
            });

            // events, etc
            prevLink.click(function() {
                slideItems(-1);
                return false;
            });
            nextLink.click(function() {
                slideItems(1);
                return false;
            });

            $(window).resize(function(){
                itemsFixWidth();
                moveToIndex (false, flase, false);
            });

            // init
            this.init = function (opts) {
                init(opts);
            }

            this.initUi = function () {

            }
        };
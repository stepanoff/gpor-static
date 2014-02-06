/*
При клике на ссылку показывает баллун с точкой на карте
Слушает событие contentReplaced
 */
js_map_point = function(opts){

            var defaults = {
                'containerSelector' : '', // селекор для контейнера с ссылками "показать на карте". Если отсутствует берется вся страница
                'itemSelectors' : '', // селекоры для ссылок "показать на карте"
                'balloonTemplate' : false // (?) шаблон для отрисовки контента баллуна. По умолчанию берется контент ссылки
            };

            var o = $.extend({}, defaults, opts);
            var obj = false;
            if (o.containerSelector)
                var obj = $(o.containerSelector);
            if (!obj)
                obj = $(document);

            var showMap = function (el) {
                var title = $(el).attr("title_map");
                var attr_id = $(el).attr("attr_id");
                var attr_link = $(el).attr("attr_link");
                var attr_name = $(el).attr("attr_name");
                var attr_phone = $(el).attr("attr_phone");
                var attr_address = $(el).attr("attr_address");
                var balloon_html = '<div style="font-size: 8pt;">' +
                    '<a name="hotel' + attr_id + '" class="hotels_name" href="' + attr_link + '">' +
                    attr_name +
                    '</a>' +
                    '<div class="hotels_body">' +
                    '<p class="search-hotel-addr">' + attr_address + '</p>' +
                    '<p>' + attr_phone + '</p>' +
                    '</div>' +
                    '</div>';

                var addr = $.data(document, 'portal.city') + ' ' + $(el).attr("addr_map");
                var id = $(el).attr('id');
                var latitude  = $(el).attr('yandexmap_latitude');
                var longitude = $(el).attr('yandexmap_longitude');
                var mapType = "yandex#map";
                if ($.data(document, 'yandexPeopleMaps'))
                    mapType = "yandex#publicMap";

                var zoom = $.data(document, 'yandexDefaultZoom')
                    ? $.data(document, 'yandexDefaultZoom')
                    : 12;
                var pointZoom = $(el).attr('yandexmap_zoom');
                zoom = pointZoom ? pointZoom : zoom;


                if (latitude) {
                    $(".js_popup_content")
                        .addClass('for-map')
                        .html('<div id="ymap-' + id + '" style="width: 100%; height: 100%; z-index: 99999 !important;"></div>');
                        var map = new YMaps.Map("ymap-" + id, {
                            // Центр карты
                            center:[latitude, longitude],
                            // Коэффициент масштабирования
                            zoom:zoom,
                            // Тип карты
                            type:mapType,
                            // Поведение карты
                            behaviors:["default", "scrollZoom"]
                        });
                        addPlacemark(latitude, longitude, balloon_html, map);
                        addControls(map);
                }

            }

            var addPlacemark = function (latitude, longitude, html, map) {
                var myPlacemark = new YMaps.Placemark([latitude, longitude], {
                    balloonContentBody:html
                });

                map.geoObjects.add(myPlacemark);
            }

            var addControls = function (map) {
                map.controls
                    .add('zoomControl')
                    .add('scaleLine')
                    .add('searchControl')
                    .add('typeSelector');
            }

            var initUi = function (evt) {
                evt = evt ? evt : false;
                var el = obj;
                if (evt) {
                    var targ = evt['target'] ? evt['target'] : false;
                    if (targ && o.containerSelector) {
                        var containerFound = false;
                        var closestContainer = $(targ).find(o.containerSelector);
                        if (!closestContainer.length)
                            closestContainer = $(targ).parent().find(o.containerSelector);
                        if (closestContainer.length) {
                            containerFound = true;
                            el = closestContainer;
                        }
                        if (!containerFound)
                            return;
                    }
                    else if (!o.containerSelector)
                        el = obj;
                }
                for (i in o.itemSelectors) {
                    $(el).find(o.itemSelectors[i]).unbind('click');
                    $(el).find(o.itemSelectors[i]).each(function(){
                        $(this).popup({
                            title:$(this).attr("title_map"),
                            content:"",
                            width:"500px",
                            height:"400px",
                            popuphide: function () {
                                $(".js_popup_content").removeClass('for-map');
                            }
                        });
                    });
                    $(el).find(o.itemSelectors[i]).bind('click', function(){
                        showMap($(this));
                        return false;
                    });
                }
            }

            // start
            this.init = function () {
                app.addListener ('contentReplaced', initUi);
            }

            this.initUi = function () {
                initUi();
            }
        };


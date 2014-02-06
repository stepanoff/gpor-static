(function ($) {
    $.fn.bank_card_map_items = function (opts) {
        opts = $.extend({}, $.fn.bank_card_map_items.defaults, opts);
        return this.each(function () {
            $.fn.bank_card_map_items.instances[$(this).attr('id')] = new BankCardMapItems(this, opts, $(this).attr('id'));
            return $.fn.bank_card_map_items.instances[$(this).attr('id')];
        });
    };

    $.fn.bank_card_map_items.instances = new Object();
    $.fn.bank_card_map_items_refresh = function () {
    };

    // default options
    $.fn.bank_card_map_items.defaults = {
        'mapId': 'ya-map-search',
        'listClass': 'found_body_left',
        'containerClass': 'found_body',
        'itemClass': 'item_offer',
        'activeItemClass': 'item_offer_active',
        'itemAddressClass': 'item_offer_address',
        'itemLinkClass': 'item_offer_link',
        'itemBalloonClass': 'item_offer_balloon_content',
        'footerId': 'l-footer',
        'lat': $.data(document, 'yandexDefaultLatitude'),
        'lng': $.data(document, 'yandexDefaultLongitude'),
        'pmap': false,
        'enableScroll': true,
        'scale': $.data(document, 'yandexDefaultZoom'),
        'height': 800
    };

    var BankCardMapItems = function (obj, o, instance_id) {
        $("#" + o.mapId).each(function () {
            var left_height = 0;
            if (o.enableScroll)
                left_height = $('.' + o.listClass).attr("offsetHeight");
            else
                left_height = o.height;
            $(this).css({height: left_height + "px"});
        });

        YMaps.ready(function () {
            var mapType = "yandex#map";
            if ($.data(document, 'yandexPeopleMaps'))
                mapType = "yandex#publicMap";

            // Инициализация карты
            var map = new YMaps.Map(o.mapId,
                    {
                        center: [o.lat, o.lng],
                        // Коэффициент масштабирования
                        zoom: o.scale,
                        // Тип карты
                        type: mapType,
                        // Поведение карты
                        behaviors: ["default"]
                    });
            map.controls
                    .add('zoomControl')
                    .add('typeSelector')
                    .add('mapTools')
                    .add(new YMaps.control.MiniMap({ type: 'yandex#map', expanded: false}))
                    .add('trafficControl')
                    .add('scaleLine');


            // Инициализация обработчиков наведения на элементы списка
            var points = new Array();
            var $items = $('.' + o.itemClass);

            $items.bind("mouseenter", function (e) {
                pointId = $(this).attr("pointId");
                $items.removeClass(o.activeItemClass);
                $(this).addClass(o.activeItemClass);

                if (pointId) {
                    placemark = points[pointId];
                    map.panTo(placemark.geometry.getCoordinates());
                    placemark.balloon.open();
                }
                else {
                    for (i in points)
                        points[i].balloon.close();
                }
                e.stopPropagation();
            });


            // Получаем все адреса и декодируем их
            $items.each(function () {
                var self = $(this);
                var linkEl = self.find("." + o.itemLinkClass);
                var addrEl = self.find("." + o.itemAddressClass);
                var balloonEl = self.find("." + o.itemBalloonClass);
                var address = addrEl.attr('addr_map');
                var content = balloonEl.html();
                var isPartnerBank = self.find(".card-bank-partner_bank").size();
                var mark_type = isPartnerBank ? {
                    iconImageHref: $.data(document, 'portal.resources') + '/img/placeholder/red_mark.png',
                    iconImageSize: [37, 42], // размеры картинки
                    iconImageOffset: [-9, -29], // смещение картинки
                    zIndex: 650
                } : {zIndex: 650};
                (function () {
                    YMaps.geocode(address, {
                        results: 20,
                        provider: mapType
                    }).then(
                            function (res) {
                                if (res.geoObjects.getLength()) {
                                    var object = res.geoObjects.get(0);
                                    var coords = object.geometry.getCoordinates();
                                    var placemark = new YMaps.Placemark(coords,
                                            {
                                                balloonContentHeader: addrEl.attr('title_map'),
                                                balloonContentBody: content
                                            }, mark_type);

                                    //setBounds(placemark);
                                    map.geoObjects.add(placemark);

                                    var lat = coords[0];
                                    var lng = coords[1];

                                    pointId = lat + "_" + lng;
                                    self.attr("pointId", pointId);
                                    points[pointId] = placemark;

                                    if (o.activeItemClass) {
                                        placemark.events.add('click', function (placemark) {
                                            $('.' + o.itemClass).removeClass(o.activeItemClass);
                                            self.addClass(o.activeItemClass);
                                            location.href = '#' + self.attr("label");
                                        }, placemark);
                                    }
                                }

                            },
                            function (err) {
                            }
                    );
                })();
            });


            var setBounds = function () {
                minLng = false;
                maxLng = false;
                minLat = false;
                maxLat = false;
                var cX = 0;
                var cY = 0;
                var t = 0;

                for (i in points) {
                    t++;

                    x = parseFloat(points[i].geometry.getCoordinates()[0]);
                    y = parseFloat(points[i].geometry.getCoordinates()[1]);

                    x = isNaN(x) ? cX : x;
                    y = isNaN(y) ? cY : y;

                    if (minLng == false)    minLng = x;
                    if (maxLng == false)    maxLng = x;
                    if (minLat == false)    minLat = y;
                    if (maxLat == false)    maxLat = y;

                    if (cX == 0) {
                        cX = x;
                        cY = y;
                    }
                    else {
                        cX = parseFloat((x - cX) / (t + 1)) + parseFloat(cX);
                        cY = parseFloat((y - cY) / (t + 1)) + parseFloat(cY);
                    }

                    if (minLng > x)     minLng = x;
                    if (maxLng < x)     maxLng = x;
                    if (minLat > y)     minLat = y;
                    if (maxLat < y)     maxLat = y;
                }

                if (minLng) {
                    map.setBounds([
                        [minLng, minLat],
                        [maxLng, maxLat]
                    ], {checkZoomRange: true});

                    // #1994 fix - Возвращаем мастаб карты к исходному

                    map.setCenter([cX, cY], o.scale);
                }
                return false;
            };

            // map scroll
            if (!o.enableScroll) {
                setBounds();
            }
            else {
                var ya_map = $("#" + o.mapId);
                var $document = $(document);
                var $body = $('body');
                var $searchContent = $("." + o.containerClass);
                var $foot_wrap = $('.' + o.footerId);

                var scroll = function () {
                    var current_scroll = $document.scrollTop();
                    var offset = $searchContent.offset();
                    var new_top = offset.top - current_scroll;
                    var new_foot = $foot_wrap.height() + current_scroll - $document.height() + $body.height();
                    var right_block = $("." + o.containerClass);
                    if (new_top < 10)
                        new_top = 10;

                    var newheight = document.body.clientHeight - new_top - 10;
                    var rightHeight = right_block.attr("offsetHeight");
                    offset = rightHeight + parseInt(right_block.offset().top);
                    if (current_scroll + newheight + new_top > offset)
                        newheight = offset - current_scroll - new_top - 10;

                    if (new_foot > 0)
                        newheight -= new_foot;

                    ya_map.css({
                        'height': newheight,
                        'top': new_top
                    });
                    map.container.fitToViewport();
                };

                var parent_map = ya_map.parent();
                ya_map.css("width", parent_map.width() - 10 + "px");
                var clientHeight = $(document.body).attr("clientHeight");
                var mapTop = parseInt(ya_map.offset().top);
                var startHeight = clientHeight;

                ya_map.css({height: startHeight - 10 + "px"});
                YMaps.load(function () {
                    ya_map.css({height: startHeight - mapTop + "px"});
                });

                rightBlock = $(o.listClass);
                if (rightBlock.attr("offsetHeight") < 535)
                    rightBlock.css("height", "535px");

                $(window).resize(function () {
                    ya_map.css("width", parent_map.width() - 10 + "px");
                    scroll();
                });
                $(document).ready(function () {
                    scroll();
                    setBounds();
                });
                window.onmousewheel = document.onmousewheel = scroll;
                window.onscroll = scroll;

                scroll();
            }
        });
    };
})(jQuery);
(function ($) {
    $.fn.realty_map_items = function (opts) {
        opts = $.extend({}, $.fn.realty_map_items.defaults, opts);
        return this.each(function () {
            $.fn.realty_map_items.instances[$(this).attr('id')] = new RealtyMapItems(this, opts, $(this).attr('id'));
            return $.fn.realty_map_items.instances[$(this).attr('id')];
        });
    };

    $.fn.realty_map_items.instances = new Object();
    $.fn.realty_map_items_refresh = function () {
    };

    // default options
    $.fn.realty_map_items.defaults = {
        'mapId': 'ya-map-search',
        'listClass': 'found_body_left',
        'containerClass': 'found_body',
        'itemClass': 'item_offer',
        'activeItemClass': 'item_offer_active',
        'itemAddressClass': 'item_offer_address',
        'itemLinkClass': 'item_offer_link',
        'footerId': 'l-footer',
        'lat': $.data(document, 'yandexDefaultLatitude'),
        'lng': $.data(document, 'yandexDefaultLongitude'),
        'pmap': false,
        'enableScroll': true,
        'scale': $.data(document, 'yandexDefaultZoom'),
        'height': 800,
        'focusOnTitle': false
    };

    var RealtyMapItems = function (obj, o, instance_id) {
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
                    .add('miniMap')
                    .add('scaleLine');

            var points = new Array();
            var titlePoints = new Array();
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

            var firstPoint = false;
            var specialPoints = [];
            $items.each(function () {
                var lat = parseFloat($(this).attr("lat"));
                var lng = parseFloat($(this).attr("lng"));
                var titlecity = $(this).attr("titlecity");
                var special = $(this).attr("special-icon");
                var iter = $(this).attr('iteration');
                if (lat != "" && lng != "") {
                    //map.panTo(new YMaps.GeoPoint(lng, lat), o.scale);
                    var address = $(this).find("." + o.itemAddressClass).html();
                    var link = $(this).find("." + o.itemLinkClass);
                    var description = '<div><a href="' + link.attr("href") + '">' + link.html() + '</a></div><p>' + address + '</p>';
                    if (special == "1") {
                        var special_icon_url = $(this).attr("special-icon-url");
                        var special_style = "";
                        if (special_icon_url != "") {
                            special_style = 'style="background-image:url(' + special_icon_url + ')"';
                        }
                        else
                            special_icon_url = $.data(document, 'portal.resources') + '/img/placeholder/marker.png';
                        var myBalloonContentLayout = YMaps.templateLayoutFactory.createClass('$[[options.contentBodyLayout]]');
                        var myBalloonContentBodyLayout = YMaps.templateLayoutFactory.createClass(
                                '<div class=\'b-map-popup\'><div class=\'b-map-popup__shadow\'></div><div class=\'b-map-popup__frame\'><div class=\'blc-cn blc-tl\'></div><div class=\'blc-cn blc-tr\'></div><div class=\'b-map-popup__content\'><div class=\'b-map-popup__left-line\'></div><div class=\'b-map-popup__right-line\'></div><a class=\'close\' href=\'#\'></a><div class=\'b-map-popup__text b-map-popup__text_bg-image_novostroy\' ' + special_style + '><div class=\'content\'>$[[options.contentBodyLayout]]</div></div></div><div class=\'blc-cn blc-bl\'></div><div class=\'blc-cn blc-br\'></div></div></div>',
                                {
                                    build: function () {
                                        this.constructor.superclass.build.call(this);
                                        var balloon = this.getData().geoObject.balloon;
                                        $('.close').click(function () {
                                            balloon.close();
                                            return false;
                                        });
                                    }
                                }
                        );
                        var placemark = new YMaps.Placemark([lat, lng], {
                            balloonContent: description
                        }, {
                            iconImageHref: special_icon_url, // картинка иконки
                            iconImageSize: [31, 46], // размеры картинки
                            iconImageOffset: [-9, -29], // смещение картинки
                            iconShadow: true,
                            iconShadowImageHref: $.data(document, 'portal.resources') + '/img/placeholder/marker-shadow.png', // картинка иконки
                            iconShadowImageSize: [39, 37], // размеры картинки
                            iconShadowImageOffset: [0, -20], // смещение картинки

                            hideIconOnBalloonOpen: false,

                            balloonLayout: myBalloonContentBodyLayout,
                            balloonContentLayout: myBalloonContentLayout,
                            balloonShadow: false,
                            balloonOffset: [-40, -60]
                        });
                        specialPoints.push(placemark);
                    }
                    else {
                        var placemark = new YMaps.Placemark([lat, lng], {
                            balloonContent: '<div style="font-size: 13px;">' + description + '</div>',
                            iconContent: '<div style="width:33px; font-size: 12px; font-weight: bold; text-align: center; left: -9px; position: relative; top: 1px; ">' + iter + '</div>'
                        }, {
                            hideIconOnBalloonOpen: true,
                            iconImageHref: $.data(document, 'portal.resources') + '/img/placeholder/mark.png',
                            iconImageSize: [31, 33], // размеры картинки
                            iconImageOffset: [-9, -29] // смещение картинки
                        });
                        map.geoObjects.add(placemark);
                    }

                    if (!firstPoint) {
                        firstPoint = true;
                        //map.setCenter(placemark.getGeoPoint(), o.scale);
                    }

                    pointId = lat + "_" + lng;
                    $(this).attr("pointId", pointId);
                    points[pointId] = placemark;
                    titlePoints[pointId] = titlecity;
                    var that = this;

                    if (o.activeItemClass) {
                        placemark.events.add('click', function (placemark) {
                            $('.' + o.itemClass).removeClass(o.activeItemClass);
                            $(that).addClass(o.activeItemClass);
                            location.href = '#' + $(that).attr("label");
                        }, placemark);
                    }
                }
            });

            if (specialPoints.length) {
                for (i in specialPoints) {
                    map.geoObjects.add(specialPoints[i]);
                }
            }

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

                    if (o.focusOnTitle && !titlePoints[i])
                        continue;

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

//                  maxZoom = map.getMaxZoom();
//                  zoom = map.getZoom();
//                  if (zoom == maxZoom)
//                      maxZoom = map.setZoom(zoom - 2);

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
                    if (new_top < 10) {
                        new_top = 10;
                    }
                    var newheight = document.body.clientHeight - new_top - 10;
                    var rightHeight = right_block.attr("offsetHeight");
                    var offset = rightHeight + parseInt(right_block.offset().top);
                    if (current_scroll + newheight + new_top > offset) {
                        newheight = offset - current_scroll - new_top - 10;
                    }

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
                if (rightBlock.attr("offsetHeight") < 535) {
                    rightBlock.css("height", "535px");
                }

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
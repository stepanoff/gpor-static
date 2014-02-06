/**
 * @method limitExecByInterval
 * @param interval
 */
Function.prototype.limitExecByInterval = function (interval) {
    var fn = this;
    var timer, expireTime = 0;
    return function () {
        var elapseTime = expireTime - new Date();
        if (elapseTime <= 0) {
            timer = clearTimeout(timer);
            fn.apply(this, arguments);
            expireTime = Number(new Date()) + interval;
        } else if (!timer) {
            var args = arguments;
            var scope = this;
            timer = setTimeout(function () {
                expireTime = 0;
                args.callee.apply(scope, args);
            }, elapseTime);
        }
    }
};

function addPlacemark(point, placemarkContainer, that, label, map) {

    var placemark = new YMaps.Placemark(point, {
        balloonContentBody: '<div style="font-size: 8pt;">' + $(that).html() + '</div>'
    });

    map.geoObjects.add(placemark);
    placemarkContainer.push(placemark);

    placemark.events.add('click', function (placemark) {
        $(".hotels_elements-one").removeClass("hotels_current");
        $(that).parent().addClass("hotels_current");

        location.href = '#' + label;
    }, placemark);
}

$(document).ready(function () {
    var ya = document.getElementById('ya-map-search');

    if (ya && "YMaps" in window) {
        YMaps.ready(function () {
            var points = new Array();

            var provider = "yandex#map";
            if ($.data(document, 'yandexPeopleMaps')) {
                provider = "yandex#publicMap";
            }
            var mapType = "yandex#map";
            if ($.data(document, 'yandexPeopleMaps'))
                mapType = "yandex#publicMap";

            YMaps.geocode($.data(document, 'portal.city'), {
                results: 1,
                provider: provider
            }).then(
                    function (res) {
                        var object = res.geoObjects.get(0);
                        lat = $.data(document, 'yandexDefaultLatitude');
                        lng = $.data(document, 'yandexDefaultLongitude');
                        var map = new YMaps.Map("ya-map-search", {
                            // Центр карты
                            center: [lat, lng],
                            // Коэффициент масштабирования
                            zoom: 11,
                            // Тип карты
                            type: mapType,
                            // Поведение карты
                            behaviors: ["default", "scrollZoom"]
                        });
                        map.controls
                                .add('zoomControl')
                                .add('scaleLine');
                        var placemarks_hotels = [];
                        var key_addr_hotels = {};
                        var index_addr_hotels = {};
                        var count_key_hotels = 0;
                        var count_index_hotels = 0;
                        var search_hotel_addr_hotels = $(".hotels_elements_hotels .hotels_elements-left");

                        var setBounds = function () {
                            minLng = false;
                            maxLng = false;
                            minLat = false;
                            maxLat = false;
                            for (i in points) {
                                x = points[i].latitude;
                                y = points[i].longitude;
                                if (minLng == false)    minLng = x;
                                if (maxLng == false)    maxLng = x;
                                if (minLat == false)    minLat = y;
                                if (maxLat == false)    maxLat = y;

                                if (minLng > x)         minLng = x;
                                if (maxLng < x)         maxLng = x;
                                if (minLat > y)         minLat = y;
                                if (maxLat < y)         maxLat = y;
                            }
                            if (minLng) {
                                map.setBounds([
                                    [minLng, minLat],
                                    [maxLng, maxLat]
                                ], {checkZoomRange: true});
                            }
                            return false;
                        };

                        search_hotel_addr_hotels.each(function () {

                            var that = this;
                            var $addrField = $(this).children(".hotels_body").children(".search-hotel-addr");
                            var addr = $addrField.text();

                            var longitude = 0;
                            var latitude = 0;
                            if ($addrField.attr('yandexmap_latitude')) {
                                latitude = parseFloat($addrField.attr('yandexmap_latitude'));
                                longitude = parseFloat($addrField.attr('yandexmap_longitude'));
                            }
                            var label = $(this).children(".hotels_name").attr('name');

                            index_addr_hotels[count_index_hotels++] = addr;
                            if (!latitude) {
                                YMaps.geocode($.data(document, 'portal.city') + ", " + addr, {
                                    results: 20,
                                    // Ищем в пределах области карты
                                    boundedBy: map.getBounds(),
                                    provider: provider
                                }).then(
                                        function (res) {
                                            key_addr_hotels[addr] = count_key_hotels++;
                                            if (res.geoObjects.getLength()) {
                                                addPlacemark(res.geoObjects.get(0).geometry.getCoordinates(), placemarks_hotels, that, label, map);
                                            } else {
                                                placemarks_hotels.push("");
                                            }
                                        }, function (err) {
                                            console.log(err);
                                        }
                                );
                            } else {
                                key_addr_hotels[addr] = count_key_hotels++;
                                addPlacemark([latitude, longitude], placemarks_hotels, that, label, map);
                            }
                        });

                        var _hotels = $(".hotels_elements_hotels .hotels_elements-one");
                        _hotels.bind("mouseenter", function () {
                            if ($(this).hasClass("hotels_current"))
                                return;
                            $(".hotels_elements-one").removeClass("hotels_current");
                            $(this).addClass("hotels_current");
                            var position = $(this).prevAll().length;
                            position = key_addr_hotels[index_addr_hotels[position]];
                            if (placemarks_hotels[position]) {
                                var mark = placemarks_hotels[position];
                                map.setCenter(mark.geometry.getCoordinates(), 12, {checkZoomRange: true, duration: 500});
//                            var maxZoom = map.zoomRange._zoomRange[1];
//                            if (maxZoom > 0 && maxZoom > (map.getZoom() - 2))
//                                map.setZoom(maxZoom - 2);
                                mark.balloon.open();
                            } else {
                                for (var i = 0, len = placemarks_hotels.length; i < len; ++i) {
                                    if (placemarks_hotels[i]) {
                                        placemarks_hotels[i].balloon.close();
                                    }
                                }
                            }
                        });

                        var placemarks_flats = [];
                        var key_addr_flats = {};
                        var index_addr_flats = {};
                        var count_key_flats = 0;
                        var count_index_flats = 0;
                        var search_hotel_addr_flats = $(".hotels_elements_flats .hotels_elements-left");

                        search_hotel_addr_flats.each(function () {
                            var that = this;
                            var $addrField = $(this).children(".hotels_body").children(".search-hotel-addr");
                            var addr = $addrField.text();
                            var longitude = 0;
                            var latitude = 0;
                            if ($addrField.attr('yandexmap_latitude')) {
                                latitude = parseFloat($addrField.attr('yandexmap_latitude'));
                                longitude = parseFloat($addrField.attr('yandexmap_longitude'));
                            }
                            var label = $(this).children(".hotels_name").attr('name');

                            index_addr_flats[count_index_flats++] = addr;
                            if (!latitude) {
                                YMaps.geocode($.data(document, 'portal.city') + ", " + addr, {
                                    results: 20,
                                    // Ищем в пределах области карты
                                    boundedBy: map.getBounds(),
                                    provider: provider
                                }).then(
                                        function (res) {
                                            key_addr_flats[addr] = count_key_flats++;
                                            if (res.geoObjects.getLength()) {
                                                addPlacemark(res.geoObjects.get(0).geometry.getCoordinates(), placemarks_flats, that, label, map);
                                            } else {
                                                placemarks_flats.push("");
                                            }
                                        }, function (err) {
                                            console.log(err);
                                        }
                                );
                            } else {
                                key_addr_flats[addr] = count_key_flats++;
                                addPlacemark([latitude, longitude], placemarks_flats, that, label, map);

                                pointId = latitude + "_" + longitude;
                                placemark = new Object();
                                placemark.longitude = longitude;
                                placemark.latitude = latitude;
                                points[pointId] = placemark;
                            }
                        });

                        setBounds();

                        var _flats = $(".hotels_elements_flats .hotels_elements-one");
                        _flats.bind("mouseenter", function (e) {
                            if ($(this).hasClass("hotels_current"))
                                return;
                            $(".hotels_elements-one").removeClass("hotels_current");
                            $(this).addClass("hotels_current");
                            var position = $(this).prevAll().length;
                            position = key_addr_flats[index_addr_flats[position]];
                            if (placemarks_flats[position]) {
                                var mark = placemarks_flats[position];
                                map.setCenter(mark.geometry.getCoordinates(), 14, {checkZoomRange: true, duration: 500});
//                            var maxZoom = map.zoomRange._zoomRange[1];
//                            if (maxZoom > 0 && maxZoom > (map.getZoom() - 2))
//                                map.setZoom(maxZoom - 2);
                                mark.balloon.open();
                            } else {
                                for (var i = 0, len = placemarks_flats.length; i < len; ++i) {
                                    if (placemarks_flats[i]) {
                                        placemarks_flats[i].balloon.close();
                                    }
                                }
                            }
                        });

                        var ya_map = $("#ya-map-search");
                        var $document = $(document);
                        var $hotels_search_content = $('div.hotels_search-content');
                        var $foot_wrap = $('#l-footer');


                        function scroll() {
                            var current_scroll = $document.scrollTop();
                            var offset = $hotels_search_content.offset();
                            var new_top = offset.top - current_scroll;
                            var right_block = $(".hotels_search-content-right");
                            if (new_top < 10) {
                                new_top = 10;
                            }
                            var newheight = document.body.clientHeight - new_top - 10;
                            var rightHeight = right_block.attr("offsetHeight");
                            offset = rightHeight + parseInt(right_block.offset().top);
                            if (current_scroll + newheight + new_top > offset) {
                                newheight = offset - current_scroll - new_top - 10;
                            }

                            ya_map.css({
                                'height': newheight,
                                'top': new_top
                            });
                            map.container.fitToViewport();
                        }

                        var parent_map = ya_map.parent();
                        ya_map.css("width", parent_map.width() + "px");
                        var clientHeight = $(document.body).attr("clientHeight");
                        var mapTop = parseInt(ya_map.offset().top);
                        var startHeight = clientHeight;

                        ya_map.css({height: startHeight - 10 + "px"});
                        YMaps.load(function () {
                            ya_map.css({height: startHeight - mapTop + "px"});
                        });
                        rightBlock = $(".hotels_search-content-right");
                        if (rightBlock.attr("offsetHeight") < 535) {
                            rightBlock.css("height", "535px");
                        }

                        $(window).resize(function () {
                            ya_map.css("width", parent_map.width() + "px");
                            scroll();
                        });
                        window.onmousewheel = document.onmousewheel = scroll;
                        window.onscroll = scroll;

                        scroll();


                    }, function (err) {
                        console.log(err);
                    }

            );
        });
    }
});

var precisions = Array();
precisions['exact'] = 0;
precisions['number'] = 1;
precisions['near'] = 2;
precisions['street'] = 3;
precisions['other'] = 4;
precisions['suggestion'] = 5;

function sortPrecision(a, b) {
    if (precisions[a.precision] < precisions[b.precision]) return -1;
    if (precisions[a.precision] == precisions[b.precision]) return 0;
    if (precisions[a.precision] > precisions[b.precision]) return 1;
}
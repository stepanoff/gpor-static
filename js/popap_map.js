function addPlacemark(latitude, longitude, html, map) {

    var myPlacemark = new YMaps.Placemark([latitude, longitude], {
        balloonContentBody:html
    });

    map.geoObjects.add(myPlacemark);
}

function addControls(map) {
    map.controls
        .add('zoomControl')
        .add('scaleLine')
        .add('searchControl')
        .add('typeSelector');
}

$(document).ready(function () {
    try {
        $(".j-popap_map").each(function () {
            var title = $(this).attr("title_map");
            var attr_id = $(this).attr("attr_id");
            var attr_link = $(this).attr("attr_link");
            var attr_name = $(this).attr("attr_name");
            var attr_phone = $(this).attr("attr_phone");
            var attr_address = $(this).attr("attr_address");
            var balloon_html = '<div style="font-size: 8pt;">' +
                '<a name="hotel' + attr_id + '" class="hotels_name" href="' + attr_link + '">' +
                attr_name +
                '</a>' +
                '<div class="hotels_body">' +
                '<p class="search-hotel-addr">' + attr_address + '</p>' +
                '<p>' + attr_phone + '</p>' +
                '</div>' +
                '</div>';

            $(this).popup({
                title:title,
                content:"",
                width:"500px",
                height:"400px",
                popuphide: function () {
                    $(".js_popup_content").removeClass('for-map');
                }
            }).bind("click", function (e) {
                    var addr = $.data(document, 'portal.city') + ' ' + $(this).attr("addr_map");
                    var id = $(this).attr('id');
                    var longitude = 0;
                    var latitude = 0;
                    var mapType = "yandex#map";
                    if ($.data(document, 'yandexPeopleMaps'))
                        mapType = "yandex#publicMap";
                    
                    var zoom = $.data(document, 'yandexDefaultZoom')
                        ? $.data(document, 'yandexDefaultZoom')
                        : 12;

                    if ($(this).attr('yandexmap_latitude')) {
                        latitude  = $(this).attr('yandexmap_latitude');
                        longitude = $(this).attr('yandexmap_longitude');
                        zoom      = $(this).attr('yandexmap_zoom');
                    }

                    $(".js_popup_content").each(function () {
                        var that = this;
                        YMaps.ready(function () {
                            $(".js_popup_content")
                                .addClass('for-map')
                                .html('<div id="ymap-' + id + '" style="width: 100%; height: 100%; z-index: 99999 !important;"></div>');
                            if (!latitude) {
                                var provider = "yandex#map";
                                if ($.data(document, 'yandexPeopleMaps')) {
                                    provider = "yandex#publicMap";
                                }
                                YMaps.geocode(addr, {
                                    // Ищем в пределах области карты
                                    //boundedBy: myMap.getBounds(),
                                    // Запрашиваем не более 20 результатов
                                    results:20,
                                    provider:provider
                                }).then(
                                    function (res) {
	                                    if (res.geoObjects.getLength()) {
	                                        var object = res.geoObjects.get(0);
	                                        var map = new YMaps.Map("ymap-" + id, {
	                                            // Центр карты
	                                            center:object.geometry.getCoordinates(),
	                                            // Коэффициент масштабирования
	                                            zoom:zoom,
	                                            // Тип карты
	                                            type:mapType,
	                                            // Поведение карты
	                                            behaviors:["default", "scrollZoom"]
	                                        });
	                                        addPlacemark(object.geometry.getCoordinates()[0], object.geometry.getCoordinates()[1], balloon_html, map);
	                                        addControls(map);
                                    }}, function (err) {
                                    }
                                );
                            }
                            else {
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
                        });
                    });
                    e.preventDefault();
                });
        });
    } catch (e) {
    }
});
$(document).ready(function () {
    $('input#bank_list_search_input').quicksearch('ul#banki_list_ul li.b-catalogue__elem', {
        'noResults': '.banki-list-not-found',
        'titleSelector': 'a.b-catalogue__elem-heading',
        'selector': '.item-description-address'
    });

    try {
        $(".j-popap_map").each(function () {
            var title = $(this).attr("title_map");
            $(this).popup({
                title:title,
                content:"",
                width:"",
                height:"400px",
                popuphide:function () {
                    $(".js_popup_content").removeClass('for-map');
                }
            }).bind("click", function (e) {
                var city = ($(this).attr("city_map")) ? ($(this).attr("city_map") + ", ") : "";
                var addr = city + $(this).attr("addr_map");

                // Если есть скрытые балун, то берем информацию из него
                var content = $(this).closest('.item_offer').find('.item_offer_balloon_content').html();
                if (!content)
                    content = addr;

                workClock = "";
                phones = "";

                $(".js_popup_content").each(function () {
                    var mapType = "yandex#map";
                    if ($.data(document, 'yandexPeopleMaps'))
                        mapType = "yandex#publicMap";
                    var zoom = 12;
                    if ($.data(document, 'yandexDefaultZoom'))
                            zoom = $.data(document, 'yandexDefaultZoom');

                    YMaps.ready(function () {
                        $(".js_popup_content")
                            .css({'width':'100%', 'margin':'0px', 'padding':'0px'})
                            .html('<div id="ymap" style="width: 100%; height: 100%; z-index: 99999 !important;"></div>');
                        var provider = "yandex#map";
                        if ($.data(document, 'yandexPeopleMaps')) {
                            provider = "yandex#publicMap";
                        }
                        YMaps.geocode(addr, {
                            results:20,
                            provider:provider
                        }).then(
                            function (res) {
                                var object = res.geoObjects.get(0);
                                var map = new YMaps.Map("ymap", {
                                    // Центр карты
                                    center:object.geometry.getCoordinates(),
                                    // Коэффициент масштабирования
                                    zoom:zoom,
                                    // Тип карты
                                    type:mapType,
                                    // Поведение карты
                                    behaviors:["default", "scrollZoom"]
                                });

                                map.controls
                                    .add('zoomControl')
                                    .add('scaleLine')
                                    .add('searchControl')
                                    .add('typeSelector');

                                var myPlacemark = new YMaps.Placemark(object.geometry.getCoordinates(), {
                                    balloonContentHeader: content
                                });
                                map.geoObjects.add(myPlacemark);
                                myPlacemark.balloon.open();

                            }, function (err) {
                            }
                        );
                    });
                });
                e.preventDefault();
            });
        });
    } catch (e) {
    }
});
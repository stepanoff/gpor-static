(function ($) {
    $.fn.map_items = function (opts) {
        opts = $.extend({}, $.fn.map_items.defaults, opts);
        return this.each(function () {
            $.fn.map_items.instances[$(this).attr('id')] = new MapItems(this, opts, $(this).attr('id'));
            return $.fn.map_items.instances[$(this).attr('id')];
        });
    };

    $.fn.map_items.instances = new Object();
    $.fn.map_items_refresh = function () {
    };

    // default options
    $.fn.map_items.defaults = {
        'itemClass':'item_offer',
        'popupContentClass':'js_popup_content',
        'scale':12,
        'width':500,
        'height':400,
        'title':'',
        'showAllItemsClass':false,
        'showAllItems':true
    };

    var MapItems = function (obj, o, instance_id) {

        mapItems = $(obj).find("." + o.itemClass);

        $(mapItems).popup({
            title:o.title,
            content:"",
            width:o.width + "px",
            height:o.height + "px"
        });

        $(mapItems).click(function () {
            mapItemsInitMap(this);
            return false;
        });

        if (o.showAllItemsClass) {
            allItemsLink = $(obj).find("." + o.showAllItemsClass);
            if ($(obj).find("." + o.showAllItemsClass).eq(0)) {
                $(allItemsLink).popup({
                    title:o.title,
                    content:"",
                    width:o.width + "px",
                    height:o.height + "px"
                });

                $(allItemsLink).click(function () {
                    mapItemsInitMap(false);
                    return false;
                });
            }
        }


        var mapItemsInitMap = function (object) {
            YMaps.ready(function () {
                var mapType = "yandex#map";
                if ($.data(document, 'yandexPeopleMaps'))
                    mapType = "yandex#publicMap";
                var zoom = 12;
                if ($.data(document, 'yandexDefaultZoom'))
                    zoom = $.data(document, 'yandexDefaultZoom');
                var provider = "yandex#map";
                if ($.data(document, 'yandexPeopleMaps')) {
                    provider = "yandex#publicMap";
                }

                $("." + o.popupContentClass)
                    .addClass('for-map')
                    .html('<div id="ymap" style="width: 100%; height: 100%; z-index: 99999 !important;"></div>');

                var firstPoint = false;

                if (object) {
                    currentObjectLng = $(object).attr("yandexmap_longitude");
                    currentObjectLat = $(object).attr("yandexmap_latitude");
                    currentObjectZoom = $(object).attr("yandexmap_zoom");
                }
                else {
                    currentObjectLng = false;
                    currentObjectLat = false;
                    currentObjectZoom = zoom;
                }

                var map = new YMaps.Map("ymap", {
                    // Центр карты
                    center:[0, 0],
                    // Коэффициент масштабирования
                    zoom:currentObjectZoom,
                    // Тип карты
                    type:mapType,
                    // Поведение карты
                    behaviors:["default"]
                });

                map.controls
                    .add('zoomControl')
                    .add('typeSelector')
                    .add('mapTools')
                    .add('miniMap')
                    .add('scaleLine');

                if (currentObjectLng && currentObjectLat)
                    map.setCenter([currentObjectLat, currentObjectLng]);

                if (o.showAllItems) {
                    $(mapItems).each(function () {
                        objectLng = $(this).attr("yandexmap_longitude");
                        objectLat = $(this).attr("yandexmap_latitude");
                        if (objectLng == currentObjectLng && objectLat == currentObjectLat)
                            return;

                        var objectPlacemark = new YMaps.Placemark([objectLat, objectLng], {
                            balloonContent:$(this).html()
                        });
                        map.geoObjects.add(objectPlacemark);

                        if (!firstPoint) {
                            firstPoint = objectPlacemark;
                        }
                    });
                }

                if (object) {
                    var objectPlacemark = new YMaps.Placemark([currentObjectLat, currentObjectLng], {
                        balloonContent:$(object).html()
                    });
                    map.geoObjects.add(objectPlacemark);
                    objectPlacemark.balloon.open();
                }
                else {
                    map.setCenter(firstPoint.geometry.getCoordinates());
                    firstPoint.balloon.open();
                }
            });
        };
    }
})(jQuery);
var YandexMapsSelectCoordinates =
{
    _defaultLatitude:0,
    _defaultLongitude:0,
    _defaultZoom:12,
    _placemarks:{},
    map:NaN,

    init:function(id)
    {
        $('#show-' + id).popup({
            title:"",
            content:"",
            width:"500px",
            height:"400px",
            popuphide:function()
            {
                YandexMapsSelectCoordinates.setZoom(id, YandexMapsSelectCoordinates.map.getZoom());
                $(".js_popup_content").removeClass('for-map');
            }
        }).bind("click", function(e)
        {
                var coords = YandexMapsSelectCoordinates.getCoordinates(id);
                var longitude = coords[0];
                var latitude = coords[1];
                var zoom = (isNaN(YandexMapsSelectCoordinates.getZoom(id))) ? YandexMapsSelectCoordinates._defaultZoom : YandexMapsSelectCoordinates.getZoom(id);

                var centerLongitude = (isNaN(coords[0])) ? YandexMapsSelectCoordinates._defaultLongitude : coords[0];
                var centerLatitude = (isNaN(coords[1])) ? YandexMapsSelectCoordinates._defaultLatitude : coords[1];

                // Создаем контейнер в котором будет лежать карта
                $(".js_popup_content")
                    .addClass('for-map')
                    .html('<div id="ymap-' + id + '" style="width: 100%; height: 100%; z-index: 99999 !important;"></div>');

                var mapType = "yandex#map";
                if ($.data(document, 'yandexPeopleMaps'))
                    mapType = "yandex#publicMap";

                YMaps.ready(function()
                {
                    YandexMapsSelectCoordinates.initMap(id, centerLatitude, centerLongitude, zoom, mapType);
                    if (!isNaN(latitude) && !isNaN(longitude))
                        YandexMapsSelectCoordinates.placemarkAdd(id, latitude, longitude);
                });
            });

        $('#del-' + id).confirmPopup({
            title:"Удалить точку ?",
            confirm_action:function()
            {
                YandexMapsSelectCoordinates.setCoordinates(id, '', '');
                YandexMapsSelectCoordinates.setZoom(id, '');
                var placemark = YandexMapsSelectCoordinates._placemarks[id];
                if (placemark)
                    delete YandexMapsSelectCoordinates._placemarks[id];
                $(document).trigger('yandexMapEvent_remove');
            }
        });

        var recalcElem = $('#recalc-' + id);
        if (recalcElem)
        {
            recalcElem.confirmPopup({
                title:"Пересчитать координаты ?",
                confirm_action:function()
                {
                    $(document).trigger('yandexMapEvent_recalc');
                }
            });
        }

        YandexMapsSelectCoordinates.toogleDeleteButton(id);
    },

    initMap:function(id, centerLatitude, centerLongitude, zoom, mapType)
    {
        var map = new YMaps.Map("ymap-" + id,
        {
            // Центр карты
            center:[centerLatitude, centerLongitude],
            // Коэффициент масштабирования
            zoom:zoom,
            // Тип карты
            type:mapType,
            // Поведение карты
            behaviors:["default", "scrollZoom"]
        });
        map.controls
            // Кнопка изменения масштаба
            .add('zoomControl')
            // Список типов карты
            .add('typeSelector');

        // Обработка события, возникающего при щелчке
        // левой кнопкой мыши в любой точке карты.
        // При возникновении такого события поставим метку, если ее еще нет.
        map.events.add('click', function(e)
        {
            if (!YandexMapsSelectCoordinates._placemarks[id])
            {
                var coords = e.get('coordPosition');
                YandexMapsSelectCoordinates.placemarkAdd(id, coords[0], coords[1]);
                $(document).trigger('yandexMapEvent_add', coords);
            }
        });
        // Передаем готовую карту в свойство объекта
        this.map = map;
    },

    placemarkAdd:function(id, latitude, longitude)
    {
        var self = this;
        var myPlacemark = new YMaps.Placemark([latitude, longitude], {
            hintContent:'Подвинь меня!'
        }, {
            draggable:true // Метку можно перетаскивать, зажав левую кнопку мыши.
        });
        myPlacemark.events.add('dragend', function(e)
        {
            var coords = this.geometry.getCoordinates();
            self.setCoordinates(id, coords[0], coords[1]);
            self.setZoom(id, self.map.getZoom());
        }, myPlacemark);

        this.map.geoObjects.add(myPlacemark);

        this._placemarks[id] = myPlacemark;
        this.setCoordinates(id, latitude, longitude);
        this.setZoom(id, this.map.getZoom());

    },

    getCoordinates:function(id)
    {
        var latitude = parseFloat($('#latitude-' + id).val());
        var longitude = parseFloat($('#longitude-' + id).val());
        return new Array(longitude, latitude);
    },

    setCoordinates:function(id, latitude, longitude)
    {
        $('#latitude-' + id).val(latitude);
        $('#longitude-' + id).val(longitude);
        this.toogleDeleteButton(id);
    },

    toogleDeleteButton:function(id)
    {
        var coords = this.getCoordinates(id);
        if (isNaN(coords[0]))
            $('#del-' + id).hide();
        else
            $('#del-' + id).show();
    },

    getZoom:function(id)
    {
        return  parseInt($('#zoom-' + id).val());
    },

    setZoom:function(id, val)
    {
        $('#zoom-' + id).val(val);
        this.toogleDeleteButton(id);
    }

};
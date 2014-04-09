var miniConverter = null;
$(document).ready(function() {
    
    var map, fullScreen = false;

    // Шаблон строки с картой
    var templateMap = '<tr class="b-bank-exchange-table__row exchange-table__row_map"><td class="b-bank-exchange-table__cell" colspan="6"><div id="ya-map-bank-office" class="b-bank-exchange-table__map"></div></td></tr>';

    // Инициализация объекта для мелких конвертеров
    miniConverter = new currencyConverter({
        'sourceInputSelector': '.mini-converter-sInput',
        'resultContainer': '.mini-converter-rSpan',
        'mainCurrencySelector': '.mini-converter-mainCurrency',
        'sourceCurrencySelector': '.mini-converter-sourceCurrency',
        'resultCurrencySelector': '.mini-converter-resultCurrency',
        'currencyUpdateUrl': $('#updateCurrencyRatesUrl').val()
    });
    window.setTimeout(function(){
        if (typeof converter == 'object' && converter != null) {
            miniConverter.additionalConverter = converter;
        }
    }, 1000);
    
    
    // Удаление карт при сортировке
    $(".b-bank-exchange-table__wrap thead tr th").on("click", function() {
        $(".exchange-table__row_map").remove();
        $(".b-bank-exchange-table__wrap").find(".opened").removeClass("opened");
    });
    
    // Открытие карты
    $(".b-bank-exchange-table__wrap td").on("click", function() {
        if ($(this).parent().hasClass("opened")) {
            $(this).parent().next().remove();
            $(this).parent().removeClass("opened");
        } else {
            $(".exchange-table__row_map").remove();
            $(".b-bank-exchange-table__wrap").find(".opened").removeClass("opened");

            $(this).parent().addClass("opened");
            $(this).parent().after(templateMap);

            // Инициализация объекта карты
            var bank_id = $(this).parent('tr').find('.bank-info-link').attr('bank_id');
            $('#bankRow_' + bank_id).bank_currency_map_items({
                'mapId': 'ya-map-bank-office',
                'parentContainer': $('#bankRow_' + bank_id),
                'itemClass': 'j-bank-item-office',
                'itemAddressClass': 'b-banking-adress__list-link',
                'lat': $.data(document, 'yandexDefaultLatitude'),
                'lng': $.data(document, 'yandexDefaultLongitude'),
                'scale': 12,
                'pmap': $.data(document, 'yandexPeopleMaps'),
                'height': 320,
                'updateCenter': true
            });
        }
        return false;
    });
            
    // Включение сортировки таблицы
    $(".b-bank-exchange-table__wrap").tablesorter({
        sortList: [[0,0]],
        headers: {
            5: { 
                sorter: false
            },
            6: {
                sorter: false
            } 
        },
        textExtraction: function(node) {
            var s = $(node).find('span');
            if (s.hasClass('desc')) {
                return 0 - parseFloat(s.html());
            }
            return s.html();
        }
    });

    $.fn.bank_currency_map_items = function (opts) {
        opts = $.extend({}, $.fn.bank_currency_map_items.defaults, opts);
        return this.each(function () {
            $.fn.bank_currency_map_items.instances[$(this).attr('id')] = new BankExchangeMapItems(this, opts, $(this).attr('id'));
            return $.fn.bank_currency_map_items.instances[$(this).attr('id')];
        });
    };

    $.fn.bank_currency_map_items.instances = new Object();
    $.fn.bank_currency_map_items_refresh = function () {
    };

    // default options
    $.fn.bank_currency_map_items.defaults = {
        'mapId': 'ya-map-search',
        'parentContainer': null,
        'itemClass': 'item_offer',
        'itemAddressClass': 'item_offer_address',
        'lat': $.data(document, 'yandexDefaultLatitude'),
        'lng': $.data(document, 'yandexDefaultLongitude'),
        'scale': $.data(document, 'yandexDefaultZoom'),
        'height': 800,
        'updateCenter': false
    };

    var BankExchangeMapItems = function (obj, o, instance_id) {
        $("#" + o.mapId).each(function () {
            var left_height = 0;
            left_height = o.height;
            $(this).css({height: left_height + "px"});
        });

        YMaps.ready(function () {
            var mapType = "yandex#map";
            if ($.data(document, 'yandexPeopleMaps'))
                mapType = "yandex#publicMap";

            // Инициализация карты
            var map = new YMaps.Map(o.mapId, {
                center: [o.lat, o.lng],
                zoom: o.scale,
                type: mapType,
                behaviors: ["default", "scrollZoom"]
            });
            map.controls
                .add('zoomControl')
                .add('typeSelector')
                .add('mapTools')
                .add(new YMaps.control.MiniMap({ type: 'yandex#map', expanded: false}))
                .add('scaleLine');



            // Инициализация обработчиков наведения на элементы списка
            var points = new Array();
            if (o.parentContainer) {
                var $items = $(o.parentContainer).find('.' + o.itemClass);
            } else {
                var $items = $('.' + o.itemClass);
            }

            $items.each(function () {
                var self = $(this);
                var addrEl = self.find("." + o.itemAddressClass);
                var address = addrEl.attr('addr_map');
                var isPartnerBank = self.find(".card-bank-partner_bank").size();
                var mark_type = isPartnerBank ? {
                    iconImageSize: [37, 42],
                    iconImageOffset: [-9, -29],
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
                                var placemark = new YMaps.Placemark(coords, {
                                    balloonContentHeader: addrEl.attr('title_map')
                                }, mark_type);
                                placemark.events.add('balloonopen', function(event) {
                                    $.ajax({
                                        url: $('#getOfficeBalloonUrl').val(),
                                        data: 'office_id=' + addrEl.attr('office_id'),
                                        dataType:'json',
                                        success: function(data) {
                                            if (!data.status) {
                                                return false;
                                            }
                                            placemark.properties.set('balloonContent', data.content);
                                            if (typeof miniConverter == 'object' && miniConverter != null) {
                                                converter.additionalConverter = miniConverter;
                                                miniConverter.sourceCurrencyWrapper = $('.mini-converter-sCurrencyList').parent('.b-valute-converter-more');
                                                miniConverter.resultCurrencyWrapper = $('.mini-converter-rCurrencyList').parent('.b-valute-converter-more');
                                                miniConverter.parentContainerSelector = '#miniContainer_' + addrEl.attr('office_id');
                                                miniConverter.updateCurrencyRates(addrEl.attr('bank_id'), addrEl.attr('office_id'), true);
                                                bind_mini_converter_links();
                                            } 
                                        }
                                    })                                 
                                })
                                map.geoObjects.add(placemark);
                                if (o.updateCenter) {
                                    o.updateCenter = false;
                                    map.setCenter(coords);
                                    placemark.balloon.open();
                                }

                                var lat = coords[0];
                                var lng = coords[1];

                                pointId = lat + "_" + lng;
                                self.attr("pointId", pointId);
                                points[pointId] = placemark;
                            }
                        },
                        function (err) {
                        }
                    );
                })();
            });
        });
    };   

    // Назначем вновь прибывшему мелкому конвертеру действия на его кнопки
    function bind_mini_converter_links()
    {
        $('.mini-converter-sInput').on('input', function() {
            var $this = $(this),
                val = $this.val().replace(/[^\d\.]/g, '').replace(',', '.');

            $this.val(val);
            if (typeof miniConverter == 'object' && miniConverter != null) {
                miniConverter.convert();
            }
        });

        $('.mini-converter-switch').click(function() {
            var balloon = $(this).parents('div.mini-container-bank');
            var r = null;
            var t = balloon.find('.mini-converter-sourceCurrency').val();
            balloon.find('.mini-converter-sourceCurrency').val(balloon.find('.mini-converter-resultCurrency').val());
            balloon.find('.mini-converter-resultCurrency').val(t);

            t = balloon.find('.mini-converter-sCurrencyList li.b-more__elem_cur a').attr('rel');
            r = balloon.find('.mini-converter-rCurrencyList li.b-more__elem_cur a').attr('rel');
            balloon.find('.mini-converter-rCurrencyList li').removeClass('b-more__elem_cur').show();
            balloon.find('.mini-converter-sCurrencyList li').removeClass('b-more__elem_cur').show();

            balloon.find('.mini-converter-sCurrencyList a[rel=' + r + ']').parent('li').addClass('b-more__elem_cur').hide();
            balloon.find('.mini-converter-rCurrencyList a[rel=' + r + ']').parent('li').addClass('b-more__elem_cur').hide();

            t = balloon.find('.mini-converter-sourceCurrencyLink').html();
            balloon.find('.mini-converter-sourceCurrencyLink').html(balloon.find('.mini-converter-resultCurrencyLink').html());
            balloon.find('.mini-converter-resultCurrencyLink').html(t);

            if (typeof miniConverter == 'object' && miniConverter != null) {
                miniConverter.convert();
            }

            return false;
        });

        $('.mini-converter-currencySelector a').click(function() {
            var balloon = $(this).parents('div.mini-container-bank');
            var containter = $(this).parents('div.b-valute-converter-more');

            containter.find('.b-more__elem').removeClass('b-more__elem_cur');
            $(this).parent('li').addClass('b-more__elem_cur');

            containter.find('.b-more__visible').html($(this).html());

            if (containter.find('ul').hasClass('mini-converter-rCurrencyList')) {
                balloon.find('.mini-converter-resultCurrency').val($(this).attr('rel'));
            }
            if (containter.find('ul').hasClass('mini-converter-sCurrencyList')) {
                balloon.find('.mini-converter-sourceCurrency').val($(this).attr('rel'));
            }

            if (typeof miniConverter == 'object' && miniConverter != null) {
                miniConverter.convert();
            }

            return false;
        });
    }
});
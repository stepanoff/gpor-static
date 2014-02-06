$(document).ready(function () {

    function credit_button(begin) {
        $("a.bank-button_credit").each(function () {
            parent_width = $(this).attr("offsetWidth");
            $("div.bank-button_credit-center").css("width", parent_width - 37 + "px");
        });
    }

    $(window).resize(function () {
        credit_button();
    });

    $("a.bank-button_credit").each(function () {
        parent_width = $(this).attr("offsetWidth");
        $("div.bank-button_credit-center").css("width", parent_width - 36 + "px");
    });

    $(".card-bank-table-filter a").bind("click", function () {
        $(this).parent().find("a").removeClass("card-bank-table-filter-cur").removeClass("rc3").removeClass("inline-block");
        $(this).addClass("card-bank-table-filter-cur").addClass("rc3").addClass("inline-block");
    });

    $(".banki_wrap_bank-bottom a").focus(function () {
        $(this).blur();
    });

    try {
        var banki_card_printmap = $("#banki-card-printmap");
        var banki_printversion = $(".banki_printversion .addr").text();
        if (banki_card_printmap && banki_printversion) {
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

                YMaps.geocode(banki_printversion, {
                    results:1,
                    provider:provider
                }).then(
                    function (res) {
                        if (res.geoObjects.getLength()) {
                            var object = res.geoObjects.get(0);
                            var placemark = new YMaps.Placemark(object.geometry.getCoordinates());

                            var map = new YMaps.Map("banki-card-printmap", {
                                // Центр карты
                                center:object.geometry.getCoordinates(),
                                // Коэффициент масштабирования
                                zoom:zoom,
                                // Тип карты
                                type:mapType,
                                // Поведение карты
                                behaviors:["default"]
                            });

                            map.geoObjects.add(placemark);
                        }
                    }, function (err) {
                    }
                );
            });
        }
    } catch (e) {
    }

    $(".placeholder").each(function () {
        $(this).bind("focusin", function () {
            var jthis = $(this);
            if (jthis.attr("pre_value") == jthis.attr("value")) {
                jthis.attr("value", "");
            }
        });
        $(this).bind("focusout", function () {
            var jthis = $(this);
            if (!jthis.attr("value")) {
                jthis.attr("value", jthis.attr("pre_value"));
            }
        });
    });

    /* Программа банков: переключение вкладок */

    $('.banks-programms').css("display", "block");

    // табики
    var tab_credit = $(".banks-programms-tab-credit");
    var tab_contribution = $(".banks-programms-tab-contribution");
    var tab_private = $(".banks-programms-tab-private");
    var tab_business = $(".banks-programms-tab-business");
    var sel_private = $("#banks-programms-credit-private-select");
    var private_credit_forms = $(".banks-programms-credit-private-form");

    //s вкладки
    var deals = [$(".banks-programms-credit-private"), $(".banks-programms-credit-business"),
        $(".banks-programms-contribution-private"), $(".banks-programms-contribution-business")];

    // переключение контента во вкладках
    function showDeal(pos) {
        $(deals).each(function (i) {
            if (i == pos) {
                deals[i].css("display", "block");
            } else {
                deals[i].css("display", "none");
            }
        });
    }

    // возвращает истину, если находимся во вкладке кредиты
    function isCredit() {
        return $(".banks-programms__oneprog-list").children("li").eq(0).hasClass('cur-');
    }

    // возвращает истину, если находимся во вкладке частным лицам
    function isPrivate() {
        return $(".banks-programms__auditory-list").children("li").eq(0).hasClass('cur-');
    }

    function changePrivateCredit(val) {
        id = "banks-programms-credit-private-form-" + val;
        $(private_credit_forms).hide();
        $("#" + id).show();
    }

    val = $(sel_private).val();
    changePrivateCredit(val);

    // выбор типа кредита
    sel_private.bind('change', function () {
        val = $(this).val();
        changePrivateCredit(val);
    });

    // установка текущей вкладки
    function setCurrent(elemClick) {
        var tabElem = $(elemClick).parents("li").eq(0);
        tabElem.parents().eq(0).children().removeClass("cur-");
        tabElem.addClass("cur-");
    }

    // вкладка Кредиты
    tab_credit.bind("click", function () {
        setCurrent(this);
        if (isPrivate()) {
            showDeal(0);
        } else {
            showDeal(1);
        }
    });

    // вкладка Вклады
    tab_contribution.bind("click", function () {
        setCurrent(this);
        if (isPrivate()) {
            showDeal(2);
        } else {
            showDeal(3);
        }
    });

    // для частных лиц
    tab_private.bind("click", function () {
        setCurrent(this);
        if (isCredit()) {
            showDeal(0);
        } else {
            showDeal(2);
        }
    });

    // для бизнеса
    tab_business.bind("click", function () {
        setCurrent(this);
        if (isCredit()) {
            showDeal(1);
        } else {
            showDeal(3);
        }
    });
    credit_button(true);


    try {
        $(".j-popap_map").each(function () {
            /*
             /* @zakiroff: 15.10.2010 убрал ширину в 500 пикс из-за недостатка ширины карты в попапе для банков.
             */
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
                    var zoomAttr = city + $(this).attr("zoom");

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
                                .html('<div id="ymap-' + id + '" style="width: 100%; height: 100%; z-index: 99999 !important;"></div>');
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

                                    map.controls
                                            .add('zoomControl')
                                            .add('typeSelector')
                                            .add('mapTools')
                                            .add('miniMap')
                                            .add('trafficControl')
                                            .add('scaleLine');

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
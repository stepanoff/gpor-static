$(document).ready(function() {
    var allow_scroll = false;
    var timer = null;

    $('.j-map-item-cash').mouseenter(function(e) {
        if (!timer) {
            timer = setTimeout(function() {
                allow_scroll = true;
            }, 2000);
        }
    })

    $('.b-banking-adress__list').bind('mousewheel DOMMouseScroll', function(e) {
        if (allow_scroll) {
            return true;
        }

        var scrollTo = null;

        if (e.type == 'mousewheel') {
            scrollTo = (e.originalEvent.wheelDelta * -1);
        }
        else if (e.type == 'DOMMouseScroll') {
            scrollTo = 40 * e.originalEvent.detail;
        }

        if (scrollTo) {
            e.preventDefault();
            $(window).scrollTop(scrollTo + $(window).scrollTop());
        }
    });

    $(window).scroll(function() {
        if (timer) {
            clearTimeout(timer);
            timer = null;   
        }
        allow_scroll = false;
    });
    
    $(".j-tabs__item").on("click", function() {
        $(this).parent().find(".b-tabs__item").removeClass("b-tabs__item_active");
        $(this).addClass("b-tabs__item_active");

        var link = $(this).find('a.b-tabs__item__link');
        $('.' + link.attr('rel')).hide();
        $(link.attr('href')).show();

        $(window).resize();

        return false;
    });

    $('#tab_cash').bank_card_map_items({
        'mapId': 'ya-map-search-cash',
        'listClass': 'b-banking-adress__list',
        'containerClass': 'bank-card-cashoffice',
        'parentContainerId': 'card_map_wrapper_cash',
        'itemClass': 'j-map-item-cash',
        'activeItemClass': 'b-banking-adress__list-item_active',
        'itemAddressClass': 'b-banking-adress__list-link',
        'itemLinkClass': 'b-banking-adress__list-link',
        'itemBalloonClass': 'item_offer_balloon_content',
        'lat': $.data(document, 'yandexDefaultLatitude'),
        'lng': $.data(document, 'yandexDefaultLongitude'),
        'scale': 12,
        'pmap': $.data(document, 'yandexPeopleMaps'),
        'height': 600
    });

    $('#tab_office').bank_card_map_items({
        'mapId': 'ya-map-search-office',
        'listClass': 'b-banking-adress__list',
        'containerClass': 'bank-card-cashoffice',
        'parentContainerId': 'card_map_wrapper_office',
        'itemClass': 'j-map-item-office',
        'activeItemClass': 'b-banking-adress__list-item_active',
        'itemAddressClass': 'b-banking-adress__list-link',
        'itemLinkClass': 'b-banking-adress__list-link',
        'itemBalloonClass': 'item_offer_balloon_content',
        'lat': $.data(document, 'yandexDefaultLatitude'),
        'lng': $.data(document, 'yandexDefaultLongitude'),
        'scale': 12,
        'pmap': $.data(document, 'yandexPeopleMaps'),
        'height': 600
    });
});
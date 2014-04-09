var converter = null;
$(document).ready(function() {
    
    var $inputToFormat = $('#sInput');
    var yMapLoaded = false;

    // Инициализация объекта главного конвертера валют
    converter = new currencyConverter({
        'sourceInputSelector': '#sInput',
        'resultContainer': '#rSpan',
        'mainCurrencySelector': '#mainCurrency',
        'sourceCurrencySelector': '#sourceCurrency',
        'resultCurrencySelector': '#resultCurrency',
        'currencyUpdateUrl': $('#updateCurrencyRatesUrl').val()
    });
    converter.sourceCurrencyWrapper = $('#sCurrencyList').parent('div.b-valute-converter-more');
    converter.resultCurrencyWrapper = $('#rCurrencyList').parent('div.b-valute-converter-more');
    
    var current_bank_id = $('.bank-selector li.b-more__elem_cur a').attr('rel');
    converter.updateCurrencyRates(current_bank_id ? current_bank_id : 0);

    // Autocomplete для списка банков
    $('input#bank_ac_input').quicksearch('ul#bank_ac_container li', {
        'noResults': '#bank_ac_not_found'
    });
    
    // Форматирование суммы для конвертации при вводе и отправка ее туда
    $inputToFormat.on('input', function() {
        var $this = $(this),
            val = $this.val().replace(/[^\d\.,]/g, '').replace(',', '.');

        $this.val(val);
        if (typeof converter == 'object' && converter != null) {
            converter.convert();
        }
    });

    // Смена валюты из выпадающего списка
    $('.currency-selector a').click(function() {
        var containter = $(this).parents('div.b-valute-converter-more');

        containter.find('.b-more__elem').removeClass('b-more__elem_cur');
        $(this).parent('li').addClass('b-more__elem_cur');

        containter.find('.b-more__visible').html($(this).html());

        if (containter.find('ul').attr('id') == 'rCurrencyList') {
            $('#resultCurrency').val($(this).attr('rel'));
        }
        if (containter.find('ul').attr('id') == 'sCurrencyList') {
            $('#sourceCurrency').val($(this).attr('rel'));
        }

        if (typeof converter == 'object' && converter != null) {
            converter.convert();
        }

        updateBestCurrencyRates();

        return false;
    });

    // Смена банка из выпадающего списка
    $('.bank-selector a').click(function() {
        var bank_id = $(this).attr('rel');
        var container = $(this).parents('div.b-valute-converter-more');

        container.find('.b-more__elem').removeClass('b-more__elem_cur');
        $(this).parent('li').addClass('b-more__elem_cur');
        container.find('a.b-more__visible').html($(this).html());

        if (typeof converter == 'object' && converter != null) {
            converter.updateCurrencyRates(bank_id);
        }

        return false;
    });

    // Кнопка "Поменять местами" валюты
    $('#switchCurrency').click(function() {
        var r = null;
        var t = $('#sourceCurrency').val();
        $('#sourceCurrency').val($('#resultCurrency').val());
        $('#resultCurrency').val(t);

        t = $('#sCurrencyList li.b-more__elem_cur a').attr('rel');
        r = $('#rCurrencyList li.b-more__elem_cur a').attr('rel');
        $('#sCurrencyList li').removeClass('b-more__elem_cur');
        $('#rCurrencyList li').removeClass('b-more__elem_cur');

        $('#sCurrencyList a[rel=' + r + ']').parent('li').addClass('b-more__elem_cur');
        $('#rCurrencyList a[rel=' + t + ']').parent('li').addClass('b-more__elem_cur');

        t = $('#sCurrencyLink').html();
        $('#sCurrencyLink').html($('#rCurrencyLink').html());
        $('#rCurrencyLink').html(t);

        if (typeof converter == 'object' && converter != null) {
            converter.convert();
        }

        updateBestCurrencyRates();

        return false;
    });

    // Выбор Лучшего предложения
    $('.select-best-bank').click(function() {
        var bank_id = $(this).attr('rel');
        var bank_container = $('.bank-selector').parents('div.b-valute-converter-more');
        var bank_row_link = bank_container.find('a[rel=' + bank_id +']');

        if (bank_row_link) {
            bank_container.find('.b-more__elem').removeClass('b-more__elem_cur');
            bank_row_link.parent('li').addClass('b-more__elem_cur');
            bank_container.find('a.b-more__visible').html(bank_row_link.html());
        }

        if (typeof converter == 'object' && converter != null) {
            converter.updateCurrencyRates(bank_id);
        }

        return false;
    });

    // Выбор банка с лучшим предложением
    $('.best-bank-name').click(function() {
        var bank_id = $(this).attr('rel');
        $('#bankRow_' + bank_id + ' td:first').click();
        $('html, body').animate({
            scrollTop: $('#bankRow_' + bank_id).offset().top - 50
        }, 1000);

        return false;
    })

    // Обновление лучших предложений
    function updateBestCurrencyRates() {
        $.ajax({
            url: $('#bestCurrencyRatesUrl').val(),
            dataType: 'json',
            data: 'sCurrency=' + $('#sourceCurrency').val() + '&' +'rCurrency=' + $('#resultCurrency').val() + '&',
            success: function(data) {
                if (!data.status) {
                    $('.b-valute-best-course').hide();
                    return false;
                }
                $('.b-valute-best-course').show();
                $('#best_bye_rate a.best-bank-name').html(data.bye.bank_name);
                $('#best_bye_rate a.best-bank-name').attr('rel', data.bye.bank_id);
                $('#best_bye_rate a.best-bank-name').attr('href', data.bye.bank_url);
                $('#best_bye_rate a.select-best-bank').attr('rel', data.bye.bank_id);
                $('#best_bye_rate span.currency-rate-span').html(data.bye.currency);

                $('#best_sale_rate a.best-bank-name').html(data.sale.bank_name);
                $('#best_sale_rate a.best-bank-name').attr('rel', data.sale.bank_id);
                $('#best_sale_rate a.best-bank-name').attr('href', data.sale.bank_url);
                $('#best_sale_rate a.select-best-bank').attr('rel', data.sale.bank_id);
                $('#best_sale_rate span.currency-rate-span').html(data.sale.currency);
            }
        });
    }

    // Переключение табов
    $(".j-tabs__item").on("click", function () {
        $(this).parent().find(".b-tabs__item").removeClass("b-tabs__item_active");
        $(this).addClass("b-tabs__item_active");

        var link = $(this).find('a.b-tabs__item__link');
        var tab_name = link.attr('href');

        $('.' + link.attr('rel')).hide();
        $(tab_name).show();

        if (tab_name == '#exchange_map' && !yMapLoaded) {
            yMapLoaded = true;
            $(tab_name).bank_currency_map_items({
                'mapId': 'ya-map-search-office',
                'parentContainer': '#exchange_map',
                'itemClass': 'j-map-item-office',
                'itemAddressClass': 'b-banking-adress__list-link',
                'lat': $.data(document, 'yandexDefaultLatitude'),
                'lng': $.data(document, 'yandexDefaultLongitude'),
                'scale': 14,
                'pmap': $.data(document, 'yandexPeopleMaps')
            });
        }

        return false;
    });

    function formatNumber(s) {
        return s.split('').reverse().join('').match(/.{1,3}/g).join(' ').split('').reverse().join('');
    }
});

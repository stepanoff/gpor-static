currencyConverter = function(options) {
    var defaults = {
        'sourceInputSelector': '',
        'resultContainer': '',
        'mainCurrencySelector': null,
        'sourceCurrencySelector': null,
        'resultCurrencySelector': null,
        'currencyUpdateUrl': null
    }
    var o = $.extend({}, defaults, options);

    // Курсы текущих валют
    this.currencyRatesBye = {};
    this.currencyRatesSale = {};

    // Ключи текущих валют
    this.mainCurrency = null;
    this.sourceCurrency = null;
    this.resultCurrency = null;

    // Родительский блок конвертера
    this.parentContainerSelector = null;

    // Дополнительный конвертер
    this.additionalConverter = null;

    // Текущая сумма
    this.sourceSum = null;

    // Контейнеры со списками выбора валют
    this.sourceCurrencyWrapper = null;
    this.resultCurrencyWrapper = null;

    /**
     * Конвертирование
     * @param bool updateAdditional Обновлять ли также дополнительный конвертер
    */
    this.convert = function(updateAdditional) {
        if (updateAdditional == undefined) {
            updateAdditional = true;
        }

        this.initCurrency();
        if (this.parentContainerSelector) {
            $s = parseFloat($(this.parentContainerSelector).find(o.sourceInputSelector).val().replace(' ', ''));
        } else {
            $s = parseFloat($(o.sourceInputSelector).val().replace(' ', ''));
        }
        if (!$s) {
            $(o.resultContainer).html('');
            return false;
        }

        this.sourceSum = $s;

        $r = 0;
        if (this.resultCurrency == this.sourceCurrency) {
            $r = $s;
        } else if (this.resultCurrency == this.mainCurrency) {
            $r = $s * this.currencyRatesBye[this.sourceCurrency];
        } else if (this.sourceCurrency == this.mainCurrency) {
            $r = $s / this.currencyRatesSale[this.resultCurrency];
        } else {
            $t = $s * this.currencyRatesBye[this.sourceCurrency];
            $r = $t / this.currencyRatesSale[this.resultCurrency];
        }

        if (this.parentContainerSelector) {
            $rContainer = $(this.parentContainerSelector).find(o.resultContainer);
        } else {
            $rContainer = $(o.resultContainer);
        }

        if (isNaN($r)) {
            $rContainer.html('');
        } else {
            $rContainer[0].innerHTML = this.numberFormat(Math.round(parseFloat($r) * 100) / 100);
        }

        if (updateAdditional && this.additionalConverter) {
            this.updateAdditionalConverter();
        }
    }

    /**
     * Обновление курсов валют с сервера
     * @param int bank_id
     * @param int office_id
     * @param bool additionalConvert = false
     *      true - данные заберутся с дополнительного конвертера
     *      false - в дополнительный конвертер передадутся данные текущего
    */
    this.updateCurrencyRates = function(bank_id, office_id, additionalConvert) {
        if (!o.currencyUpdateUrl) {
            return false;
        }
        if (office_id == undefined) {
            office_id = false;
        }
        if (additionalConvert == undefined) {
            additionalConvert = false;
        }

        var $this = this;
        var data = 'bank_id=' + bank_id + (office_id ? '&office_id=' + office_id : '');
        $.ajax({
            url: o.currencyUpdateUrl,
            dataType: 'json',
            data: data,
            success: function(data) {
                if (!data.status) {
                    return;
                }
                $this.currencyRatesBye = data.bye;
                $this.currencyRatesSale = data.sale;
                if (additionalConvert) {
                    $this.additionalConverter.convert();
                } else {
                    $this.convert();
                }
            }
        });
    }

    /**
     * Инициализация ключей текущих валют
    */
    this.initCurrency = function() {
        if (this.parentContainerSelector) {
            this.mainCurrency = $(this.parentContainerSelector).find(o.mainCurrencySelector).val();
            this.sourceCurrency = $(this.parentContainerSelector).find(o.sourceCurrencySelector).val();
            this.resultCurrency = $(this.parentContainerSelector).find(o.resultCurrencySelector).val();
        } else {
            this.mainCurrency = $(o.mainCurrencySelector).val();
            this.sourceCurrency = $(o.sourceCurrencySelector).val();
            this.resultCurrency = $(o.resultCurrencySelector).val();
        }
    }

    /**
     * Обновление дополнительного конвертера
    */
    this.updateAdditionalConverter = function() {
        $(this.additionalConverter.getOption('sourceCurrencySelector')).val(this.sourceCurrency);
        $(this.additionalConverter.getOption('resultCurrencySelector')).val(this.resultCurrency);
        $(this.additionalConverter.getOption('sourceInputSelector')).val(this.sourceSum);

        this.additionalConverter.convert(false);
        this.additionalConverter.updateCurrencyLists();
    }

    /**
     * Обновление списков и ссылок валют в соответствии с текущими ключами
    */
    this.updateCurrencyLists = function() {
        var sCurrencyList = this.sourceCurrencyWrapper.find('ul');
        sCurrencyList.find('li').removeClass('b-more__elem_cur').show();
        var text = sCurrencyList.find('a[rel="' + this.sourceCurrency + '"]').html();
        sCurrencyList.find('a[rel="' + this.sourceCurrency + '"]').parent('li').addClass('b-more__elem_cur');
        this.sourceCurrencyWrapper.find('a.b-more__visible').html(text);

        var rCurrencyList = this.resultCurrencyWrapper.find('ul');
        rCurrencyList.find('li').removeClass('b-more__elem_cur').show();
        var text = rCurrencyList.find('a[rel="' + this.resultCurrency + '"]').html();
        rCurrencyList.find('a[rel="' + this.resultCurrency + '"]').parent('li').addClass('b-more__elem_cur');
        this.resultCurrencyWrapper.find('a.b-more__visible').html(text);
    }

    this.getOption = function(key) {
        return o[key];
    }

    this.numberFormat = function(number, decimals, dec_point, thousands_sep) {
        var i, j, kw, kd, km;

        if( isNaN(decimals = Math.abs(decimals)) ){
            decimals = 2;
        }
        if( dec_point == undefined ){
            dec_point = ".";
        }
        if( thousands_sep == undefined ){
            thousands_sep = " ";
        }

        i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

        if( (j = i.length) > 3 ){
            j = j % 3;
        } else{
            j = 0;
        }

        km = (j ? i.substr(0, j) + thousands_sep : "");
        kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
        kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");

        return km + kw + kd;
    }
}
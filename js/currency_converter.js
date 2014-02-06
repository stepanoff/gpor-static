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

    this.currencyRatesBye = {};
    this.currencyRatesSale = {};

    this.mainCurrency = null;
    this.sourceCurrency = null;
    this.resultCurrency = null;

    this.parentContainerSelector = null;

    this.convert = function() {
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
    }

    this.updateCurrencyRates = function(bank_id) {
        if (!o.currencyUpdateUrl) {
            return false;
        }
        var $this = this;
        $.ajax({
            url: o.currencyUpdateUrl,
            dataType: 'json',
            data: 'bank_id=' + bank_id,
            success: function(data) {
                if (!data.status) {
                    return;
                }
                $this.currencyRatesBye = data.bye;
                $this.currencyRatesSale = data.sale;
                $this.convert();
            }
        });
    }

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
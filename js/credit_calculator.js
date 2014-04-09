creditCalculator = function(options)
{
    var defaults = {
        'form': '',
        'permonthResult': '',
        'overpayResult': '',
        'resultInfoClass': '',
        'resultCurrencyClass': '',
        'resultErrorClass': '',
        'ajaxLoader': ''
    }
    var self = this;
    var o = $.extend({}, defaults, options);

    self.monthPayment = false;
    self.overpayment = false;
    self.currencyWord = false;

    self.ajaxRequest = null;

    self.init = function()
    {
        $(o.resultInfoClass).hide();
        $(o.resultErrorClass).hide();

        $(o.form).find('input[type="text"]').on('input', self.validate);
        //$(o.form).find('input[type="text"]').change(self.calculate);
        $(o.form).find('input[type="checkbox"]').change(self.calculate);
        $(o.form).find('select').change(self.calculate);

        $('.js-format-thousands').each(function() {
            var value = $(this).val();
            if (value) {
                $(this).val(self.formatThousands(value));
            }
        })

        self.calculate();
    }

    // Непосредственно расчет
    self.calculate = function()
    {
        $(o.resultErrorClass).hide();
        $(o.resultInfoClass).hide();
        $(o.ajaxLoader).show();

        var form = $(o.form);

        if (self.ajaxRequest) {
            self.ajaxRequest.abort();
        }

        self.ajaxRequest = $.ajax({
            url: form.attr('action'),
            data: form.serialize(),
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    self.monthPayment = data.monthPayment;
                    self.overpayment = data.overpayment;
                    self.currencyWord = data.currencyWord;
                    self.showResult();
                } else {
                    self.showError();
                }
            }
        });
    }

    // вывод результата
    self.showResult = function() 
    {
        $(o.ajaxLoader).hide();
        $(o.permonthResult).html(self.numberFormat(self.monthPayment));
        $(o.overpayResult).html(self.numberFormat(self.overpayment));
        $(o.resultCurrencyClass).html(self.currencyWord);
        $(o.resultInfoClass).show();
    }

    // вывыод сообщения об ошибке
    self.showError = function() 
    {
        $(o.ajaxLoader).hide();
        $(o.permonthResult).html('');
        $(o.overpayResult).html('');
        $(o.resultErrorClass).show();
    }

    // Валидация значений
    self.validate = function(e)
    {
        var field = $(e.target);
        val = field.val().replace(/[^\d\.,]/g, '').replace(',', '.');
        if (val) {
            val = self.formatThousands(val);
        }
        field.val(val);
        
        self.calculate();
    }

    self.formatThousands = function(s)
    {
        return s.split('').reverse().join('').match(/.{1,3}/g).join(' ').split('').reverse().join('');
    }

    self.numberFormat = function(number, decimals, dec_point, thousands_sep)
    {
        var i, j, kw, kd, km;

        if( isNaN(decimals = Math.abs(decimals)) )
            decimals = 0;

        if( dec_point == undefined )
            dec_point = ".";

        if( thousands_sep == undefined )
            thousands_sep = " ";

        i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

        j = i.length;
        if( j > 3 )
            j = j % 3;
        else
            j = 0;

        km = j ? i.substr(0, j) + thousands_sep : "";
        kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);

        return km + kw;
    }
}
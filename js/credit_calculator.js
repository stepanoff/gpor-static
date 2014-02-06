creditCalculator = function(options)
{
    var defaults = {
        'sumSource': '',
        'periodSource': '',
        'currencySource': '',
        'permonthResult': '',
        'overpayResult': '',
        'resultInfoClass': '',
        'resultErrorClass': '',
        'deadlineRatesUpdateUrl': ''
    }
    var self = this;
    var o = $.extend({}, defaults, options);

    self.currencyDeadlineRates = {};
    self.deadlineTypes = {};

    // Непосредственно расчет
    self.calculate = function()
    {
        var monthPayment = false;
        var overpayment = false;

        var selectedDeadline = self.deadlineTypes[$(o.periodSource).val()];
        
        // Максимальный срок для расчета по ставке
        var deadlineMonth = selectedDeadline.deadline_max
            ? self.deadlineInMonths(selectedDeadline.deadline_type_max, selectedDeadline.deadline_max)
            : self.deadlineInMonths(selectedDeadline.deadline_type_min, selectedDeadline.deadline_min);
        
        // Минимальный срок для нахождения ставки
        var deadlineMonthMin = selectedDeadline.deadline_min
            ? self.deadlineInMonths(selectedDeadline.deadline_type_min, selectedDeadline.deadline_min)
            : self.deadlineInMonths(selectedDeadline.deadline_type_max, selectedDeadline.deadline_max);

        var deadlineDaysMin = selectedDeadline.deadline_min
            ? self.deadlineInDays(selectedDeadline.deadline_type_min, selectedDeadline.deadline_min)
            : self.deadlineInDays(selectedDeadline.deadline_type_max, selectedDeadline.deadline_max);

        var rateRow = false;
        var sum = $(o.sumSource).val().replace(/[^\d\.,]/g, '').replace(',', '.');

        // Ищем ставку
        var currencyDR = self.currencyDeadlineRates[$(o.currencySource).val()];
        for (var n in currencyDR) {
            row = currencyDR[n];

            // NOTE: в row могут прийти не только int=0, но и string='0', поэтому условия !row['sum_max'] не сработает

            // сначала проверяем сумму
            var sumMin = parseInt(row['sum_min']);
            var sumMax = parseInt(row['sum_max']);
            if (sumMin <= sum && (sumMax >= sum || sumMax == 0)) {
                // теперь сроки
                var deadlineMin = parseInt(row['deadline_min']);
                var deadlineMax = parseInt(row['deadline_max']);
                if (deadlineMin <= deadlineDaysMin && (deadlineMax >= deadlineDaysMin || deadlineMax == 0)) {
                    rateRow = row;
                    break;
                }
            }
        }
        
        // Начинаем выполнять расчет, только если нашли ставку
        if (rateRow) {
            monthPayment = self.calculateMonthPayment(rateRow['rate'], deadlineMonth, sum);
            overpayment = monthPayment * deadlineMonth - sum;
            if (monthPayment > 0) {
                $(o.permonthResult).html(self.numberFormat(monthPayment));
                $(o.overpayResult).html(self.numberFormat(overpayment));
                $(o.resultInfoClass).show();
                $(o.resultErrorClass).hide();
            }
        }

        if (!monthPayment) {
            $(o.permonthResult).html('');
            $(o.overpayResult).html('');
            $(o.resultInfoClass).hide();
            $(o.resultErrorClass).show();
        }
    }

    // Вычисляет выплату в месяц
    self.calculateMonthPayment = function(rate, deadline, sum)
    {
        var r = rate / 12 / 100;
        var s = r * Math.pow((1 + r), deadline) / (Math.pow((1 + r), deadline) -1);
        return s * sum;
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

    // Получает данные о ставках кредита и заполняет массив доступных сроков
    self.updateDeadlaineRates = function()
    {
        if (!o.deadlineRatesUpdateUrl)
            return;

        $.ajax({
            url: o.deadlineRatesUpdateUrl,
            dataType: 'json',
            success: function(data) {
                if (!data.success) {
                    return;
                }
                self.currencyDeadlineRates = data.deadlineRates;
                self.deadlineTypes = data.deadlineTypes;
                self.updateForm();
                if ($(o.sumSource).val()) {
                    $(o.sumSource).val(self.formatThousands($(o.sumSource).val()));
                    self.calculate();
                }
            }
        });
    }

    // Удаляет из формы лишние элементы
    self.updateForm = function()
    {
        for(var currency in self.currencyDeadlineRates) {
            if (self.currencyDeadlineRates[currency].length == 0) {
                $(o.currencySource).find('option[value=' + currency + ']').hide();
            }
        }
    }

    self.formatThousands = function(s)
    {
        return s.split('').reverse().join('').match(/.{1,3}/g).join(' ').split('').reverse().join('');
    }

    // возвращает срок в месяцах
    self.deadlineInMonths = function(type, entity)
    {
        if (type == 'd')
            return Math.floor(entity / 30);
        if (type == 'm')
            return entity;
        if (type == 'y')
            return entity * 12;
        return entity;
    }

    self.deadlineInDays = function(type, entity)
    {
        if (type == 'd')
            return entity;
        if (type == 'm')
            return entity * 30;
        if (type == 'y')
            return entity * 12 * 30;
        return entity;
    }

    self.init = function()
    {
        $(o.resultInfoClass).hide();
        $(o.resultErrorClass).hide();

        $(o.sumSource).on('input', self.validate);
        $(o.periodSource).change(self.calculate);
        $(o.currencySource).change(self.calculate);

        self.updateDeadlaineRates();
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
        //kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");

        return km + kw;
    }
}
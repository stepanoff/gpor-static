$(document).ready(function()
{
    $.mask.definitions['~']='[+-]';
    $('#phone').mask('+7 (999) 999-99-99');
    var phoneVal = '';
    var submit_wrapper = $('#order_submit_wrapper');
    $('#age').mask('99');
    $('#needsum, #profit, #rasx, #pay').autoNumeric('init', {aSep: ' ', aDec: ',', mDec: '0'});
    $('#needtime, #stag, #laststag').autoNumeric('init', {aSep: '', aDec: ',', mDec: '0'});

    var prevValue = false;

    function sendRequest(el)
    {
        var current_attr = el.attr("name");
        if (!current_attr)
            current_attr = "";
        current_attr = current_attr.replace(/(.*)\[/,"").replace(/\]/,""); 
            
        if (current_attr=='sum_currency')
            current_attr = 'sum';
        if (current_attr=='period_units')
            current_attr = 'period';
            
        $("#current_attr").val(current_attr);
        $('#banki-credit-form').ajaxSubmit({success: showResponse, clearForm: false, resetForm: false});
    }

    $("[name^='order']:text").blur( function(ev)
    {
        var el = $(this);
        if (el.hasClass('b-form_validate_focus'))
            el.removeClass('b-form_validate_focus');

        if (el.attr('id')=='phone')
            phoneVal = el.val();

        // Только измененные поля посылать надо. Сервер ни к чему пустыми запросами долбить.
        if (prevValue != el.val()) {
            sendRequest(el);  
            $('.b-form__baloon_layout_err[data-id="'+getBaloon(el)+'"]')
                .hide()
                .before('<span class="ajax_loader"></span>');
            prevValue = el.val();
        }
    });

    $('input[name^="order"]:radio, select[name^="order"]').change( function(ev)
    {
        var el = $(this);
        sendRequest($(this));
        $('.b-form__baloon_layout_err[data-id="'+getBaloon(el)+'"]')
            .hide()
            .before('<span class="ajax_loader"></span>');
    });

    $("[name^='order']:text").focus( function(ev)
    {
        var el = $(this);

        // Запоминаем предыдущее значение
        prevValue = el.val();

        if (el.hasClass('b-form_validate_err')) {
            $('.b-form__baloon_layout_err').hide();
            $('.b-form__baloon_layout_err[data-id="'+getBaloon(el)+'"]').show();
        }
        else {        
            el.addClass('b-form_validate_focus');
        }
    });

    function getBaloon(el)
    {
        if (el.attr('type')=='radio')
            return el.parent().attr('data-id'); 
        return el.attr('id'); 
    }

    function showResponse(responseText, statusText, xhr, $form)
    {     
        response = JSON.parse(responseText);
       // console.log(response);

        el = $("[name='order["+response.current_attr+"]']");

        $('.b-form__baloon_layout_err[data-id="'+getBaloon(el)+'"]')
            .parents('.b-form__row-container')
            .find('.ajax_loader')
            .remove();//('<span class="ajax_loader"></span>');

        if (el.attr('id')=='phone')
            el.val(phoneVal);

        if (response.data) {
            if (el.attr('type')=='text')
                el.removeClass('b-form_validate_ok').addClass('b-form_validate_err');

            $('.b-form__baloon_layout_err').hide();
            $('.b-form__baloon_layout_err[data-id="'+getBaloon(el)+'"]').html(response.data).show();  
        }
        else {
            if (el.attr('type')=='text')
                el.removeClass('b-form_validate_err').addClass('b-form_validate_ok');

            $('.b-form__baloon_layout_err[data-id="'+getBaloon(el)+'"]').hide();
        }

        if (response.draft_hash)
            $('#draft_hash').val(response.draft_hash);

        if (response.hide_fields) {
            for (var i = 0; i < response.hide_fields.length; i++) {
                $('#' + response.hide_fields[i] + '_fieldset').hide();
            }
        }

        if (response.show_fields) {
            for (var i = 0; i < response.show_fields.length; i++) {
                $('#' + response.show_fields[i] + '_fieldset').show();
            }
        }

        if (response.change_fields) {
            for (var i = 0; i < response.change_fields.length; i++) {
                $('#' + response.change_fields[i].id + '_fieldset')
                    .find(response.change_fields[i].element)
                    .val(response.change_fields[i].value);
            }
        }
    }   

    $("#all_banks").change(function()
    {
        el = $(this);
        if (el.is(':checked'))
            $("#bank").val('');
        else
            $("#bank").val($('#bank').attr("data-bank_id"));
    });


    if ($('.b-form__baloon_layout_err').filter(':visible').length > 0) {
        $('html, body').animate({
            scrollTop: $('.b-form__baloon_layout_err').filter(':visible:first').offset().top - 10
        }, 1000);
    }
});
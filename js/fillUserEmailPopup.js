/**
 *
 * @param $sendForm jquery object with comment form
 * @return {Boolean} whether need fill profile or not
 */
var showForceFillUserEmailPopup = function ($sendForm) {

    if ($('div.b-popup-subscr__fill_user_email').length == 0)
        return false;

    var showUserError = function ($fillingField, $message) {
        $fillingField.parent().addClass('b-subscribe__form-row-box-error').
            find('div.b-form-builder_hint')
            .find('div.b-user-error-message').html('<p>' + $message + '</p>')
            .end().removeClass('hidden');
    };

    var hideUserError = function ($fillingField) {
        $fillingField.parent().addClass('b-subscribe__form-row-box-error').
            find('div.b-form-builder_hint').addClass('hidden');
    };

    $.popup.show({
        content:$('div.b-popup-subscr__fill_user_email'),
        customView:true,
        popupshow:function () {
            $(".js_popup_frame").css("width", "auto");
            $('a.force-fill-continue').bind('click', function () {
                $('#updateUserEmailForm').submit();
                return false;
            });

            $('a.force-fill-later').bind('click', function () {
                $('#cancelUpdateUserEmailForm').submit();
                return false;
            });

            $('fieldset.b-subscribe__form-row:visible').find('input.required').each(function (i, e) {
                $(e).bind('change focus keyDown', function () {
                    hideUserError($(this));
                });
            });
            $('#cancelUpdateUserEmailForm').ajaxForm({
                dataType:'json',
                type:'POST',
                success:function (data) {
                    if (data.errorCode == 0) {
                        $.popup.hide();
                        $sendForm.submit();
                    } else {
                        var $fillingField = $('fieldset.b-subscribe__form-row:visible').find('input[name="' + data.field + '"]');
                        $fillingField.parent().addClass('b-subscribe__form-row-box-error').
                            find('div.b-form-builder_hint')
                            .find('b-user-error-message').html('<p>' + data.message + '</p>')
                            .end().removeClass('hidden');
                    }
                },
                error:function (response, status, err) {
                   alert(err);
                }
            });

            $('#updateUserEmailForm').ajaxForm({
                dataType:'json',
                type:'POST',
                beforeSubmit:function () {
                    var $fillingField = $('fieldset.b-subscribe__form-row:visible').find('input.required, select.required');
                    if ($fillingField.length == 1 && $fillingField.val() == '') {
                        showUserError($fillingField, 'Заполните пожайлуста поле');
                        return false;
                    }
                    else if ($fillingField.length > 1) {
                        for (var i = 0; i < $fillingField.length; i++) {
                            if ($($fillingField.get(i)).val() == '')
                                showUserError($fillingField.get(i), 'Заполните пожайлуста поле');
                            else
                                hideUserError($fillingField.get(i));
                        }
                        return false;
                    }
                },
                success:function (data) {
                    if (data.errorCode == 0) {
                        $.popup.hide();
                        $sendForm.submit();
                    } else {
                        var $fillingField = $('fieldset.b-subscribe__form-row:visible').find('input[name="' + data.field + '"]');
                        showUserError($fillingField, data.message);
                    }
                },
                error:function (response, status, err) {
                    alert(err);
                }
            });
        }
    });

    return true;
};
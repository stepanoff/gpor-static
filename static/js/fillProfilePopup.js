/**
 *
 * @param $sendForm jquery object with comment form
 * @return {Boolean} whether need fill profile or not
 */
var showForceFillProfilePopup = function($sendForm) {

	if ($('div.b-popup-subscr__fill_profile').length  == 0)
		return false;

	$.popup.show({
		content: $('div.b-popup-subscr__fill_profile'),
		customView: true,
		popupshow: function() {
			$(".js_popup_frame").css("width", "auto");
			$('a.force-fill-continue').bind('click', function() {
				$('#updateInfoForm').submit();

				return false;
			});

			$('a.force-fill-later').bind('click', function() {
				$('#fillProfileForm').submit();

				return false;
			});

			$('#fillProfileForm').ajaxForm({
				dataType: 'json',
				type: 'POST',
				success: function (data) {
					if (data.errorCode == 0) {
						$.popup.hide();
						$sendForm.submit();
					} else {
						alert("Ошибка "+data.errorCode+": "+data.message);
					}
				},
				error: function(response, status, err) {
					alert(err);
				}
			});

			$('#updateInfoForm').ajaxForm({
				dataType: 'json',
				type: 'POST',
				beforeSubmit: function() {
					var $fillingField = $('fieldset.b-subscribe__form-row:visible').find('input.required, select.required');
					if ($fillingField.length == 1 && $fillingField.val() == '') {
						$fillingField.parent().addClass('b-subscribe__form-row-box-error').
							find('div.b-form-builder_hint').removeClass('hidden');
						return false;
					} else if ($fillingField.length > 1) {
						for (var i=0; i<$fillingField.length; i++) {
							if ($($fillingField.get(i)).val() == '') {
								$fillingField.parent().addClass('b-subscribe__form-row-box-error').
									find('div.b-form-builder_hint').removeClass('hidden');
								return false;
							}
						}
					}
				},
				success: function (data) {
					if (data.errorCode == 0) {
						$.popup.hide();
						$sendForm.submit();
					} else {
						alert("Ошибка "+data.errorCode+": "+data.message);
					}
				},
				error: function(response, status, err) {
					alert(err);
				}
			});
		}
	});

	return true;
};
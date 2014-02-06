$(document).ready(function () {

	$(".char_counter").each(function () {
		$(this).after('<span id="' + $(this).attr('id') + 'c" style="padding-left: 10px;"></span>');
		$(this).bind({
			'keyup':function () {
				countDiv = $(this).attr('id') + 'c';
				length = ($(this).attr('max') - $(this).val().length);
				$("#" + countDiv).html(length);
				if (length < 0)
					$("#" + countDiv).css('color', 'red');
				else
					$("#" + countDiv).css('color', 'gray');
			}
		});
		$(this).keyup();
	});

});
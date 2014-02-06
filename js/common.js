function initSearchExampleWords(idInput, classWidgetContainer) {
	function getRandomInt(min, max) 	{
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	classWidgetContainer = "." + classWidgetContainer;
	$(".hintSearchZone").find(".hidden").removeClass("hidden");
	var text = $(classWidgetContainer + " .searchHint").html();
	var new_arr = [];
	var new_text = text.replace('<span class="hidden">', '').replace('</span>', '');
	new_arr = new_text.split(',');
	rnd_text = new_arr[getRandomInt(0, new_arr.length - 1)];
	$(classWidgetContainer + " .searchHint").text(rnd_text);
	$(classWidgetContainer).click(function() {
		$("#"+idInput).val(rnd_text.trim());
	});
}

(function ($) {

	/** Обработка ajax ошибок */
    $.ajaxSetup({

		error: function(xhr, error){

			/**
			 * Пока что выключим глобальное оповещение об ошибках, т.к. они
			 * могут возникать даже при загрузке скриптов с помощью jQuery, а
			 * мы не хотим, чтобы пользователи видели внезапные ошибки
	         */
			return;

			if (xhr.status==0) {

                $.popup.show({ title: 'Ошибка', content: 'Невозможно выполнить запрос' });
			}

            else if (xhr.status == 404) {

                $.popup.show({ title: 'Ошибка', content: 'Во время запроса произошла ошибка' });
			}

            else if (xhr.status == 500) {

                $.popup.show({ title: 'Ошибка', content: 'Во время запроса произошла ошибка' });
			}

            else if (error == 'parsererror') {

                $.popup.show({ title: 'Ошибка', content: 'Во время запроса произошла ошибка' });
			}

            else if (error == 'timeout'){

                $.popup.show({ title: 'Ошибка', content: 'Не получен ответ от сервера' });
			}

            else {

                $.popup.show({ title: 'Ошибка', content: 'Неизвестная ошибка: ' + xhr.responseText });
			}
		}
	});

    /**
     * Показываем, что у нас есть JS (о, боже!)
     */
    $(document).bind('documentbodyloadstart', function () {

        $('body').addClass('js');
    });

})(jQuery);

/*
$(document).ready(function () {
	var that = window;
	$(".ajax-logout").bind("click", function (e) {
		var url = $(this).attr('href');
		$.post(url, "", function(code){
				that.location.reload(true)
			}
		);
		e.preventDefault();
	});
});
*/
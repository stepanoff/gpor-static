$(document).ready(function () {
    $(".b-readmore__link").on("click", function () {
        var readmoreHideWrapper = $(this).closest(".b-readmore").find(".b-readmore__hide");
        readmoreHideWrapper.slideToggle();

        if ($(this).html() == 'Скрыть') {
            $(this).html('Читать дальше');
        } else {
            $(this).html('Скрыть');
        }

        return false;
    });
});
$(document).ready(function() {
    $(".b-tabs__item").on("click", function () {
        $(this).parent().find(".b-tabs__item").removeClass("b-tabs__item_active");
        $(this).addClass("b-tabs__item_active");

        var link = $(this).find('a.b-tabs__item__link');
        $('.' + link.attr('rel')).hide();
        $(link.attr('href')).show();

        $(window).resize();

        return false;
    });
});
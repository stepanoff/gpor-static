function initDatePlasha(object, options)
{
    var $linkBuble = object;
    var count = options;

    // Выпадающее меню
    var $buble = object.parent().find(".b-afisha-date-bubble");

    $linkBuble.mouseover( function (e)
    {
        e.preventDefault();
        e.stopPropagation();

        var dropWidth = $(this).width();
        var dropHeight = $(this).height();

        // Включаем выпадающее меню
        $buble.css("left", $(this).position().left - 15 + "px");
        $buble.find("ul").css("width", dropWidth + 1 + "px");
        $buble.css("visibility", "visible");

    })
    .mouseout( function (e)
    {
        if (!$(e.relatedTarget).parents("div").hasClass("b-afisha-date-bubble-container")) {
            $buble.css("visibility", "hidden");
        }
    })
    .parent().find(".b-afisha-date-bubble").bind("mouseout", function (e)
    {
        if (!$(e.relatedTarget).parents("div").hasClass("b-afisha-date-bubble-container")) {
            $buble.css("visibility", "hidden");
        }
    });
}

var formatPlashaDate = function (e)
{
    var date = $(e).attr("rel").split('-');
    var year = date[2];
    var month = date[1];
    var day = date[0];

    var curentDate = $(".b-afisha-date-plashka__current-date").attr("rel").split('-');
    var curYear = curentDate[2];
    var curMonth = curentDate[1];
    var curDay = curentDate[0];

    randDate = new Date(year, month, day);
    curDate = new Date(curYear, curMonth, curDay); //сегодня

    delta = parseFloat((curDate.getTime() - randDate.getTime()) / 1000 / 60 / 60 / 24);
    plashkaText = ", " + $(e).find("ins").text();
    if (delta <= -10) {
        $(".b-afisha-date-plashka__current-date").html("В ближайшем будущем" + plashkaText);
    }
    if ((delta < -2) && (delta > -10)) {
        $(".b-afisha-date-plashka__current-date").html("Скоро" + plashkaText);
    }
    if (delta == -2) {
        $(".b-afisha-date-plashka__current-date").html("Послезавтра" + plashkaText);
    }
    if (delta == -1) {
        $(".b-afisha-date-plashka__current-date").html("Завтра" + plashkaText);
    }
    if (delta == 0) {
        $(".b-afisha-date-plashka__current-date").html("Сегодня" + plashkaText);
    }
    if (delta == 1) {
        $(".b-afisha-date-plashka__current-date").html("Вчера" + plashkaText);
    }
    if (delta == 2) {
        $(".b-afisha-date-plashka__current-date").html("Позавчера" + plashkaText);
    }
    if ((delta > 2) && (delta < 10)) {
        $(".b-afisha-date-plashka__current-date").html("Недавно" + plashkaText);
    }

};

$(document).ready(function ()
{
    $(".b-afisha-date-plashka__current-link").each(function (e)
    {
        initDatePlasha($(this), e);
        formatPlashaDate($(this));
    });
});

function StarsRating (conf) {
    // конфигурация
    this.width = conf.width || 0;
    this.height = conf.height || 0;
    this.imgBefore = conf.imgBefore || "";
    this.imgAfter = conf.imgAfter || "";
    this.parent = conf.parent;
    this.htmlElement = null;
    this.currentValue = conf.value || 0;
    // двойная проверка, т.к. typeof null возвращает object
    if ((!conf.parent) || (typeof conf.parent != 'object'))
        throw new TypeError("нужно указать элемент, в который вставляем рейтинг, это должен быть jQuery-объект");

    this.selected = false;

    this.collectionStar = [];

    this.createHtml();
    this.initHandler();
}

StarsRating.prototype.createHtml = function () {
    this.htmlElement = $("<div />", {
        className: "rating context"
    }).css("width", parseInt(this.width)*5 + "px");

    for (var i = 0, a; i < 5; ++i) {
        a = $("<a href='#' class='in_rating'></a>");
        a.css({width: this.width, height: this.height});
        this.htmlElement.append(a);
        this.collectionStar.push(a);
    }
    this.parent.append(this.htmlElement);
    for (var i = 0; i < this.currentValue; ++i) {
        this.collectionStar[i].css("backgroundPosition", "0 0");
    }
};

StarsRating.prototype.initHandler = function () {
    var that = this;
    $(this.collectionStar).each(function () {
        $(this).bind("mouseover", function () {
            $(this).prevAll().css("backgroundPosition", "0 0");
            $(this).css("backgroundPosition", "0 0");
        });
        $(this).bind("mouseout", function () {
            $(this).prevAll().css("backgroundPosition", "0 -20px");
            $(this).css("backgroundPosition", "0 -20px");
            for (var i = 0; i < that.currentValue; ++i) {
                that.collectionStar[i].css("backgroundPosition", "0 0");
            }
        });
        $(this).bind("click", function (e) {
            that.selected = true;
            if (that.currentValue == ($(this).prevAll().length + 1)) {
                that.currentValue = 0;
            } else {
                that.currentValue = $(this).prevAll().length + 1;
            }
            for (var i = that.currentValue; i < 5; ++i) {
                that.collectionStar[i].css("backgroundPosition", "0 -20px");
            }
            $("#hotels-search-form_stars").attr("value", that.currentValue);
            e.preventDefault();
        });
    });
};


$(document).ready(function () {
    new StarsRating({
        width: "21px",
        height: "20px",
        imgBefore: "",
        imgAfter: "",
        parent: $(".hotels_rating"),
        value: $("#hotels-search-form_stars").attr("value")
    });
    $(document).ready(function () {
        var spec_blok = $(".realty_auto");
        var spesials = spec_blok.find(".realty_auto-one");
        var last = spesials.eq(4);
        $(window).resize(function () {
            if (parseInt(spec_blok.css("width")) < 625) {
                if (last.html()) {
                    last.css("display", "none");
                    spesials.css("width", "24%");
                }
            } else {
                if (last.html()) {
                    last.css("display", "block");
                    spesials.css("width", "19%");
                }
            }
        });

        $(".hotels_show-telephon-chk").bind("click", function (e) {
            $('.hotels_show-telephon').show();
            $(this).hide();
            $.ajax({url: $('.phoneshow').text() + "showphone/"});
            e.preventDefault();
        });

        $(".hotels_pray-close").bind("click", function (e) {
            $(this).parents(".hotels_pray").remove();
            e.preventDefault();
        });

        $('.hotels_pray').bind("click", function (e) {
            $(this).remove();
            e.preventDefault();
        });

    });

    $(".rating-fix").each(function () {
        var count = parseInt($(this).next().text());
        $(this).children().each(function (i) {
            if (i >= count) {
                $(this).css("display", "none");
            }
        });
    });

    $(".fio_guest-fields").each(function () {
        if ($(this).nextAll().length == 0) {
            return;
        } else {
            $(this).find(".add").css("display", "none");
        }
    });

    $(".fio_guest .add").live("click", function (e) {
        var fields = $(".fio_guest-fields").eq(0);
        $(".fio_guest-fields").each(function () {
            $(this).find(".add").css("display", "none");
        });
        $(".fio_guest-fields").parents().eq(0).append(
            $("<div class='fio_guest-fields context'><span class='fio'>ФИО гостя:</span><input type='text' value='' id='hotels-order__guests' name='HotelsOrder[_guests][]' class='forms_text' /><a class='add' href='#'></a></div>")
        );
        e.preventDefault();
    });

    var bubbles = $(".title-bubble");
    bubbles.each(function () {
        $(this).css('width','auto');
    });

    var current = null;
    var body = $("#body");
    var hotels_banners = $(".hotels_banners");
    var bubble_over = false;
    var isPagging = 0;

    if (document.attachEvent)
        isPagging = 27;

    bubbles.bind("mouseout", function (e) {
        if(!$(e.relatedTarget).parents(".title-bubble").hasClass("title-bubble")) {
            $(this).css("visibility", "hidden");
        }
        if (!$(e.currentTarget).hasClass("title-bubble")) {
            $(this).css("visibility", "hidden");
        }
    });

    var hotels_banner_one = $(".hotels_banner_one");

    window.onresize = function () {
        bubbles.css("left", 0);
    };

    hotels_banner_one.each(function ()
    {
        $(this).bind("mouseover", function (e)
        {
            var hotels_banners_width = parseInt(hotels_banners.css("width"));
            var padding_body = parseInt(body.css("paddingLeft"));

            if (current)
                $(current).css("visibility", "hidden");

            var count = $(this).prevAll().length;

            var offset = $(this).offset().left - hotels_banners.offset().left;
            var bubble = bubbles.eq(count);
            bubble.css({visibility: "visible"});
            var bubble_width = bubble.width();
            var left = offset + $(this).width()/2 + "px";
            var right = hotels_banners_width - offset - $(this).width()/2 - $(this).width()/4 + "px";

            if (offset + bubble_width < hotels_banners_width - padding_body)
                bubble.css({right: 'auto', left: left}).removeClass("title-bubble-right");
            else
                bubble.css({left: 'auto', right: right}).addClass("title-bubble-right");
            current = bubble;
            bubble_over = true;
        });

        $(this).bind("mouseout", function (e) {
            if (!$(e.relatedTarget).parents(".title-bubble").hasClass("title-bubble") && current) {
                $(current).css("visibility", "hidden");
            }
        });
    });
});

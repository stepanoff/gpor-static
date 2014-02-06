$(document).ready(function () {

    var menu_bubbles = $(".menu_title-bubble");

    menu_bubbles.each(function () {
        $(this).css("width", $(this).attr("offsetWidth") + 25 + "px");
    });
    var current = null;

    menu_bubbles.bind("mouseout", function (e) {
        if (!$(e.relatedTarget).parents(".menu_title-bubble").hasClass("menu_title-bubble")) {
            $(this).css("visibility", "hidden");
            $(".b-right-cnr").css("display", "none");
            $(".b-submenu__drop-pic").removeClass("b-submenu__link-drop-hover");
            $(".submenu_items__item").removeClass("submenu_items__item-hover");
        }
        if (!$(e.currentTarget).hasClass("menu_title-bubble")) {
            $(".b-submenu__drop-pic").removeClass("b-submenu__link-drop-hover");
            $(this).css("visibility", "hidden");
            $(".b-right-cnr").css("display", "none");
            $(".b-submenu__drop-pic").removeClass("b-submenu__link-drop-hover");

        }

    });

    var menu_banner_one = $(".submenu_items__item");

    window.onresize = function () {
        menu_bubbles.css("left", 0);
    };

    menu_banner_one.each(function () {
        $(this).has(".b-submenu__drop-pic").bind("mouseover", function (e) {

            $(this).addClass("submenu_items__item-hover");

            var menu_bubble = $(".menu_bubbles").children().eq($(this).index());

            menu_bubble.css("visibility", "visible");

            $(this).find(".b-submenu__drop-pic").addClass("b-submenu__link-drop-hover");

            var newLeft = ($(this).position().left);
            var ul = $(".menu_bubbles").children().eq($(this).index()).find("ul");
            var ulWidth = $(".menu_bubbles").children().eq($(this).index()).find("ul").width();

            if ($(this).hasClass("submenu_items__item-current")) {

                newLeft = $(this).position().left - 5;

                $(".menu_bubbles").children().eq($(this).index()).css("left", newLeft + "px");

                newWidth = $(this).width() - 2;

                $(".b-right-cnr").css("display", "block");
                $(".menu_bubbles").children().eq($(this).index()).find("ul").css("width", newWidth + "px");
                $(".menu_bubbles").children().eq($(this).index()).css("top", "18px");
            } else {
                $(".menu_bubbles").children().eq($(this).index()).css("left", newLeft - 5 + "px" /*newLeft - 20 + "px"*/); //исправлено, потому что на сайте менюшка уползала влево

                newWidth = $(this).width(); //attr('offsetWidth'); — атрибут нигде не назначается

                $(".menu_bubbles").children().eq($(this).index()).find("ul").css("width", newWidth + "px");
            }

            current = menu_bubble;

        });

        $(this).has(".b-submenu__drop-pic").bind("mouseout", function (e) {
            if (!$(e.relatedTarget).parents(".menu_title-bubble").hasClass("menu_title-bubble") && current) {

                $(this).removeClass("submenu_items__item-hover");
                $(this).find(".b-submenu__drop-pic").removeClass("b-submenu__link-drop-hover");
                $(".b-right-cnr").css("display", "none");
                $(current).css("visibility", "hidden");
            }
        });
    });
});
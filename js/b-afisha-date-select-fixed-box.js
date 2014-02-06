var init = false;

$(document).ready(function () {
    /*пока только для выбиралки дат*/
    jQuery(window).scroll(function () {
        var fixBox = jQuery(".b-afisha-date-select-fixed-box");
        var dateSelector = jQuery("#js-date-select-place");
        var showing = false;
        var hiding = false;
        if (dateSelector.offset() !== null && jQuery(window).scrollTop() > dateSelector.offset().top) {
            if (!init) {
                if (hiding) {
                    fixBox.stop();
                    dateSelector.find(".b-afisha-date-select").stop();
                    hiding = false;
                }
                showing = true;
                fixBox.css({"top": "-100px"});
                fixBox.toggle();
                fixBox.animate({"top": "0px"}, 300, function () {
                    showing = false;
                });
                dateSelector.find(".b-afisha-date-select")
                        .css("position", "fixed")
                        .css("top", "-85px")
                        .css("zIndex", "10001");
                dateSelector.find(".b-afisha-date-select").animate({"top": "15px"}, 300);
                $(".b-afisha-date-select").leftFixedToGrid();
                init = true;
            }
        } else if (init) {
            if (showing) {
                fixBox.stop();
                dateSelector.find(".b-afisha-date-select").stop();
                showing = false;
            }

            hiding = true;
            fixBox.animate({"top": "-100px"}, 300, function () {
                fixBox.toggle();
                fixBox.css({"top": "0px"});
                hiding = false;
            });
            dateSelector.find(".b-afisha-date-select")
                    .css("position", "relative")
                    .css("zIndex", 1)
                    .css("left", "auto")
                    .css({"top": "auto"});
            init = false;
        }
    });
});


	
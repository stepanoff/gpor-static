b_afisha_event_search = function (opts) {

    var defaults = {
        'containerClass': '',
        'linkClass': '',
        'searchClass': ''
    };

    var o = $.extend({}, defaults, opts);
    var obj = $("." + o.containerClass);

    var init = function (data) {
        obj.delegate("." + o.linkClass, 'click', function () {
            $("." + o.searchClass).val($.trim(this.text));
            return false;
        });
    };

    // start
    this.init = function () {
        init();
    };

    this.initUi = function () {

    }
};


$(document).ready(function() {
	$(".questBox .toggleBodyLink").bind('click', function() {
		$(this).find("ins").toggleClass("toggleBodyLinkIco-");
		$(this).parents(".questBox").find("form").toggle();
		return false;
	});
    if (location.hash == '#ask') {
        var _f = $(".questBox").find("form");
        _f.show();
        _f.find("textarea").focus();
    }

});


$(document).ready(function() {

	var pageContentWidth = $(".page-col-1-span-15").width();
	var linkObj = $(".b-doska-other-rubrics__link");
	var wrapClass = "b-doska-other-rubrics__wrap";
	var objClass = 	"b-doska-other-rubrics__popup";
	var openedClass = "b-doska-other-rubrics_state_opened";

	
	linkObj.click(function() {
		$(this).parent().toggleClass(openedClass);
		var width = pageContentWidth;
		var left = "-" + $(this).position().left;
		$(this).next("." + wrapClass).find("." + objClass).css("width", width + 22 + "px");
		$(this).next("." + wrapClass).find("." + objClass).css("left", left -13 + "px");
		return false;
	});

	$(".b-doska-other-rubrics__popup__close-link").click(function() {
		$(linkObj).parent().toggleClass(openedClass);
	});
	
});
	

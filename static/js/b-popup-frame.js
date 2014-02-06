$(document).ready(function() {
	var closeLinkClass = ".b-popup-frame__close-link";
	var shadObj = $(".b-popup-frame__shadow");
	$(document).delegate(closeLinkClass, "click", function() {
		$(this).closest(".b-popup-frame").hide();
		shadObj.fadeOut();
		return false;
	});
	
});
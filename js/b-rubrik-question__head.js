$(document).ready(function(){

	$(".b-rubrik-question_head a").click(function() {
		if ($(this).hasClass("b-rubrik-question_head__item__toggle-link")) {	
			$(this).parent().toggleClass("select");
			$(".b-rubrik-question__form").toggle();
			$(".b-rubrik-question_wrap__quest-list").toggle();
			return false;													
		} else {
		}
	});

});
$(document).ready(function() {
	
	$(".b-doska-filter__content__rubric-title").click(function() {
		$(this).toggleClass("b-doska-filter__content__rubric-title_state_opened");
		$(this).next(".b-doska-filter__content__rubric-content").toggleClass("b-doska-filter__content__rubric-content_state_opened");
		return false;
	});
	
	
});
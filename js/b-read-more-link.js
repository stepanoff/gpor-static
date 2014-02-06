$(document).ready(function() {
	$(".b-read-more-link_js-activity_toggle").click(function() {
		$(this).toggleClass("b-read-more-link_state_deployed");
		$(".b-container_js-activity_toggle").toggle("middle");
		return false;
	});
});


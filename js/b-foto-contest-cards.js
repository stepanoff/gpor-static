$(document).ready(function() {
	$(".b-foto-contest-cards__item__link-hover-card").hover(
		function() {
			$(this).closest(".b-foto-contest-cards__item").siblings().find(".b-foto-contest-cards__item__hover-card_shadow").show();
			$(".b-foto-contest-cards__shadow").css("display", "block");
			$(this).closest(".b-foto-contest-cards__item").siblings().find(".b-foto-contest-cards__inner").css("border-bottom", "1px solid #ababab");
		},
		function(){
			$(".b-foto-contest-cards__item").siblings().find(".b-foto-contest-cards__item__hover-card_shadow").hide();
			$(".b-foto-contest-cards__shadow").css("display", "none");
			$(".b-foto-contest-cards__inner").css("border-bottom", "1px solid #ccc");
		});
});
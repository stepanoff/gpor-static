$(document).ready(function() {
	function changeRatingRank(object, rank) {
		$object = object;
		var curRank = $object.parents(".b-rating").find(".b-rating__value").attr("rel");
		newRank = parseInt(curRank) + parseInt(rank);
		if (newRank>0) {
			var str = '<img src="img/empty.gif" class="b-rating__value-sign b-rating__value-sign-plus" alt="+" />' + newRank;
			$object.parents(".b-rating").find(".b-rating__value").removeClass("js-b-rating__value-negative");
		}
		if (newRank==0) {
			var str = "0";
			$object.parents(".b-rating").find(".b-rating__value").removeClass("js-b-rating__value-negative");
		}												
		if (newRank<0) {
			var str = '<img src="img/empty.gif" class="b-rating__value-sign b-rating__value-sign-minus" alt="&ndash;" />' + Math.abs(newRank);	
			$object.parents(".b-rating").find(".b-rating__value").addClass("js-b-rating__value-negative");
		}
		$object.parents(".b-rating").addClass("js-b-rating-disabled");
		$object.parents(".b-rating").find(".b-rating__value").html(str);
		$object.parents(".b-rating").find(".b-rating__value").attr("rel", newRank);
	}
	$(".b-rating__minus").bind("click", function() {
		if (!$(this).parents(".b-rating").hasClass("js-b-rating-disabled")) {
			changeRatingRank($(this), -1);
		}
		return false;
	});
	$(".b-rating__plus").bind("click", function() {
		if (!$(this).parents(".b-rating").hasClass("js-b-rating-disabled")) {
			changeRatingRank($(this), 1);
		}
		return false;
	});											
});
function fixTableScrollThHeight () {
	$(".b-table-fix-row__table th").each(function() {
		var heightTh = $(this).find(".pad").height();
		$(this).parent().find("td").css("height", heightTh + 20 + "px");
		
	});
}

$(document).ready(function() {
	fixTableScrollThHeight();
});


$(window).resize(function() {
	fixTableScrollThHeight();
}) 


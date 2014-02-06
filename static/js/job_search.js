$(document).ready(function () {
	
	var elem = $(".job-right-block .news_cute-news-block");
	elem.find(".rocon-tl").removeClass("rocon-tl");
	elem.find(".rocon-bl").removeClass("rocon-bl");
	
	$(".onejob-right-top").each(function () {
		var heightLeftBlock = parseInt($(".onejob-left").css("height")) - 39;
		var heightSelf = parseInt($(this).css("height"));
		if (heightSelf < heightLeftBlock) {
			$(this).css({height: heightLeftBlock + "px"});
		}
	});
	
	$(".job_city-list").each(function () {
		var top = parseInt($(this).attr("offsetHeight")/2);
		$(this).css("top", -top + 10 + "px");
	});
	
	$(".job_list-city").bind("mouseover", function (e) {
		var list = $(this).children('.job_city-list');
		if (list.css("visibility") == 'hidden') {
			list.css("visibility", "visible");
		} else {
			list.css("visibility", "hidden");
		}
	});

    $(".job_list-city").bind("click", function (e) {
		e.preventDefault();
	});

    /*if ($.browser.webkit || $.browser.opera) {
        $(".job_banner_one").each(function () {
            if (!$(this).hasClass('job_banner_one-last')) {
                $(this).css('marginLeft', "1px");
            }
        });
    }*/

	$(".job_resume_none").bind("click", function (e) {
		var field = $(this).parents().eq(0);
		if (field.hasClass("job_mode-file")) {
			$(".job_send-file").css("display", "none");
			$(".job_send-text").css("display", "block");
			field.removeClass("job_mode-file");
			field.addClass("job_mode-text");
			$(this).text("Загрузить резюме");
			$("#rabota-send-resume-form_resume-type-1").removeAttr("checked");
			$("#rabota-send-resume-form_resume-type-2").attr("checked", "checked");
		} else {
			$(".job_send-file").css("display", "block");
			$(".job_send-text").css("display", "none");
			field.removeClass("job_mode-text");
			field.addClass("job_mode-file");
			$(this).text("У меня нет готового резюме");
			$("#rabota-send-resume-form_resume-type-1").attr("checked", "checked");
			$("#rabota-send-resume-form_resume-type-2").removeAttr("checked");
		}
		e.preventDefault();
	});
	
	$(".job_banner_one-link-b").each(function () {
		var imgLeft = $(this).parents("table").attr("offsetWidth")/2;
		var aWidth = $(this).attr("offsetWidth")/2;
		$(this).css("left", imgLeft-aWidth + "px");
	});
	
	$(".job_list-city").bind("mouseout", function (e) {
		var list = $(this).children('.job_city-list');
		if (list.css("visibility") == 'hidden') {
			list.css("visibility", "visible");
		} else {
			list.css("visibility", "hidden");
		}
		e.preventDefault();
	});
	
	var mas = [];
	$(".city-list-diagrams .diagrams .count").each(function () {
		mas.push (parseInt($(this).text()));
	});
	
	var maxValue = max(mas);
	
	$(".city-list-diagrams .diagrams .d-center-in").each(function (i) {
        $(this).css("width", parseInt(mas[i]/maxValue*100) + "%");
	});
	
	$(".city-list-diagrams .diagrams .count").each(function () {
		var offset = $(this).prevAll(".d-center-in").attr("offsetWidth");
		if ($.browser.opera || $.browser.webkit) {
			$(this).css({
				left: offset + "px"
			});
		}
	});
	
	function max (m) {
		var max = -1;
		for (var i = 0, len = m.length; i < len; ++i) {
			if (max < m[i]) {
				max = m[i];
			}
		}
		return max;
	}
	
});
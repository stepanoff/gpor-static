$(document).ready(function () {
	
	// устанавливаем класс для зебры + подправляем высоту для верной установки фона
	var compare_table = $(".compare_table tbody");
	
	
	function setHeightLine() {
		$(".compare_table tr").each(function(m) {
		
			$(this).find("td").each(function (i) {
				$(this).filter(".headcol").css("height", "auto");
				$(this).filter(".headcol").css("paddingTop", "0px");
				$(this).filter(".headcol").css("paddingBottom", "0px");
				$(this).filter(".headcol").css("lineHeight", "14px");
				$(this).filter(".long").css("height", "auto");
				$(this).filter(".long").css("paddingTop", "0px");
				$(this).filter(".long").css("paddingBottom", "0px");
				$(this).filter(".long").css("lineHeight", "14px");
				
			})
			
			$(this).addClass("odd" + (m % 2));	
			
			
			var maxHeight = 0;	
			$(this).find("td").each(function () {
				strHeight = $(this).height();
				if (strHeight > maxHeight) {
					maxHeight = strHeight;
				}
			});	
			$(this).find("td").filter(".headcol").css("height", maxHeight + 0 + "px");
			$(this).find("td").filter(".long").children(".relativeHeight").css("height", maxHeight + "px");
			$(this).parents(".compare_table_box").find(".compare-left-line").css("height", $(this).parents(".compare_table").height() + "px");
			$(this).parents(".compare_table_box").find(".compare-right-line").css("height", $(this).parents(".compare_table").height() + "px");
			var widthHeadCols = 0;
			$(this).find("td").filter(".headcol").each(function() {
				widthHeadCols = widthHeadCols + 8 + $(this).width();
			});
		});	
		
	}
	
	
	
	
	setHeightLine();

	var table_out = $(".compare_table_out");
	var left_line = $(".compare-left-line");
	var right_line = $(".compare-right-line");
	
	if ($.browser.msie || $.browser.opera) {
        $(".compare_table_out_one .compare-right-line").css("marginRight", "20px");
    }

    if ($.browser.opera) {
        $(".compare_table_out_one .compare-left-line").css("marginLeft", "20px");
    }	

	// установка тенюшки левой при загрузке документа и при ресайзе
	// окна(в хороших браузерах этого можно не делать при загрузке документа)
	setLinePosition();

	$(window).resize(function () {
		setLinePosition();
		setHeightLine();
	});
	
	// приходится двигать тенюшку так

	function setLinePosition () {
		if ($.browser.msie && parseInt($.browser.version) == 8) {
			right_line.css("right", "10px");
		}
		if ($.browser.opera) {
			delta = 0;
		}
		if ($.browser.opera || ($.browser.msie && parseInt($.browser.version) < 8)) {
			left_line.css("left", '10px');
		}
	}
	
	var headcol = $('.headcol');
	// для хреновых браузеров нашу крутую таблицу отрубаем
	if ($.browser.opera || ($.browser.msie && parseInt($.browser.version) < 8)) {
		headcol.css("position", "static");
		table_out.css({
			width: '100%',
			marginLeft: '0'
		});
		var delta = 10;
		if ($.browser.opera) {
			delta = 0;
		}
		right_line.css("right", '10px');
	}
	
	function ieBugs () {
		if ($.browser.msie && parseInt($.browser.version) < 8) {
			var trswidth = (compare_table.find("tr.firsttr").children('td').length - 1)*180;
			var trsfirst = $(".headcol1").width();
			var width = trswidth + trsfirst;
			var width = trswidth + trsfirst;
			compare_table.css ("width", width + "px");
			right_line.css("right", '0');
		}
	}
	
	ieBugs ()
	
	// удаляем столбец (одну сравниваемую программу)
	$(".close-compare_table").live("click", function (e) {
		var leftIndex = $(this).parents("td").prevAll().length;
		var countAll = $(this).parents("tr").children("td").length - 1;
		// осталась одна программа
		if (countAll == 1) {
			compare_table.css("height", compare_table.height());
		}
		compare_table.find("tr").each(function () {
			var tds = $(this).children("td");
			tds.eq(leftIndex).remove();
			tds.eq(0).css("height", parseInt($(this).height()) - 20 + "px");
		});
		setHeightLine();
		e.preventDefault();
	});
	
	
	setHeightLine();

});
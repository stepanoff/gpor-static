
var startPosition = 0;

$(document).ready(function() {

	wrapElement = $(".b-doska-card__wrap"); //главный враппер
	borderElement = $(".b-doska-card__wrap__contacts"); //врапер над мотающимся элементом
	borderElement.height(wrapElement.height() + "px");
	boxElement = $(".b-doska-card__wrap-box"); //плавающий элемент

	startPosition = wrapElement.offset().top;
	endPosition = wrapElement.offset().top + borderElement.height();
	
	currentWindowPos = $(document).scrollTop();
	

	
});


$(window).scroll(function() {
	currentWindowPos = $(document).scrollTop();
	if ((currentWindowPos >= startPosition)&&(currentWindowPos < endPosition)) {
	
	
		if (currentWindowPos + boxElement.height() > endPosition - 20 ) {
			//console.log(currentWindowPos + " + " + boxElement.height() + " > " + endPosition );
			boxElement.css("top",  + borderElement.height() - boxElement.height() -24  +  "px");
		} else {
			//boxElement.css("position",  "relative");
			boxElement.css("top", currentWindowPos - borderElement.offset().top + "px");
		}
	} else {
		boxElement.css("top", 0);
		boxElement.css("position",  "relative");
	}
});
	

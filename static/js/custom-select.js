(function($){
    $.fn.extend({
     
		customStyle : function(options) {
			if(!$.browser.msie || ($.browser.msie&&$.browser.version>6)){
				return this.each(function() {
					var currentSelected = $(this).find(':selected');
					
					var className_ = $(this).attr("class");
					
					$(this).after('<span class="'+className_+'"><span class="customStyleSelectBoxInner">'+currentSelected.text()+'</span></span>').css({position:'absolute', opacity:0,fontSize:$(this).next().css('font-size')});
					var selectBoxSpan = $(this).next();
					var selectBoxWidth = parseInt($(this).width()) - parseInt(selectBoxSpan.css('padding-left')) -parseInt(selectBoxSpan.css('padding-right'));
					var selectBoxSpanInner = selectBoxSpan.find(':first-child');
					selectBoxSpan.css({display:'inline-block'});
					selectBoxSpanInner.css({width:selectBoxWidth, display:'inline-block'});
					var selectBoxHeight = parseInt(selectBoxSpan.height()) + parseInt(selectBoxSpan.css('padding-top')) + parseInt(selectBoxSpan.css('padding-bottom'));
					$(this).height(selectBoxHeight).change(function(){
						//selectBoxSpanInner.text($(this).val()).parent().addClass('changed');
						selectBoxSpanInner.text($(this).find(':selected').text()).parent().addClass('changed');
						// Thanks to Juarez Filho & PaddyMurphy
					});
		 
				});
			}
		}
	
    });
})(jQuery);
     
     
$(function(){
    $('select.g-custom-control__zdorovje').customStyle();
	$('select.g-custom-control-select__zdorovje').customStyle();
	$('select.g-custom-control-select__zdorovje-search').customStyle();
	
	
});
function checkCountAdvert(){
	if ((parseInt($(".newMembers").css("width")) > 960)) {
		$(".newMembers .newMembersItem").show();
		$(".newMembers .newMembersItem:nth-child(7)").show();
		$(".newMembers .newMembersItem:nth-child(6)").show();
		$(".newMembers .newMembersItem").width("12%");
		return;
	} else
	if ((parseInt($(".newMembers").css("width")) < 960)&&(parseInt($(".newMembers").css("width")) > 840)) {
		$(".newMembers .newMembersItem").show();
		$(".newMembers .newMembersItem:nth-child(7)").show();
		$(".newMembers .newMembersItem:nth-child(6)").hide();
		$(".newMembers .newMembersItem").width("14%");
		return;
	} else
	if (parseInt($(".newMembers").css("width")) < 840) {		
		$(".newMembers .newMembersItem").show();
		$(".newMembers .newMembersItem:nth-child(6)").hide();
		$(".newMembers .newMembersItem:nth-child(7)").hide();
		$(".newMembers .newMembersItem").width("16%");
		return;
	}
}	

$(document).ready(function() {

		checkCountAdvert();
	
	
		$(".fullMembers a").hover(
		  function () {
			$(this).addClass("newMembersItemHov");
		  }, 
		  function () {
			$(".fullMembers a").removeClass("newMembersItemHov");
		  }
		);

		$(".newMembers a").hover(
		  function () {
			$(this).addClass("newMembersItemHov");
		  }, 
		  function () {
			$(".newMembers a").removeClass("newMembersItemHov");
		  }
		);		


		$(".readMoreLink").click(function() {
			$(this).toggleClass("readMoreLinkHide");
			$(this).parent().find(".hideBlockShow").toggle();
			return false;
		});

		$(".placeMarketLink[class ~= 'hasPopup']").click(function() {
			$(".popup-shape").hide();
			$(this).parent().find(".popup-shape").toggle();
			return false;
		});
		
		$(".popup-shape-wrap-head").live('click', function() {
			$(".popup-shape").hide();
			return false;
		});

		$(".newMembersItemImgPad").each(function(){
			var h = $(this).find("img").height();
			$(this).find("img").css("top", (80 - h)/2 + "px")
					
		});		
		
	
		
		
});

$(window).resize(function() {
	checkCountAdvert();
});


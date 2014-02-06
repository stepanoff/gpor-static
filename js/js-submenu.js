/*
submenu
 */
js_submenu = function(opts){

	var defaults = {
		'containerSelector' : '.js-submenu',
		'itemSelector' : '.b-submenu__item',
		'bubleContainer' : '.b-submenu-bubles',
		'bubleItem' : '.b-submenu__buble-list',
	};

	var o = $.extend({}, defaults, opts);
	var objSelector = $(o.containerSelector);
	var itemSelector = objSelector.find(o.itemSelector);
	var linkItemSelector = itemSelector.find(".b-submenu__link-drop");
	var bubleSelector = objSelector.find(o.bubleContainer); 
	var bubleItem = objSelector.find(o.bubleItem);
	var currentItemClass = "b-submenu__item_state_current";
	var linkDropItemClass = "b-submenu__link-drop";
	var itemSelectorSignHasSubmenu = ".b-submenu__item_layout_has-dropmenu";
	var itemSelectorSignStateHover = "b-submenu__item_hover_yes";
	var bubleItemClass = ".b-submenu__buble-list";
	
	
	function pasteSubmenu(obj) {
		var pos = obj.parent().index(o.itemSelector);
		var leftChords = obj.parents(o.itemSelector).position().left - 10;
		var bottomChords = obj.parents(o.itemSelector).position().top + obj.parents(o.itemSelector).height() - obj.parents(".b-submenu__pad").height() + 12;
		var itemWidth = obj.parent().width();
		var bubbleItemWidth = bubleItem.eq(pos).width();		
		var bItemWidth = bubbleItemWidth;
		var mItemWidth = itemWidth;
		
		bItemWidth = mItemWidth;
		
		var scaleSense = 100;
		
		if (mItemWidth < scaleSense) {
			itemWidth = scaleSense;
		} else {
			itemWidth = mItemWidth + 36;
		}
		
		bubleItem.eq(pos).css("width", itemWidth + 11 + "px");
		obj.closest(itemSelectorSignHasSubmenu).addClass(itemSelectorSignStateHover);
		bubleItem.eq(pos).css("left", leftChords + "px");
		bubleItem.eq(pos).css("top", bottomChords + "px");
		bubleItem.eq(pos).css("display", "block");		
	}
	
	objSelector.delegate("." + linkDropItemClass, 'mouseover', function(e) {
		e.preventDefault();
		e.stopPropagation();
		pasteSubmenu($(this));
	});
	
	objSelector.delegate(itemSelectorSignHasSubmenu, 'mouseout', function(e){
		if ((!$(e.relatedTarget).closest(itemSelectorSignHasSubmenu).eq(0).length)&&(!$(e.relatedTarget).closest(bubleItemClass).eq(0).length)) {
			bubleItem.css("display", "none");			
			$(itemSelectorSignHasSubmenu).removeClass(itemSelectorSignStateHover);
		}
	});	
	
	objSelector.delegate(o.bubleItem, 'mouseout', function(e){
		if ((!$(e.relatedTarget).closest(bubleItemClass).eq(0).length)&&(!$(e.relatedTarget).closest(o.itemSelector).eq(0).length)) {
			bubleItem.css("display", "none");			
			$(itemSelectorSignHasSubmenu).removeClass(itemSelectorSignStateHover);
		};
	});		
	
	$(window).resize(function() {
		pasteSubmenu($(this));
	});
	
	this.init = function () {}
	this.initUi = function () {}
};


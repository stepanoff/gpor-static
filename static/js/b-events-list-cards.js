b_events_list_cards = function(opts){

	var defaults = {
		'containerClass' : 'b-events-list-cards',
		'itemClass' : 'b-events-list-cards__col__item',
		'activeItemClass' : 'b-events-list-cards__col__item_type_green',
		'itemDescriptionClass' : 'b-events-list-cards__col__item__text',

		'sliderContainerClass' : 'b-events-list-cards__cols__frame',
		'columnsContainerClass' : 'b-events-list-cards__cols',
		'reportColumnClass' : 'b-events-list-cards__col_layout_reports',
		'columnClass' : 'b-events-list-cards__col',
		'columnLoadingClass' : 'b-events-list-cards__col_state_refresh',
		'columnShadowClass' : 'b-events-list-cards__col__hidden-popup-shadow',
		'startIndex' : 0,
		'colWidth' : 260,
		'pageContainerClass' : 'page-col-1-span-15',
		'nextLinkClass' : 'b-events-list-cards__head__link_pos_next',
		'prevLinkClass' : 'b-events-list-cards__head__link_pos_prev',
		'totalLeftClass' : 'b-events-list-cards__head__count_pos_left',
		'totalRightClass' : 'b-events-list-cards__head__count_pos_right',
		'reportText' : 'фотоотчеты',
		'totalCards' : 0,
		'totalColumns' : 0,
		'columnTemplate' : false,
		'reportsTemplate' : false,
		'columnRefreshTemplate' : false,
		'pageDataContext' : {},
		'columnItemsContext' : {},
		'reportsContext' : {},
		'regUrlBegin' : /.*?\/afisha\/event\//,
		'regUrlValue' : /\d{2}-\d{2}-\d{4}/
	};

	// date from url for working back-button in browser
	var urlDate = false;

	var o = $.extend({}, defaults, opts);
	var obj = $("."+o.containerClass);
	var eventCardsContainer = obj;

	var items = false;
	var totalCards = false;
	var totalColumns = false;
	var reportColumn = false;
	var gCurIndex = false;
	var gColWidth = false;
	var gActiveItems = 0;

	var slideContainer = $(eventCardsContainer).find("."+o.sliderContainerClass);
	var nextLink = $(eventCardsContainer).find("."+o.nextLinkClass);
	var prevLink = $(eventCardsContainer).find("."+o.prevLinkClass);
	var totalLeft = $(eventCardsContainer).find("."+o.totalLeftClass);
	var totalRight = $(eventCardsContainer).find("."+o.totalRightClass);


	var eventsListCardsFixWidth = function () {
		screenWidth = $(window).width();

		if (screenWidth < 1200) {
			$("."+o.itemClass).css("width", 218 + "px");
		} else {
			$("."+o.itemClass).css("width", 228 + "px");
		}
		if (reportColumn)
			reportColumn.width((obj.width()-20) + "px");

		gActiveItems = calcVisibleColumns();
	};

	var fixEventsColsHeight = function () {
		var index = gCurIndex;
		var curIndex = gCurIndex;
		var activeItems = gCurIndex + gActiveItems;

		max = 0; //максимальная высота видимых колонок
		maxIndex = 0; //индекс самой высокой колонки

		$(eventCardsContainer).find("."+o.columnClass).css("height", "auto"); //у скрываемых колонок ставим дефолтную высоту
		$(eventCardsContainer).find("."+o.columnClass+"__body").css("height", "auto");//у скрываемых колонок ставим дефолтную высоту

		// определяем максимальную высоту видимых ячеек
		for (var i = index; i < activeItems; i++) {
			var h = $(eventCardsContainer).find("."+o.columnClass).eq(i).height();
			if (h > max) {
				max = h;
				maxIndex = i;
			}
		}

		//В самой высокой колонке ищем последний элемент и к общей высоте этой колонки добавляем высоту невидимого блока с текстом
		boxTextHeight = $(eventCardsContainer).find("."+o.columnClass).eq(maxIndex).find("."+o.itemClass+":last").find("."+o.itemClass+"__text").height();

		//устанавливаем эту максимальную высоту для видимых колонок
		$(eventCardsContainer).find("."+o.columnsContainerClass).css("height", max + boxTextHeight + 50 + "px");
		$(eventCardsContainer).find("."+o.columnClass+"__body").css("height", max + boxTextHeight + 50 + "px");

	};

	// Считаем количество видимых колонок
	var calcVisibleColumns = function () {
		// Ширина одной узкой колонки
		var columns = (reportColumn)
			? $(eventCardsContainer).find("."+o.columnClass).first().next()
			: $(eventCardsContainer).find("."+o.columnClass).first();

		var colWidth = (columns.length>0) ? columns.width() : 0;
		var containerWidth = $(eventCardsContainer).width();
		if(colWidth == 0)
			return 0;
		else
			return Math.round( containerWidth/colWidth );
	};

	var checkCaroosel = function () {
		var index = gCurIndex;
		var currActiveItems = (reportColumn && index == 0)? 1 : gActiveItems;

		if (currActiveItems + index > totalColumns) {
			nextLink.hide();
		} else {
			nextLink.show();
		}

		if (index <= 0) {
			prevLink.hide();
		} else {
			prevLink.show();
		}


		// кол-во событий
		var previosCount = 0;
		var visibleCount = 0;

		var previosMinIndex = gCurIndex;
		var nextMinIndex = currActiveItems + gCurIndex;    // Если находимся на столбце с фотоотчетом, то видимых столбцов 1

		var curIndex = 0;
		var colsLength = $(eventCardsContainer).find("."+o.columnClass).length;

		$(eventCardsContainer).find("."+o.columnClass).each(function(){
			if (curIndex < previosMinIndex)
			{
				previosCount += $(this).find("."+o.itemClass).length;
			}
			else if (curIndex < nextMinIndex)
			{
				visibleCount += $(this).find("."+o.itemClass).length;
			}

			curIndex++;
			if (curIndex == colsLength)
			{
				var nextCount = totalCards - visibleCount - previosCount;

				var html = eventsText(nextCount);
				totalRight.html(html);

				html = eventsText(previosCount);
				if (!previosCount && reportColumn && index > 0)
				{
					html = o.reportText;
				}
				totalLeft.html(html);
			}

		});
	};

	var eventsText = function (total) {
		var html = '';
		if (total) {
			html = total + ' событ' + app.string.plural(total,'ие','ия','ий');
		}
		return html;
	};



	var slideEventsCols = function (i) {
		switch (i) {
			case (1): {
				gCurIndex++; //смещаем стартовую позицию
				if (!(reportColumn && gCurIndex==0))
				{
					var date = $(items[gCurIndex]).attr('rel');
					app.url.changePart( app.date.timestampToDate(date), o.regUrlBegin, o.regUrlValue );
				}
				moveToIndex(gCurIndex);
				// подгрузка событий
				var countItems = $(eventCardsContainer).find("."+o.columnClass).length;
				if ((gActiveItems + gCurIndex) < countItems) {
				} else if (countItems < totalColumns) {
					var link = nextLink.attr("href");
					uploadColumn(link);
					return false;
				}
			}
				break;
			case (-1): {
				gCurIndex--; //смещаем стартовую позицию
				if (!(reportColumn && gCurIndex==0))
				{
					var date = $(items[gCurIndex]).attr('rel');
					app.url.changePart( app.date.timestampToDate(date), o.regUrlBegin, o.regUrlValue );
				}
				moveToIndex(gCurIndex);
			}
				break;
		}
		fixEventsColsHeight(); //фиксим высоту колонок
		checkCaroosel();//следим за отображением контролов

	};

	var moveToIndex = function (index) {
		if (index==undefined || index===false)
			index = gCurIndex;
		gCurIndex = index;
		var w = -10;
		for (i=0; i<index; i++)
			w += items.eq(i).width()+10;
		if (w < 0)
			w = 10;
		else
			w = '-'+w;
		$(slideContainer).animate({marginLeft: w+"px"}, 400);

		fixEventsColsHeight();
		checkCaroosel();
	};

	var moveToDate = function (date, isChangeUrl) {
		var i = 0;
		var found = false;
		items.each(function(){
			if ($(this).attr("rel") == date) {
				found = i;
			}
			i++;
		});
		if (found!==false) {
			if (isChangeUrl)
				app.url.changePart( app.date.timestampToDate(date), o.regUrlBegin, o.regUrlValue );
			moveToIndex(found);
		}
		else {
			// NOTE: Сюда можно дойти например при нажатии "назад" в браузере
			// alert("Надо подгружать данные за эту дату");
			// todo: надо подгрузить события за дату
		}
	};

	var uploadColumn = function (link) {
		var div = $("<div>");
		div.addClass(o.columnClass);
		div.addClass(o.columnClass+"_type_grey");
		div.addClass(o.columnLoadingClass);
		var _newIndex = gActiveItems + gCurIndex + 1;
		div.attr("id", "list-item-"+_newIndex);
		div.css("width", gColWidth+'px');
		div.html('<div class="b-events-list-cards__col__head"><span></span><em>Загрузка событий...</em><ins>подождите чуть-чуть</ins></div>');
		slideContainer.append(div);

		//app.ajax.ajaxPage(link);
	};

	var obtainAjaxData = function (evt) {

		var result = evt['result'] ? evt['result'] : false;
		var contextData = result;
		if (contextData) {
			for (i in o.pageDataContext) {
				if (contextData[o.pageDataContext[i]]){
					contextData = contextData[o.pageDataContext[i]];
				}
				else {
					contextData = false;
					break;
				}
			}
		}

		slideContainer.html('');

		app.renderTemplate (o.reportsTemplate, slideContainer, {
			'context' : o.reportsContext,
			'data' : contextData,
			'insertType' : 'append'
		});

		app.renderTemplate (o.columnTemplate, slideContainer, {
			'context' : o.columnItemsContext,
			'data' : contextData,
			'insertType' : 'append',
			'list' : true
		});

		app.effect.ajaxReloadingEnd(slideContainer);
		init(contextData);
	};

	var beforePageReloaded  = function (evt) {
		app.effect.ajaxReloadingStart(slideContainer);
		urlDate = false;
	};

	var obtainDateChangedEvent = function (evt) {
		var value = typeof evt == "string" ? evt : evt['value'];
		if (value)
			moveToDate(value);
	};

	/**
	 * Обработчик изменения урла при нажатии на кнопках "вперед/назад" в браузере
	 */
	var onUrlChanged = function (evt) {
		gCurIndex = getStartIndex(evt.url);
		moveToIndex(gCurIndex);
	};

	var getStartIndex = function(url) {
		var index = reportColumn ? 1 : 0;
		var date = false;

		if(typeof url == 'undefined')
			url = $.url();

		var res = url.attr('source').match( o.regUrlBegin.source + "(" + o.regUrlValue.source + ")" );

		if (res && res[1])
			date = app.date.dateToTimestamp(res[1], 4);    // 4 - our days start at 4:00
		else
			return index; // даты в урле нет - переходим к первому элементу

		// Ищем индекс элемента по дате в урле
		var i = 0;
		var found = false;
		items.each(function(){
			if ($(this).attr("rel") == date) {
				found = i;
			}
			i++;
		});
		index = found;

		urlDate = date; // переопределяем текущую дату
		return index;
	};

	var init = function (opts) {
		opts = opts ? opts : o;
		totalCards = opts.totalCards;
		totalColumns = opts.totalColumns;
		reportColumn = eventCardsContainer.find("."+o.reportColumnClass);
		if (!reportColumn.length)
			reportColumn = false;
		items = $(eventCardsContainer).find("."+o.columnClass);
		gCurIndex = getStartIndex();
		gColWidth = opts.colWidth;
		gActiveItems = calcVisibleColumns();    //сколько видимых колонок
		$(slideContainer).width(1100+(gColWidth+10)*totalColumns);

		eventsListCardsFixWidth();
		moveToIndex();
	};

	// events, etc
	prevLink.click(function() {
		slideEventsCols(-1);
		return false;
	});
	nextLink.click(function() {
		slideEventsCols(1);
		return false;
	});

	//ховер событий
	eventCardsContainer.delegate("."+o.itemClass, 'mouseover', function() {
		if ($(this).hasClass(o.activeItemClass))
			return;
		$(this).parent().find("."+o.columnShadowClass).show();
		$(this).addClass(o.activeItemClass);
		$(this).find("."+o.itemDescriptionClass).css("display", "block").css("zIndex", 100);
		$(this).css("zIndex", 10);
	});
	eventCardsContainer.delegate("."+o.itemClass, 'mouseout', function() {
		$(this).css("zIndex", 0);
		$(this).find("."+o.itemDescriptionClass).css("display", "none").css("zIndex", 0);
		$(this).removeClass(o.activeItemClass);
		$(this).parent().find("."+o.columnShadowClass).hide();
	});

	app.addListener ('beforePageReloaded', beforePageReloaded);
	app.addListener ('pageReloaded', obtainAjaxData);
	app.addListener ('dateChanged', obtainDateChangedEvent);
	app.addListener ('urlChanged', onUrlChanged);

	$(window).resize(function(){
		eventsListCardsFixWidth();
		moveToIndex();
	});

	// init
	this.init = function (opts) {
		init(opts);
	};

	this.initUi = function () {

	}
};
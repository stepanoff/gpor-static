/*
* Модуль сохраняет внешнее состояние объектов, до обновления данных, потом возвращает все на место
* Слушает события:
* - beforePageReloaded - запускаем механизм сохранения
* - contentReplaced - запускаем механизм возврата к прежнему состоянию
*
* Запоминает атрибуты: class, style
*
* */
js_consistency = function(opts){

	var defaults = {
		'containerSelector' : 'body', // В пределах какого элемента ищем
		'targetSelectors' : {}, // Состояние каких элементы запоминаем
		'idSelector': '' // Селектор элемента, у которого берем Id
	};

	var _state = [];

	var o = $.extend({}, defaults, opts);

	var uiStateSave = function(evnt) {
		$(o.containerSelector + ' ' + o.idSelector + '[id]').each(function(i,e) {
			var targetState = [];
			$.each(o.targetSelectors, function(i,targetParam) {
				if(targetParam && typeof targetParam == "string")
				{
					var target = $(e).find(targetParam);
					targetState.push({targetParam: targetParam, class_: target.attr('class'), style_: target.attr('style')});
				}
			});
			_state.push({
				t: $(e).attr('id'),
				state: targetState
			});
		});
	};

	var uiStateApplay = function(evnt) {
		$.each(_state, function(i,object) {
			$.each(object.state, function(j,targetState) {
				$('#' + object.t + ' ' + targetState.targetParam).attr('class', targetState.class_).attr('style', targetState.style_);
			});
		});
	};

	// start
	this.init = function () {
		app.addListener ('beforePageReloaded', uiStateSave);
		app.addListener ('contentReplaced', uiStateApplay);
	};

	this.initUi = function () {

	};
};

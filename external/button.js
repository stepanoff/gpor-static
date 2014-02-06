(function () { 
/**
 *	Объект для работы с кнопкой.
 */
var _share_button = {
	 
	/**
	 *	Имя хоста с http://
	 */
	domen: "{{site.siteDomain}}",
    liteurl: "{{site.liteUrl}}",
	
	/**
	 *	Создание полноценной кнопки из ссылки заменителя.
	 *	@return bool
	 */
	CreateButton:function(){
		//узел для замены
		var replTag = this.ReplaceTag();
		if(replTag===null) return false;
		//формирование iframe по заменяемому тегу
		var butFrame = this.CreateFrame(replTag);
		//интеграция iframe
		replTag.parentNode.replaceChild(butFrame, replTag);
		
		//
		return true;
	},
	
	/**
	 *	Получение тега, который будет заменен на iframe.
	 *	@return Node|null Узел DOM структуры или null если ничего не найдено.
	 */
	ReplaceTag:function(){
		var links = document.getElementsByTagName('a');
		for(var i in links){
			if(links[i].getAttribute&&links[i].className=="share-button"){
				return links[i];
			}
		}
		return null;
	},
	
	ResolveHostName:function() {
		var from = window.location.hostname;
		var domen2 = this.domen;
		if (this.domen.indexOf('www') == -1)
			domen2 = 'www.'+domen2;
		else
			domen2 = domen2.replace('www.','');

		if(from == this.domen)
			return this.domen;
		else
			return domen2;
	},
	
	/**
	 *	Формирование iframe, который подгрузит кнопку.
	 *	@return Node
	 */
	CreateFrame:function(node){
		//получение параметров
		var type = node.getAttribute('data-type')?node.getAttribute('data-type'):"default";
		var currentURL = node.getAttribute('data-url')?node.getAttribute('data-url'):"http://"+window.location['hostname']+window.location['pathname'];
		var pageTitle = node.getAttribute('data-title')?node.getAttribute('data-title'):_pparser.PageTitle();
		var pageDescr = node.getAttribute('data-about')?node.getAttribute('data-about'):_pparser.PageDescription();
		//фопрмирование адреса источника данных
		var frame_src = "http://"+this.ResolveHostName()+this.liteurl+"button/?";
		frame_src += "type="+encodeURIComponent(type)+"&";
		frame_src += "url="+encodeURIComponent(currentURL)+"&";
		frame_src += "title="+encodeURIComponent(pageTitle)+"&";
		frame_src += "about="+encodeURIComponent(pageDescr);
		//формирование фрейма
		var frm = document.createElement('iframe');
		frm.setAttribute("src", frame_src);
		frm.setAttribute("frameborder", "0");
		frm.setAttribute("scrolling", "no");
		frm.setAttribute("allowtransparency", "true");
		//если кнопки разных форм
		if(type=="default"){
			frm.setAttribute("width", "150");
			frm.setAttribute("height", "20");
		}
		return frm;
	},
	
	Run:function(){
		this.AddLoadEvent(function(){_share_button.CreateButton()});
	},
	
	AddLoadEvent: function (func) {
		var oldonload = window.onload;
		if (typeof window.onload != 'function') {
			window.onload = func;
		} else {
			window.onload = function() {
				if (oldonload) {
					oldonload();
				}
				func();
			}
		}
	}
	
};//

/**
 *	Объект для парснинга содержимого страницы
 */
var _pparser = {
	
	/**
	 *	Получение мето тега по имени.
	 *	@param name string Значение атрибута name у мето тега.
	 *	@return  Node|null
	 */
	metaByName: function(name){
		var metas = document.getElementsByTagName('meta');
		if(metas.length==0) return null;
		for(var i=0; i<metas.length; i++){
			if(metas[i].getAttribute('name')==name) return metas[i];
		}
		return null;
	},
	
	/**
	 *	Получение содержания мето тега страницы description.
	 *	@return string
	 */
	PageDescription:function(){
		var meta = this.metaByName('description');
		if(meta===null) return '';
		return (new String(meta.getAttribute('content'))).substring(0, 1000);
	},
	
	/**
	 *	Получение содержания title страницы.
	 *	@return string
	 */
	PageTitle:function(){
		var title = document.getElementsByTagName('title');
		return title[0]?title[0].innerHTML:"Это интересно";
	}
	
};

//Запуск кнопки когда готов DOM
_share_button.Run();

}());
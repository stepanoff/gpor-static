(function($){
	$.fn.advert_tables = function(opts){
	opts = $.extend({}, $.fn.advert_tables.defaults, opts);
		return this.each(function(){
			$.fn.advert_tables.instances[$(this).attr('id')] = new AdvertTables(this, opts, $(this).attr('id') );
			return $.fn.advert_tables.instances[$(this).attr('id')];
		});
	};
	
	$.fn.advert_tables.instances = new Object();
	$.fn.advert_tables_refresh = function(){
	};	
	
	// default options
	$.fn.advert_tables.defaults = {
	};

	var AdvertTables = function(obj, o, instance_id){
		
		// TODO: Переделать этот бред с классами на нормальный доступ по ID
		$(obj).delegate ("a.advert-tables-addRow", "click", function(){advertTablesEditRow (this);return false;});
		$(obj).delegate ("a.advert-tables-addRowType", "click", function(){advertTablesAddRowType (this);return false;});
		$(obj).delegate ("a#js_advert_tables_editRow", "click", function(){advertTablesEditRow (this);return false;});
		$(obj).delegate ("a.advert-tables-editRowType", "click", function(){advertTablesEditRowType (this);return false;});
		$(obj).delegate ("a.advert-tables-addTable", "click", function(){advertTablesAddTable (this);return false;});
		$(obj).delegate ("a.advert-tables-editTable", "click", function(){advertTablesEditTable (this);return false;});
		
		var advertTablesAddRow = function (el)
		{
			containerId = "advert-tables-addRowContainer";
			container = $("#"+containerId);
			href = $(el).attr("href");
			attr = $(el).attr("setAttr").split(":");
			attrName = attr[0];
			attrValue = attr[1];
			
			container.find("form").find('input[name*="'+attrName+'"]').attr("value", attrValue);
			container.find("form").attr("action", href);
			$.popup.show({ title: '', content: container.html(), width: 800 });
		}

		var advertTablesEditRow = function (el)
		{
			el = el?el:this;
			urlStr = $(el).attr("href");
		    var options = {
		            url: urlStr,
		            success: function (data) {
		                $.popup.show({ title: '', content: data, width: 800 });
		            },
		            type: 'GET'
		        };

		    $.ajax(options);
		}

		var advertTablesAddRowType = function (el)
		{
			containerId = "advert-tables-addRowTypeContainer";
			container = $("#"+containerId);
			href = $(el).attr("href");
			attr = $(el).attr("setAttr").split(":");
			attrName = attr[0];
			attrValue = attr[1];
			
			container.find("form").find('input[name*="'+attrName+'"]').attr("value", attrValue);
			form = container.find("form");
			form.attr("action", href);
			$.popup.show({ title: '', content: container.html(), width: 800 });
		}

		var advertTablesAddTable = function (el)
		{
			containerId = "advert-tables-addTableContainer";
			container = $("#"+containerId);
			href = $(el).attr("href");
			form = container.find("form");
			form.attr("action", href);
			$.popup.show({ title: '', content: container.html(), width: 800 });
		}

		var advertTablesEditRowType = function (el)
		{
			el = el?el:this;
			urlStr = $(el).attr("href");
		    var options = {
		            url: urlStr,
		            success: function (data) {
		                $.popup.show({ title: '', content: data, width: 800 });
		            },
		            type: 'GET'
		        };

		    $.ajax(options);
		}

		var advertTablesEditTable = function (el)
		{
			el = el?el:this;
			urlStr = $(el).attr("href");
		    var options = {
		            url: urlStr,
		            success: function (data) {
		                $.popup.show({ title: '', content: data, width: 800 });
		            },
		            type: 'GET'
		        };

		    $.ajax(options);
		}

		var advertTablesSendRequest = function (urlStr)
		{
		    var options = {
		            url: urlStr,
		            data: { },
		            success: function (data) {
		                $.popup.show({ title: '', content: data, width: 800 });
						/*
		                $('#sendResumeForm').ajaxForm({
		                	data: { ajax : 1, referer: '{{ referer }}' },
		                	beforeSubmit: function(a,f,o) {
		                	},
		                	success: function(data) {
		                        //$.popup.hide();
		                		//$.popup.show({ title: '', content: data, width: 800 });
			                	$('#sendResumeFormFields').html(data);
		                	}

		                });
		                */
		            },
		            type: 'post'
		        };

		    $.ajax(options);
		}
	};

	function checkEditable() {
        $("body").on("click",".form_edit_confirm a",function(){
        	var this_a = $(this);
        	this_a.find('.icon-edit').after('<span class="drag_drop_throbber ajax_loader"></span>');
                $.getJSON(this_a.closest('.form_edit_confirm').attr('data-urlCheck'), function(json) {
                        if (json["data"]>0) {
                                if (confirm("Редактирование формы приведёт к удалению всех её результатов. Удалить результаты и перейти к редактированию?")) {
                                	$.getJSON(this_a.closest(".form_edit_confirm").attr("data-urlremove"), 
                                		function(json) {
                                		if (json["error"]==0) window.location = this_a.attr("href");
                                		else {
	                                		alert(json["error"]);
	                                		$('.drag_drop_throbber').remove();
                                		}
                                	});
                                }
                                else $('.drag_drop_throbber').remove();
                        }
                        else window.location = this_a.attr("href");
                });
                return false;
        });
    }

	function makeSortable() {

		if (($('.pagination li').length)&&($('.for-ui-sortable').length)) alert('ALARM! Постраничная разбивка и сортировка перетаскиванием обнаружены одновременно! Это будет работать плохо! Примите меры!');

		var fixHelper = function(e, tr) {
		    var $originals = tr.children();
		    var $helper = tr.clone();
		    $helper.children().each(function(index)
		    {
		      $(this).width($originals.eq(index).width())
		    });
		    return $helper;
		};	

		$( ".for-ui-sortable" ).sortable({
			helper: fixHelper,
			cursor: "move",
			stop: function(event,ui) {
				
				ui.item.find('.icon-resize-vertical').after('<span class="drag_drop_throbber ajax_loader"></span>').hide();

				var order = {};

				$(this).children().each(function(i) {
					order[$(this).attr('data-id')] = i;
				});
				$.post($(this).attr('data-url'), {order: order}, function(){
					$('.drag_drop_throbber').remove();
					$('.icon-resize-vertical').show();
				});
				
			}
		}).disableSelection();
	}

	setTimeout(makeSortable,500);
	setTimeout(checkEditable,500);
	
    

})(jQuery);
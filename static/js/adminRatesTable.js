(function($){
	$.fn.banki_rates = function(opts){
	opts = $.extend({}, $.fn.banki_rates.defaults, opts);
		return this.each(function(){
			$.fn.banki_rates.instances[$(this).attr('id')] = new BankiRates(this, opts, $(this).attr('id') );
			return $.fn.banki_rates.instances[$(this).attr('id')];
		});
	};
	
	$.fn.banki_rates.instances = new Object();
	$.fn.banki_rates_refresh = function(){
	};	
	
	// default options
	$.fn.banki_rates.defaults = {
	};

	var BankiRates = function(obj, o, instance_id){
		
		$(obj).delegate ("a.banki-rates-table-addCol", "click", function(){bankiRatesTableAddCol (this);return false;});
		$(obj).delegate ("a.banki-rates-table-addRow", "click", function(){bankiRatesTableAddRow (this);return false;});
		$(obj).delegate ("a.banki-rates-table-addRate", "click", function(){bankiRatesTableAddRate (this);return false;});
		$(obj).delegate ("a.banki-rates-table-editCol", "click", function(){bankiRatesTableEditCol (this);return false;});
		$(obj).delegate ("a.banki-rates-table-editRow", "click", function(){bankiRatesTableEditRow (this);return false;});
		$(obj).delegate ("a.banki-rates-table-editRate", "click", function(){bankiRatesTableEditRate (this);return false;});
		
		var bankiRatesTableAddCol = function (el)
		{
			containerId = "banki-rates-table-addColContainer";
			container = $("#"+containerId);
			href = $(el).attr("href"); 
			container.find("form").attr("action", href);
			$.popup.show({ title: '', content: container.html(), width: 800 });
		}

		var bankiRatesTableEditCol = function (el)
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

		var bankiRatesTableEditRow = function (el)
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

		var bankiRatesTableAddRow = function (el)
		{
			containerId = "banki-rates-table-addRowContainer";
			container = $("#"+containerId);
			href = $(el).attr("href");
			form = container.find("form");
			form.attr("action", href);
			$.popup.show({ title: '', content: container.html(), width: 800 });
		}

		var bankiRatesTableAddRate = function (el)
		{
			containerId = "banki-rates-table-addRateContainer";
			container = $("#"+containerId);
			href = $(el).attr("href");
			//buttons = container.closest('form').find('.admin-fixed-panel');
			$.popup.show({ title: '', content: container.html(), width: 800 });
		}

		var bankiRatesTableEditRate = function (el)
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
		
		var bankiSendRequest = function (urlStr)
		{
		    var options = {
		            url: urlStr,
		            data: { },
		            success: function (data) {
		                $.popup.show({ title: '', content: data, width: 800 });
		            },
		            type: 'post'
		        };

		    $.ajax(options);
		}
	};
})(jQuery);
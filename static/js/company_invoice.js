/*
Форма выставления счета
для нормального ф-рования нужны jQuery
*/
		companyInvoice = function(options)
		{
			options = options?options:{};
			this.formObj = new Object ();
			this.tariffObj = new Object ();
			this.servicesObj = new Object();

			this.options = $.extend({
			formId : 'companyInvoice',
			tariffObjClass : 'tariffItems',
			servicesObjClass : 'servicesItems',
			tariffItemClass : 'order',
			tariffAmountClass : 'amount',
			tariffOnClass : 'on',
			serviceItemClass : 'order',
			servicePeriodOnClass : 'on',
			serviceAmountClass : 'amount',
			tariffSum : 'tariffsSum',
			servicesSum : 'servicesSum',
			totalSum : 'totalSum',
			sendFunction : false,
			sendUrl : false
			}, options);
			
			this.callback = function (func,obj,args)
			{
				var args = args ? args : [];
				var scope = obj ? obj : this;
				func.apply(scope,args);
			}
			this.init();
		}
		
		companyInvoice.prototype.init=function()
		{
			this.formObj = $("#"+this.options.formId);
			this.tariffObj = $("#"+this.options.formId+" ."+this.options.tariffObjClass);
			this.servicesObj = $("#"+this.options.formId+" ."+this.options.servicesObjClass);
			this.reset();
		}
		
		companyInvoice.prototype.reset=function()
		{
			__ci = this;
			$(this.tariffObj).find("."+this.options.tariffOnClass).click(function(){__ci.tariffChange(this);});
			$(this.tariffObj).find("."+this.options.tariffAmountClass).bind('keyup',function(){__ci.tariffAmountChange(this);});
			$(this.servicesObj).find("."+this.options.servicePeriodOnClass).click(function(){__ci.servicePeriodChange(this);});
			$(this.servicesObj).find("."+this.options.serviceAmountClass).bind('keyup',function(){__ci.serviceAmountChange(this);});
			
			tariffOnClass = this.options.tariffOnClass;
			tariffAmountClass = this.options.tariffAmountClass;
			$(this.tariffObj).find("."+this.options.tariffItemClass).each(function(){
					checked = $(this).find("input:checked");
					if (!checked.length || checked.attr("value")=="")
					{
						$(this).find("."+tariffAmountClass).attr("disabled","disabled");
					}
				});
			serviceOnClass = this.options.serviceOnClass;
			serviceAmountClass = this.options.serviceAmountClass;
			$(this.servicesObj).find("."+this.options.serviceItemClass).each(function(){
					checked = $(this).find("input:checked");
					if (!checked.length || checked.attr("value")=="")
					{
						$(this).find("."+serviceAmountClass).attr("disabled","disabled");
					}
				});
		}
		
		companyInvoice.prototype.tariffChange = function(obj)
		{
			this.tariffObj.find("."+this.options.tariffAmountClass).attr("disabled","disabled");
			this.tariffObj.find("."+this.options.tariffOnClass).removeAttr("checked");
			$(obj).parents("."+this.options.tariffItemClass).find("."+this.options.tariffAmountClass).removeAttr("disabled");
			$(obj).attr("checked","checked");
			this.reCalculate();
		}
				
		companyInvoice.prototype.tariffAmountChange = function(obj)
		{
			this.reCalculate();
		}
		
		companyInvoice.prototype.servicePeriodChange = function(obj)
		{
			value = obj.value;
			if (value=="")
			{
				$(obj).parents("."+this.options.serviceItemClass).find("."+this.options.serviceAmountClass).attr("disabled","disabled");
			}
			else
			{
				$(obj).parents("."+this.options.serviceItemClass).find("."+this.options.serviceAmountClass).removeAttr("disabled");
			}
			this.reCalculate();
		}
		
		companyInvoice.prototype.serviceAmountChange = function(obj)
		{
			this.reCalculate();
		}
		
		companyInvoice.prototype.reCalculate = function()
		{
			tmp = $(this.formObj).serialize();
			send_data = {};
			send_data.data = tmp;
			url = this.options.sendUrl+"?submitted=1";
			this.options.sendFunction.apply(this,[url, send_data]);
		}

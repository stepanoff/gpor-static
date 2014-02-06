(function ($) {
		// send simple form without file fileds
		$.ajaxMessagesSendForm = function (formObj, url, callback)
		{
				callback = callback?callback:false;
				url = url?url:formObj.action;
				tmp = $(formObj).serialize();
				send_data = new Object();
				send_data['jqueryForm'] = tmp;
				url = url+"?submitted=1";
				$.ajaxCallback (url, send_data, callback);
		};

		// send simple form with file fileds
		$.ajaxMessagesSendIframeForm = function (formObj, url, callback)
		{
				callback = callback?callback:false;
				url = url?url:formObj.action;
				
				var optionsSuccess = callback;
				
			    function callbackFunc(data) {

			        if (!data) {
			            return;
			        }
			        
					if (data.messages)
					{
						Messager.addMessages(data.messages);
						delete (data['messages']);
					}

			        if (data.success) {

			            data.success.call(this, data);
			        }

			        else {

			            optionsSuccess.call(this, data);
			        }

			        if (data) {

			            for (i in data) {

			                $('#' + i).html(data[i]);
			            }
			        }
			    }

			    options.success = callback;		
				
				$(formObj).ajaxForm({
					data: {ajax : 1, iframeAjax : 1},
					success: callbackFunc
				});
				$(formObj).submit();
				return false;	
		}
			
})(jQuery);

/*
Очередь всплывающих окон
для нормального ф-рования нужны jQuery
*/
		messQueue=function(options)
		{
			options = options?options:{};
			this.queueObj = new Object();
			this.messageObj = new Object();
			this.listObj = new Object();
			this.indexSpan = new Object();
			this.totalSpan = new Object();
			this.skipLink = new Object();
			this.prevLink = new Object();
			this.index = 0;
			this.messages = new Array ();
			
			this.options = $.extend({
			messDiv : 'informerMessages',
			messContainer : 'messageContainer',
			messContainerClass : 'messageContainer',
			listContainer : 'listContainer',
			messClass : 'informerMessage',
			controlsClass : 'controls',
			contentClass : 'messageContent',
			titleClass : 'title',
			actionBtnClass : 'action',
			closeActionClass : 'close',
			updateActionClass : 'update',
			nextActionClass : 'next',
			readActionClass : 'read',
			btnClass : 'button',
			skipWord : 'след.',
			prevWord : 'пред.',
			showOnStart : true,
			sendFunction : false,
			readUrl : '/informer/read/'
			}, options);
			
			this.readUrl = this.options.readUrl;
			
			this.callback = function (func,obj,args)
			{
				var args = args ? args : [];
				var scope = obj ? obj : this;
				func.apply(scope,args);
			}
			this.init();
		}
		
		messQueue.prototype.init=function()
		{
			this.queueObj = $("#"+this.options.messDiv);
			$(this.queueObj).hide();
			this.messObj = $('<div>').attr('id', this.options.messContainer).addClass(this.options.messContainerClass).insertAfter("#"+this.options.messDiv);
			$(this.messObj).dialog({ autoOpen: false, modal: true, resizable: false, draggable: false });
			
			this.listObj = $('<div>');
			$(this.listObj).addClass(this.options.controlsClass);
			$(this.listObj).append('<a class="prev" href="#" id="'+this.options.messContainer+'Prev">'+this.options.prevWord+'</a>');
			$(this.listObj).append('<span class="index"></span> из <span class="total"></span>');
			$(this.listObj).append('<a class="skip" href="#" id="'+this.options.messContainer+'Skip">'+this.options.skipWord+'</a>');
			this.totalSpan = $(this.listObj).find(".total");
			this.indexSpan = $(this.listObj).find(".index");
			this.skipLink = $(this.listObj).find(".skip");
			this.prevLink = $(this.listObj).find(".prev");
			
			this.refresh();
		}
		
		messQueue.prototype.refresh=function()
		{
			messages = $(this.queueObj).children("."+this.options.messClass);
			_this = this;
			if(messages.length)
			{
				$(messages).each(function(index){
					id = _this.options.messClass+index;
					$(this).attr('id', id);
					_this.addMessage(id);
				});
				if (this.options.showOnStart)
				{
					this.show();
				}
			}
		};
		
		messQueue.prototype.addMessage = function(id)
		{
			this.messages[(this.messages.length)] = id;
		};
		
		messQueue.prototype.addMessages = function(data)
		{
			if (data=="")
				return;
			$(this.queueObj).prepend(data);
			this.refresh();
		};		
		
		messQueue.prototype.show=function()
		{
			id = this.messages[this.index];
			html = $("#"+id).html();
			$(this.messObj).html(html).show();
			//$(this.messObj).dialog( "option", "buttons", { "Ok": function() { $(this).dialog("close"); } } );
			this.refresh_content();
			$(this.messObj).dialog('open');
		};
		
		messQueue.prototype.refresh_content=function()
		{
			$_this = this;
			$(this.messObj).find("."+_this.options.closeActionClass).click(function(){_this.close();return false;});
			$(this.messObj).find("."+_this.options.nextActionClass).click(function(){_this.next();return false;});
			$(this.messObj).find("."+_this.options.updateActionClass).click(function(){_this.update();return false;});
			$(this.messObj).find("."+_this.options.readActionClass).click(function(){_this.read($(this));return false;});
			$(this.messObj).find("."+_this.options.actionBtnClass).click(function(){_this.send($(this));return false;});
			
			messTitle = '';
			if ($(this.messObj).find("."+_this.options.titleClass).get()!=0)
			{
				messTitleObj = $(this.messObj).find("."+_this.options.titleClass);
				messTitle = $(messTitleObj).html();
				$(messTitleObj).remove();
				$(this.messObj).dialog('option', {"title": messTitle});
			}

			if ($(this.messObj).find("."+_this.options.listContainer).get()!=0)
			{
				$(this.indexSpan).html((this.index+1));
				$(this.totalSpan).html((this.messages.length));
				if (this.index == 0)
					$(this.prevLink).hide();
				else
				{
					$(this.prevLink).click(function(){_this.prev();return false;});
					$(this.prevLink).show();
				}
				if (this.index >= this.messages.length-1)
					$(this.skipLink).hide();
				else
				{
					$(this.skipLink).click(function(){_this.skip();return false;});
					$(this.skipLink).show();
				}
				$(this.listObj).appendTo($(this.messObj).find("."+_this.options.listContainer));
			}
		};
		
		messQueue.prototype.next=function()
		{
			id = this.messages.splice(this.index,1);
			if (this.messages.length)
			{
				if (this.messages[this.index])
				{}
				else
					this.index = 0;
				this.show();
			}
			else
				this.close();
		};
		
		messQueue.prototype.close=function()
		{
			$(this.messObj).dialog('close');
			$(this.messObj).hide();
			$(this.queueObj).html('');
			this.messages = new Array();
		};
		
		messQueue.prototype.skip=function()
		{
			this.index++;
			if (this.messages[this.index])
			{
				this.show();
			}
			else
				this.index--;
		};
		
		messQueue.prototype.prev=function()
		{
			this.index--;
			if (this.index>=0 && this.messages[this.index])
			{
				this.show();
			}
			else
				this.index++;
		};
		
		messQueue.prototype.send=function(obj)
		{
			send_url = $(obj).parent("form").attr("action");
			params = new Object();
			$(obj).parent("form").children("input").each(function(){
				params[$(this).attr("name")] = $(this).attr("value");
			});
			this.read (obj, send_url, params);
		};
		
		messQueue.prototype.read=function(obj, url, params)
		{
			id = $(obj).attr("name");
			url = url?url:false;
			params = params?params:{};
			_this = this;
			jQuery.ajax({
				type: "POST",
				url: this.readUrl+"?Id="+id,
				success: function(data){
					_this.next();
					if (url && _this.options.sendFunction)
						_this.callback(_this.options.sendFunction, _this, [url, params]);
				}
			});
		};
		
		messQueue.prototype.destructor=function()
		{
			delete this.options;
			delete this.messages;
		};

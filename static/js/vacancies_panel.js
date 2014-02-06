/*
Панель управления вакансиями. Для работы с группой вакансий
для нормального ф-рования нужны jQuery
*/
		vacanciesPanel=function(options)
		{
			options = options?options:{};
			this.actions = new Object ();
			this.curActions = new Object ();
			this.btnObj = new Object();
			this.listObj = new Object();

			this.options = $.extend({
			btnContainer : 'vacancies_panel',
			listContainer : 'vacancies_list',
			tableSelector : 'table.vacancies',
			vacancyActionsId : 'actions',
			vacancyActionsSeparator : '__',
			btnClass : 'button',
			selectAllClass : 'selectAll',
			unselectAllClass : 'unselectAll',
			checkBoxClass : 'checkBox',
			activeClass : 'active',
			inactiveClass : 'inactive',
			rowSelectedClass : 'selected',
			sendFunction : false,
			vacancyRowClass : 'vacancy',
			vacancyActionsClass : 'vacancy_actions',
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
		
		vacanciesPanel.prototype.init=function()
		{
			this.btnObj = $("#"+this.options.btnContainer);
			this.listObj = $("#"+this.options.listContainer);
			this.reset();
			$(this.listObj).delegate("."+this.options.vacancyRowClass, 'mouseover', 
					function(){$(this).addClass(selected_class); $(this).find("."+actions_class).show();});
			$(this.listObj).delegate("."+this.options.vacancyRowClass, 'mouseout', 
					function(){$(this).removeClass(selected_class); $(this).find("."+actions_class).hide();});
			__vp = this;
			selected_class = this.options.rowSelectedClass;
			actions_class = this.options.vacancyActionsClass;
			$(this.listObj).delegate("."+this.options.selectAllClass, 'click', function(){__vp.selectAll(this);});
			$(this.listObj).delegate("."+this.options.unselectAllClass, 'click', function(){__vp.unselectAll(this);});
		}
		
		vacanciesPanel.prototype.reset=function()
		{
			this.curActions['publish'] = false;
			this.curActions['update'] = false;
			this.curActions['exclusive'] = false;
			this.curActions['unexclusive'] = false;
			this.curActions['hide'] = false;
			this.curActions['delete'] = false;
			$(this.btnObj).find("."+this.options.btnClass).addClass(this.options.inactiveClass).removeClass(this.options.activeClass);
			this.actions = [];
			$(this.listObj).find("input."+this.options.checkBoxClass).removeAttr("checked");
			$(this.listObj).find("."+this.options.vacancyActionsClass).hide();
			$(this.listObj).find("input."+this.options.checkBoxClass).click (function(){
				id = this.value;
				if (this.checked)
				{
					__vp.addVacancy (id);
				}
				else
				{
					__vp.removeVacancy (id);
				}
			});
		};
		
		vacanciesPanel.prototype.selectAll = function(obj)
		{
			
			$(obj).parents(this.options.tableSelector).find("input."+this.options.checkBoxClass).each(function(){
				if ($(this).attr("checked"))
				{}
				else
				{
					$(this).attr("checked","checked").triggerHandler("click");
				}
			})
		};
		
		vacanciesPanel.prototype.unselectAll = function(obj)
		{
			$(obj).parents(this.options.tableSelector).find("input."+this.options.checkBoxClass).each(function(){
				if ($(this).attr("checked"))
				{
					$(this).removeAttr("checked").triggerHandler("click");
				}
			})
		};
		
		vacanciesPanel.prototype.addVacancy = function(id)
		{
			actionsStr = $("#"+this.options.vacancyActionsId+id).attr("value");
			actions = actionsStr.split(this.options.vacancyActionsSeparator);
			l = actions.length;
			if (l)
			{
				for (i=0; i<l; i++ )
				{
					if (!this.actions[actions[i]])
						this.actions[actions[i]] = new Array();
					
					var n = this.actions[actions[i]].length;
					this.actions[actions[i]][n] = id;
				}
				this.refreshButtons();
			}
		}
				
		vacanciesPanel.prototype.removeVacancy = function(id)
		{
			if (this.actions)
			{
				for (i in this.actions )
				{
					l2 = this.actions[i].length;
					if (l2)
					{
						for (x=0; x<l2; x++ )
						{
							if (this.actions[i][x]==id)
							{
								this.actions[i].splice(x,1);
							}
						}
					}
				}
				this.refreshButtons();
			}
		}
		
		vacanciesPanel.prototype.refreshButtons = function()
		{
			for (i in this.curActions)
			{
				changed = false;
				if (this.actions[i])
				{
					if (this.actions[i].length)
					{
						if (!this.curActions[i])
						{
							this.curActions[i] = true;
							changed = true;
						}
					}
					else
					{
						if (this.curActions[i])
						{
							this.curActions[i] = false;
							changed = true;
						}
					}
				}
				if (changed)
				{
					if (this.curActions[i])
						$(this.btnObj).find("[name='"+i+"']").addClass(this.options.activeClass).removeClass(this.options.inactiveClass);
					else
						$(this.btnObj).find("[name='"+i+"']").removeClass(this.options.activeClass).addClass(this.options.inactiveClass);
				}
			}
		}
		
		vacanciesPanel.prototype.makeAction = function(obj)
		{
			action = $(obj).attr("name");
			if (!this.actions[action])
				return false;
			if (!this.actions[action].length)
				return false;
			if (!this.options.sendFunction)
				return false;
			if (!this.options.sendUrl)
				return false;
			l = this.actions[action].length;
			str = new Array();
			for (i=0; i<l; i++)
			{
				str[i] = 'Id[]='+this.actions[action][i];
			}
			url = this.options.sendUrl+action+"/?"+str.join('&');
			data = {};
			this.options.sendFunction.apply(obj,[url, data, vacancyRefreshPanel]);
//				this.reset();
		}

function vacancyAddToPanel(obj)
{
	obj = obj?obj:this;
	id = obj.value;
	if (obj.checked)
	{
		VPanel.addVacancy (id);
	}
	else
	{
		VPanel.removeVacancy (id);
	}
}

function vacancyAction(obj)
{
	obj = obj?obj:this;
	VPanel.makeAction (obj);
}

function vacancyRefreshPanel ()
{
	VPanel.reset();
}

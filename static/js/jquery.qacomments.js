	(function($){
		$.fn.qa_comments = function(opts){
            opts = $.extend({}, $.fn.qa_comments.defaults, opts);
			return this.each(function(){
				$.fn.qa_comments.instances[$(this).attr('id')] = new QaComments(this, opts, $(this).attr('id') );
				return $.fn.qa_comments.instances[$(this).attr('id')];
			});
		};

		$.fn.qa_comments.instances = new Object();

		// default options
		$.fn.qa_comments.defaults = {
			'commentSubmitButton' : '.questFormReplySubmitEnable',
			'resources' : $(document).data('portal.resources'),
			'replyLink' : 'a.qa_replyToAnswer',
			'itemClass' : 'item_offer',
			'activeItemClass' : 'item_offer_active',
			'itemAddressClass' : 'item_offer_address',
			'itemLinkClass' : 'item_offer_link',
			'commentForm' : '#jsCommentForm',
			'replyCommentFormClass' : 'questCommentsReplyForm rc2 rc-bl rc-br',
			'footerOpenedFormClass' : 'footerOpenedForm',
			'questCommentsItemFooterClass' : 'questCommentsItemFooter',
			'questCommentsItemNextNewLinkClass' : 'questCommentsItemNextNewLink',
			'commentFrameClass' : 'questCommentsFrame',
			'toggleTagsDescriptionClass' : 'js-toggleTagsDescription',
			'replyFormBottomClass' : 'questPostReplyFormPannel',
			'tagsHintClass' : 'hintCommentForm',
			'questCommentsItemNewClass' : 'questCommentsItemNew',
			'rateNegativeClass' : 'rateNegative',
			'ratePositiveClass' : 'ratePositive',
			'rateValueClass' : 'rateValue',
			'questCommentsItemClass' : 'questCommentsItem',
			'questCommentsItemSublevelWrapClass' : 'questCommentsItemSublevelWrap',
			'commentsContainerClass' : 'questCommentsWrap',
			'listTitle' : '.questListTitle',
			'itemHaveNegativeRatingClass' : 'rateValueLose'
		};

		var QaComments = function(obj, o, instance_id){
			
				if (!$(obj).find('.'+o.commentsContainerClass).length)
				{
					$container = $('<div/>');
					$container.addClass(o.commentsContainerClass);
					$(obj).append($container);
				}
				
				var commentsContainer = $(obj).find('.'+o.commentsContainerClass);

		        var bindCommentFormActions = function(el) {
					$(el).find("."+o.toggleTagsDescriptionClass).click(function() {
						$(this).closest("."+o.replyFormBottomClass).find("."+o.tagsHintClass).toggle();
						return false;
					});
					$(el).find(o.commentSubmitButton).click(function(){
						sendComment(this);
						return false;
					});					
		        }
				bindCommentFormActions($(o.commentForm));

				$(commentsContainer).delegate(o.replyLink, 'click', function(){
					openForm = $(this).text() == 'закрыть' ? false : true;
					closeReplyForm();
					if (openForm) {
						var form = $(o.commentForm).clone().attr({ 'id': 'jsCommentForm_clone', 'class': o.replyCommentFormClass});
						var href = $(this).attr('href');
						var parentId = href.substr(href.search('#')+1, href.length);
						form.children('form').attr('action', $(this).attr('href'));
						form.find('input:hidden').val(parentId);
						bindCommentFormActions(form);
						
						form.show().find('textarea').commentForm({refreshActionsOnly: true});
						commentFrame = $(this).closest("."+o.commentFrameClass);
						$(commentFrame).find('.'+o.questCommentsItemFooterClass).addClass(o.footerOpenedFormClass);
						$(commentFrame).after(form);
						$(this).text('закрыть');
					}
					return false;
				});

				$(commentsContainer).find('.'+o.questCommentsItemNewClass).each(function(i,e) {
		            var unreadNum = i;
		            $(this).find("."+o.questCommentsItemNextNewLinkClass).click(function () {
				                var nextNum = unreadNum + 1;
				                if (nextNum > $("."+o.questCommentsItemNewClass).length-1) {
				                    nextNum = 0;
				                }
				                var gotoId = $("."+o.questCommentsItemNewClass+":eq("+nextNum+")").attr("id");
				                $(this).remove();
				                $(e).removeClass(o.questCommentsItemNewClass);
				                document.location.href = '#' + gotoId;
				                return false;
		            });
		        });

				$(commentsContainer).delegate('.'+o.rateNegativeClass+', .'+o.ratePositiveClass, 'click', function() {
		            var e = $(this);
		            $.getJSON(e.attr('href'), function(data){
		                	if(data.success) {
		                		valueBox = e.parent('.'+o.rateValueClass);
		                    	var rateBox = e.parent('.'+o.rateValueClass).children('b');
		                    	var result = parseInt(rateBox.text()) + data.delta;
		                    	if(result > 0) result = '+' + result;
		                    	if (result < 0)
		                    	{
		                    		if (!valueBox.hasClass(o.itemHaveNegativeRatingClass))
		                    			valueBox.addClass(o.itemHaveNegativeRatingClass);
		                    	}
		                    	rateBox.text(result);
		                    	e.parent('.'+o.rateValueClass).children('a').remove();
		                	}
		                });
		            return false;
		            });

		        var sendComment = function (el) {
		        	formObj = $(el).closest("form");
		        	formData = formObj.serialize();
		        	formUrl = formObj.attr("action");
					$.ajax({
						url: formUrl,
						data: formData,
						type: 'post',
						dataType: 'json',
						success: function(result) {
							if (result.success)
							{
								if (result.parentId)
								{
									parentComment = $(formObj).closest('.'+o.questCommentsItemClass);
									if (!parentComment.find('.'+o.questCommentsItemSublevelWrapClass).length)
									{
										$wrapContainer = $('<div/>');
										$wrapContainer.addClass(o.questCommentsItemSublevelWrapClass);
										parentComment.append($wrapContainer);
									}
									$wrapContainer = parentComment.find('.'+o.questCommentsItemSublevelWrapClass).eq(0);
									$wrapContainer.append(result.text);
									closeReplyForm();
								}
								else
								{
									commentsContainer.append(result.text);
									$(o.commentForm).hide();
									$(obj).find(o.listTitle).show();
								}
								window.location.hash = result.id;
							}
							else
								if (result.error)
									$.popup.show({ title: 'Ошибка отправки ответа', content: result.error });
								else
									$.popup.show({ title: 'Ошибка отправки ответа', content: 'Ошибка передачи данных. Перезагрузите страницу и попробуйте еще раз.' });
							}
						});
						return false;
		        };
		        
		        var closeReplyForm = function (el) {
	        		$(commentsContainer).find("."+o.footerOpenedFormClass).each(function(){
	        			$(this).find(o.replyLink).text('ответить');
	        		});
					$(commentsContainer).find("."+o.footerOpenedFormClass).removeClass(o.footerOpenedFormClass);
					$('#jsCommentForm_clone').remove();
					$('#jsCommentSmiles_clone').remove();
		        };
		        
		};
	})(jQuery);

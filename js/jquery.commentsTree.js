// возвращает правильное окончания слова в зависимости от количества (аналог фильтра твига)
function filterPlural (n, c1, c2, c3) {
    c3 = c3 || c2;
    return n % 10 == 1 && n % 100 !=11 ? c1 : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? c2 : c3);
}

function isInGlobalBan () {
    return($(document).data('portal.user.isInGlobalBan'));
}

function isGuest () {
    // воспринимаем забаненного как гостя
    if(isInGlobalBan())
        return true;

    return(!$(document).data('portal.user.id') );
}

(function($){
	var self;

    $.fn.commentsTree = function (options) {
        var self = this;
        this.each(function () {
            commentsTree.init(self, options);
        });
    };
    
    var commentsTree = {
        wrap: false,
        form: false,
	    sending: false,
        replyObjectId: false,           // ID объекта, для которого открыта форма отправки коммента
        prevReplyLink: false,           // Здесь запоминается ссылка на кнопку "ответить", чтобы при нажатии на другой, вернуться текст обратно
	    displayedFillProfilePopup: false, // Отображал уже окно с просьбой заполнить профиль
	    displayedFillUserEmailPopup: false, // Отображал уже окно с просьбой заполнить email
        options: {
            phrase: 'Комментировать',
            phraseAdd: 'Добавить комментарий',
            phraseCloseTree: 'Свернуть комментарии',
            phraseOpenTree: 'Показать все комментарии',
            phraseHideComment: 'скрыть коментарий',
            phraseShowComment: '<i/>показать комментарий',
            numOfNotCollapseComments: 2,
            numOfComments: null,
            minCommentsForBottomCommentButton: 3,    // Количество комментов, начиная с которых будет показываться нижняя кнопка "комментировать"
            showFullTree: 0
        },
        
        // Инциализация
        init: function (element, options) {

            self = this;
            
            this.wrap = $(element);
            this.options = $.extend(this.options, options);

            // Включаем кнопку "тэги оформления"
            $(this.wrap).find(".js-toggleTagsDescription").click(function() {
                $(this).closest('.js_comment_form-bottom').find(".hintCommentForm").toggle();
                return false;
            });

            // Навешиваем обработчики на нажатие на кнопках "Комментировать"
            this.wrap.find('div#jsCommentsOpinionLinkTop').children('span.js_comment-to-object')
                .text(this.options.phrase)
                .click(function () {
					if (self._isCommentsTreeClose() && self._checkAuthorization()) {
						self.wrap.find('div#comments-toggle-all').trigger('click');
					}
					self.openCommentForm( self.wrap.find('div#jsCommentsOpinionLinkBottom').parent(), self.options.objectId, self.options.objectType, false );
					if (self.form.offset().top < ($('body').scrollTop() || $('html').scrollTop()) ||
						self.form.offset().top > ($('body').scrollTop() || $('html').scrollTop())+$(window).height())
					self._scrollToElement(self.form);
                });
            this.wrap.find('div#jsCommentsOpinionLinkBottom').children('span.js_comment-to-object')
                .text(this.options.phrase)
                .click(function () {
					if (self._isCommentsTreeClose()) {
						self.wrap.find('div#comments-toggle-all').trigger('click');
					}
					self.toggleCommentForm( self.wrap.find('div#jsCommentsOpinionLinkBottom').parent(), self.options.objectId, self.options.objectType, false );
				});

            // Инициализируем все комменты
            this.wrap.delegate('a.show_bad_comment','click', this.toggleBadComment);
            this.wrap.delegate('a.js_comment-to-comment','click', (isGuest()? this._checkAuthorization : this.addCommentReply));

            this.wrap.delegate('form.js_comment_remove input.buttons_remove_small','click', function(event){
                $(this).popup({
                    title: "Удаление комментария",
                    content: $("#remove_comment_popup").html()
                }).click();
                self.initRemovePopup($(this), event);
                return false;
            });

            self._setTextForOpenTreeButton( self.wrap.find('div#comments-toggle-all') );
            if (this.options.showFullTree){
                self.toggleCommentsTree();
            }

            // Проверяем якоря вида '#cxxxx' и '#comments', если не найдены, то сворачиваем дерево
            $(document).ready( function() {
                self.wrap.find('div#comments-toggle-all').click(self.toggleCommentsTree);
                if (document.location.hash == '#comments' || document.location.hash.match("^#c")) {
					self.wrap.find('div#comments-toggle-all').trigger('click');     // Вызываем через так, чтобы внутри обработчика this был корректный
                    if (self.options.numOfComments > self.options.minCommentsForBottomCommentButton)
                        self.wrap.find('div#jsCommentsOpinionLinkBottom').show();
					self._scrollToElement($(document.location.hash));
                }
//              добавляем функционал следующий новый
                self.gotoNextNewComment(self.wrap.find('div#comments-tree'));
                self.gotoNextNewComment(self.wrap.find('div#comments-not-collapsed'));

            });

            // Инициализируем модуль "лучший комментарий"
            $(document).ready( function() {
                
                // Показать все комментарии
                $(".js-bestCommentShowAll").click( function(e) {
                    if (self._isCommentsTreeClose()) {
                        // Дерево свернуто
                        self.wrap.find('div#comments-toggle-all').trigger('click');     // Вызываем через так, чтобы внутри обработчика this был корректный
                    }
                    document.location.href = '#comments';
                    e.stopPropagation();
                    e.preventDefault();
                });
                
                // Добавить комментарий
                $(".js-bestCommentClickComment").click( function(e) {
                    if (isGuest())
                    {
                        self._checkAuthorization();
                    }
                    else
                    {
                        if (!self.replyObjectId)
                            self.wrap.find('div#jsCommentsOpinionLinkTop').children('span.js_comment-to-object').trigger('click');
                        self._scrollToElement( self.form );
                        $("#Comment_content").focus();
                    }
                    e.stopPropagation();
                    e.preventDefault();
                });
            });

            // Инициализируем форму оправки ответа
            this.form = this.wrap.find('form.js_comment_form');
            this.form.bind('keydown', function (e) {
                if (e.keyCode == 13 && e.ctrlKey)
                    return self.commentFormSubmit(e);
            }).bind('submit', this.commentFormSubmit);
            
            // Если указан якорь 'message', то открываем окно ввода комментария и смещаем страницу туды
            $(document).ready( function() {
                // Делаем все это после загрузки страницы, чтобы форма успела догрузиться
                if (location.hash == '#message') {
                    if (!isGuest()) {
                        self.wrap.find('div#jsCommentsOpinionLinkTop').children('span.js_comment-to-object').trigger( 'click' );
                        self._scrollToElement( self.form );
                        setTimeout( function() {
                            $("#Comment_content").focus();
                        }, 1000 );
                    }
                }
            });
        },
        
        // Скроллируем страницу к элементу
        _scrollToElement: function ( elem ) {
            var offs = parseInt(elem.offset().top);

            $("html, body").animate({scrollTop: offs}, 300); // html for ie, body for others
        },
        
        // Инициализация каждого отдельного комментария
        // Проверка авторизованности пользователя
        _checkAuthorization: function() {
            if (!isGuest())
                return true;

            gporShowLoginPopup();
            return false;
            /*
            $.popup.show($(document).data('portal.user.popup').login());
            var register = $(".js_user_popup_tabs_tab_link-register");
            //var host =  $(document).data('portal.siteDomain');

            register.after($("<a href='http://"+$(document).data('portal.siteDomain') +"/registration/' target='_blank' class='js_user_popup_tabs_tab_link js_user_popup_tabs_tab_link-register js_inline-block rc-bl rc-br'>Регистрация</a>"));
            $("#popup_login_login").attr("name", "LoginForm[login]");
            $("#popup_login_password").attr("name", "LoginForm[password]");
            $("form.login").attr("action", "http://"+$(document).data('portal.siteDomain') + "/login/");
            register.remove();
            return false;
            */
        },
        
        // Открытие / закрытие формы по кнопке "комментировать"
        openCommentForm: function( $placeholder, objectId, objectType, bFromReply ) {
            
            if( !self._checkAuthorization() )
                return;
            
            // Если до этого была нажата кнопка "ответить" в комменте, то вырубаем ее текст нафиг
            if( !bFromReply && self.prevReplyLink )
                self.prevReplyLink.text('ответить');
            
            if( !(self.replyObjectId && self.replyObjectId == objectId) ) {
				self.replyObjectId = objectId;
				$placeholder.append( self.form );
				self.form.children('input[name="objectId"]').val(objectId).end()
					.children('input[name="objectType"]').val(objectType).end()
					.show();
				$("#Comment_content").focus();
            }
        },
        
        // Открытие / закрытие формы по кнопке "комментировать"
        toggleCommentForm: function( $placeholder, objectId, objectType, bFromReply ) {

            if( !self._checkAuthorization() )
                return;

            // Если до этого была нажата кнопка "ответить" в комменте, то вырубаем ее текст нафиг
            if( !bFromReply && self.prevReplyLink )
                self.prevReplyLink.text('ответить');

            if( self.replyObjectId && self.replyObjectId == objectId ) {
                self.form.hide();
                self.replyObjectId = false;
            }
            else {
                self.replyObjectId = objectId;
                $placeholder.append( self.form );
                self.form.children('input[name="objectId"]').val(objectId).end()
                    .children('input[name="objectType"]').val(objectType).end()
                    .show();
				$("#Comment_content").focus();
            }
        },

        // Открываем / закрываем дерево комментариев
        toggleCommentsTree: function() {
//            var numOfNotCollapseComments = $('div#comments-tree').children("div.js_comment[showInCollapse=1]").length;
//            if (numOfNotCollapseComments < self.options.numOfNotCollapseComments && self.options.numOfComments < self.options.numOfNotCollapseComments)
//                return;

            self.wrap.find('div#comments-tree').toggleClass(function() {

                var comments_tree = $(this);
                var commentsNotCollapseWrap = self.wrap.find('div#comments-not-collapsed');

                if (comments_tree.hasClass('hidden')) {
                    commentsNotCollapseWrap.addClass('hidden');
                    if(self.options.numOfComments > self.options.minCommentsForBottomCommentButton) {
                        $('div#jsCommentsOpinionLinkBottom').show();
                    }
                }
                else {
                    $('div#jsCommentsOpinionLinkBottom').hide();
                    var _i = self.options.numOfNotCollapseComments - 1;
                    commentsNotCollapseWrap.html('');
                    comments_tree.children("div.js_comment[showInCollapse=1]:visible").each(function (i) {
                        if(i > _i)
                            return false;
                        var comment = $(this).clone().children('div.js_comment-sublevel_wrap').remove().end();
                        // id на странице должен быть уникальным
                        comment.attr("_id", comment.attr("id")).removeAttr("id");
                        // если функционал следующего нового скрыл ссылку покажем ее в свернутом дереве
                        if(comment.hasClass("unread-comment"))
                            comment.children('div.comment_head')
                                   .children('div.comment_head_content')
                                   .children("a.comment_head_next-new")
                                   .removeClass('hidden');
                        commentsNotCollapseWrap.append(comment);
                    });

                    self.gotoNextNewComment(self.wrap.find('div#comments-not-collapsed'));
                    commentsNotCollapseWrap.removeClass('hidden');
                }
                return 'hidden';
            });
            self._setTextForOpenTreeButton(self.wrap.find('div#comments-toggle-all'));
        },
        
        // Установить текст для кнопки "открыть дерево комментариев"
        _setTextForOpenTreeButton: function( elemCommentsTree ) {
            
            var numOfNotCollapseComments = $('div#comments-not-collapsed').children("div.js_comment[showInCollapse=1]").length;
            var numOfCollapseComments = self.options.numOfComments - numOfNotCollapseComments;

            var toggleBarChildrens = elemCommentsTree.children('span');

            // Показываем или скрываем кнопку "Показать все комментарии"
            // NOTE: Делаем это здесь, а не при генерации шаблона, т.к. только здесь известно реальное количество отображенных
            //		 комментариев, например в ситуации когда их два и один дочерний другого
			var commentsToggleAllButton = self.wrap.find('div#comments-toggle-all');
			if( numOfCollapseComments > 0 )
				commentsToggleAllButton.removeClass('hidden');
			else
				commentsToggleAllButton.addClass('hidden');
            
            if (elemCommentsTree.hasClass('hidden') || self.wrap.find('div#comments-tree').hasClass('hidden'))
            {
                toggleBarChildrens.first()
                    .text(self.options.phraseOpenTree)
                    .next().text('(еще '+ numOfCollapseComments +')');
            }
            else {
                toggleBarChildrens.first()
                    .text(self.options.phraseCloseTree)
                    .next().text('');
            }

            if(numOfNotCollapseComments > 0 && self.wrap.find('div#comments-tree').hasClass('hidden') && !self.wrap.find('div#comments-tree').hasClass('hidden'))
                elemCommentsTree.removeClass('hidden');

        },
        
        // Нажатие на кнопке "ответить"
        addCommentReply: function(e) {

            e.preventDefault();

            var $link = $(this);
            var objectId = $link.attr('href').replace(/.*\breply-to=([1-9]\d*).*/, function (raw, id) {
                return '' + id;
            });

            if($link.text() == 'закрыть') {
                $link.text('ответить');
                
                // Скрываем форму ввода коммента
                var $placeholder = $link.parent();
                self.prevReplyLink = false;
                self.toggleCommentForm($placeholder, objectId, self.options.commentType, true);
            }
            else {
                if( self.prevReplyLink )
                    self.prevReplyLink.text('ответить');
                self.prevReplyLink = $link;

                $link.text('закрыть');
                var $placeholder = $link.parent();
                self.toggleCommentForm($placeholder, objectId, self.options.commentType, true);
            }

            return false;
        },

        // Нажатие на кнопке "показать комментарий" для заминусованного
        toggleBadComment: function () {

            var thisElem = $(this);

            thisElem.closest('div.js_comment').children('div.comment_content').toggleClass(function () {
                if($(this).hasClass('comment_content_unvisible')) {
                    thisElem.html(self.options.phraseHideComment);
                }
                else {
                    thisElem.html(self.options.phraseShowComment);
                }
                return 'comment_content_unvisible';
            });
            return false;
        },
        
        // Инициализировать окно удаления комментария
        initRemovePopup: function (elem, e) {
                e.preventDefault();

                $(".js_popup_frame").css("width", "420px");

                $("input#button-cancel").click( function () {
                    $(".js_popup").hide();
                    return false;
                });
                $("input#button-submit").click( function () {
                    var $formRemove = elem.closest('form');
                    $.ajax({
                        url: $formRemove.attr('action'),
                        type: 'post',
                        data: $formRemove.serialize(),
                        dataType: 'json',
                        success: function(result)
                        {
                            if( !result ) {
                                $.popup.show({
                                    title: 'Ошибка', 
                                    content: 'Ошибка при удалении комментария'
                                });
                                return;
                            }

							var commentId;
							var $jsComment = elem.closest('.js_comment');
							// Удаляем текст комментария
							$jsComment.children('.comment_content').empty();
							// Удаляем все элементы управления
							$jsComment.find('.comment_head_content:first').html("<span class='comment_removed'><i>"+result.remover+"</i></span>");

							if (commentId = $jsComment.attr('_id')) { // если у нас вдруг задан _id, это означает, что мы находимся в свернутой ветке.
								$jsComment = $('#'+commentId); // работать следует с реальным развернутым деревом

								// Удаляем текст комментария
								$jsComment.children('.comment_content').empty();
								// Удаляем все элементы управления
								$jsComment.find('.comment_head_content:first').html("<span class='comment_removed'><i>"+result.remover+"</i></span>");
							}

                            self._changeCommentsCount(-1);
                        },
                        error: function(result)
                        {
                            if( !result ) {
                                $.popup.show({
                                    title: 'Ошибка', 
                                    content: 'Ошибка при удалении комментария'
                                });
                            }
                        }
                    });
                    $(".js_popup").hide();
                    return false;
                });

                return false;
        },
        
        // Перейти к следующему комментарию
        gotoNextNewComment: function(comments) {
//          объект в котором хранятся ссылки на непрочитанные комментарии
            var unreadComments = comments.find('.unread-comment');
//          количество непрочитанных комментариев уменьшенное на единицу
            var countUnreadComments = unreadComments.length - 1;
//          копия предыдущей переменной, потребуется в скролинге по коментариям
            var _countUnreadComments = countUnreadComments;
            switch(comments.attr('id')) {
                case "comments-not-collapsed":
                    // Количество комментариев не превышает количество в нескрытом дереве, убираем у второго ссылку
                    if(self.options.numOfComments == self.options.numOfNotCollapseComments) {
                        unreadComments.eq(1).children('div.comment_head').children('div.comment_head_content').children("a.comment_head_next-new").addClass('hidden');
                    }
                    unreadComments.each(function(i,e) {
                        $(e).children('div.comment_head').children('div.comment_head_content').children("a.comment_head_next-new").click(function () {
                            // Количество комментариев больше чем количество в нескрытом дереве, открываем дерево на месте текущего, убираем клас в шапке, но показываем ссылку на следующие новые
                            if(self.options.numOfComments > self.options.numOfNotCollapseComments) {
                                var _thisCommentId = $(e).attr('_id');
                                self.wrap.find('div#comments-tree').find('div#' + _thisCommentId).removeClass('unread-comment')
                                .children('div.comment_head').children('div.comment_head_content').children("a.comment_head_next-new").removeClass('hidden');
                                self.wrap.find('div#comments-toggle-all').trigger('click');
                                self._scrollToElement($('div#' + _thisCommentId));
                            }
                            // иначе при клике скролим на следующий и убираем везде признаки новых
                            else {
                                $(this).addClass('hidden').unbind('click');
                                $(e).removeClass('unread-comment');
                                self._scrollToElement(unreadComments.eq(1));
                                unreadComments.eq(1).removeClass('unread-comment');
                            }
                            return false;
                        });
                    });
                    break;
                case "comments-tree":
                    unreadComments.each(function(i,e) {
//                      Если количество непрочитанных комментариев равно одному (см. определение переменной) скрываем ссылку
                        if(countUnreadComments == 0) {
                            $(e).removeClass('unread-comment').children('div.comment_head').children('div.comment_head_content').children("a.comment_head_next-new").addClass('hidden');
                            return false;
                        }
//                      У последнего непрочитанного комментария скрываем ссылку на следующий новый
                        else {
                            if(i == countUnreadComments) {
                                $(e).children('div.comment_head').children('div.comment_head_content').children("a.comment_head_next-new").addClass('hidden');
                        }
                        $(e).children('div.comment_head').children('div.comment_head_content').children("a.comment_head_next-new").click(function () {
//                          отметим что прочитали еще один комментарий
                            _countUnreadComments--;
                            var nextNew = i+1;
//                          объект следующего нового комментария
                            var comment;
//                          Если непрочитанные комментарии еще есть, ищим сначала следующий, иначе предыдущие
                            if(_countUnreadComments >= 0) {
                                $.each(unreadComments.slice(nextNew), function(i,e) {
                                    if($(e).hasClass('js_comment')) {
                                        comment = $(e);
                                        return false;
                                    }
                                });
                                if(typeof comment == "undefined") {
                                    $.each(unreadComments.slice(0, i), function(i,e) {
                                        if($(e).hasClass('js_comment')) {
                                            comment = $(e);
                                            return false;
                                        }
                                    });
                                }
//                              Если комментарий найден и корректен, то скролим к нему
                                if(comment && comment.attr("id").length > 0)
                                    self._scrollToElement(comment);
//                              Если непрочитанные комментарии еще остались показываем ссылку на следующие, иначе убираем ее
                                if(_countUnreadComments > 0) {
                                    comment.children('div.comment_head')
                                           .children('div.comment_head_content')
                                           .children("a.comment_head_next-new")
                                           .removeClass('hidden');
                                }
                                else {
                                    comment.removeClass("unread-comment")
                                           .children('div.comment_head')
                                           .children('div.comment_head_content')
                                           .children("a.comment_head_next-new")
                                           .addClass('hidden').unbind('click');
                                }
                            }
                            $(e).removeClass('unread-comment');
                            $(this).addClass('hidden').unbind('click');
//                          чистим объект в котором хранятся ссылки на непрочитанные комментарии
                            delete unreadComments[i];
                            return false;
                        });
                    }
                });
                break;

            }
        },
        
        // Отправка комментария
        commentFormSubmit: function (e)
        {
	        if (!self.displayedFillProfilePopup) {
		        var wasShown = showForceFillProfilePopup(self.form);
		        self.displayedFillProfilePopup = true;
		        if (wasShown)
		            return false;
	        }

	        if (!self.displayedFillUserEmailPopupPopup) {
		        var wasShownUserEmailPopup = showForceFillUserEmailPopup(self.form);
		        self.displayedFillUserEmailPopupPopup = true;
		        if (wasShownUserEmailPopup)
		            return false;
	        }

	        if(self.sending) return false;
            e.preventDefault();

            var form = $(e.currentTarget);
            var fields = {
                'objectId': form.children('input[name="objectId"]').val(),
                'objectType': form.children('input[name="objectType"]').val()
            };
	        self.sending = true;
	        form.css('opacity','.5');
            $.ajax({
                type: 'post',
                url: form.attr('action'),
                data: form.serialize(),
                dataType: 'json',
                success: function(result) {
	                form.css('opacity',1);
	                self.sending = false;
                    if (!result) {
                        $.popup.show({
                            title: 'Ошибка', 
                            content: 'Ошибка при отправке комментария'
                        });
                        return;
                    }
                    if (result.error) {
                        $.popup.show({
                            title: 'Ошибка', 
                            content: result.error
                            });
                        return;
                    }
                    var $newComment = $(result.html).hide();
                    var $objectTo = (parseInt(fields.objectType) != 5)? $("#comments-tree") : $("#c"+ fields.objectId +"s");

                    // Чистим форму
                    form.find('textarea').val('');

                    // Скрываем форму
                    self.toggleCommentForm( form.parent(), fields.objectId, fields.objectType, false );

                    $newComment.appendTo($objectTo);
                    self._changeCommentsCount(1);
					$newComment.slideDown(300);
					if ($newComment.offset().top < ($('body').scrollTop() || $('html').scrollTop()) ||
						$newComment.offset().top > ($('body').scrollTop() || $('html').scrollTop())+$(window).height())
							self._scrollToElement($newComment);
                },
                error: function () {
	                form.css('opacity',1);
	                self.sending = false;
                    $.popup.show({
                        title: 'Ошибка', 
                        content: 'Во время отправки комментария произошла ошибка'
                    });
                }
            });

            return false;
        },
        
        // Изменить счетчик комментариев
        _changeCommentsCount: function (change) {
            if (!change)
                return;
            
            self.options.numOfComments += change;
            $('span#topCountComments').text(self.options.numOfComments + ' комментар' + filterPlural(self.options.numOfComments, 'ий', 'ия', 'иев')).removeClass('hidden');
            
            if ((self.options.numOfComments - self.options.numOfNotCollapseComments) >= 1) {
                if (self._isCommentsTreeClose()) {
                    self.wrap.find('div#comments-toggle-all').trigger('click');
                }
                if (self.wrap.find('div#comments-toggle-all').hasClass('hidden')) {
                    self.wrap.find('div#comments-toggle-all').removeClass('hidden');
                }
                self._setTextForOpenTreeButton(self.wrap.find('div#comments-toggle-all'));
            }
        },
        
        // Проверить, закрыто ли дерево комментариев
        _isCommentsTreeClose: function() {
            return self.wrap.find('div#comments-tree').hasClass('hidden');
        }
    };
})(jQuery);
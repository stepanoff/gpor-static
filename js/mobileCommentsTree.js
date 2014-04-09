(function($){
    function isGuest() {
        return !$(document).data('portal.user.loggedIn');
    }

    var prevForm = false;
    var prevReplyBtn = false;

    $(document).ready( function()
    {
        $('.m-comment, .m-authorize').hide();

        $('#js-show-comments').on('click', function(ev) {
            var $this = $(this);
            ev.preventDefault();
            $this.addClass('m-button_activated');
            $('.m-comment, .m-authorize').show();
        });

        function clickCommentBtn(thisEl, formEl, bHide)
        {
            if (prevForm !== false)
                prevForm.hide();
            prevForm = false;

            if (prevReplyBtn !== false) {
                prevReplyBtn.removeClass('m-button_activated');
                prevReplyBtn.show();
            }
            prevReplyBtn = false;

            if (formEl.length) {
                formEl.show();
                if (bHide)
                    thisEl.hide();
                else
                    thisEl.addClass('m-button_activated');
                prevForm = formEl;
                prevReplyBtn = thisEl;
            }
        }

        // Нажатие кнопки "ответить"
        $('.m-comment__reply').click( function(ev) {
            var thisEl = $(ev.target);
            var formEl = thisEl.closest('.m-comment').parent().find('#js-comment-form');
            clickCommentBtn(thisEl, formEl, true);
            return false;
        });

        // Нажатие кнопки "оставить комментарий"
        $('#js-comment-form-btn').click( function(ev) {
            var thisEl = $(ev.target);
            var formEl = thisEl.closest('#js-comment-form-root').find('#js-comment-form');
            clickCommentBtn(thisEl, formEl, false);
            return false;
        });

        // Нажатие на кнопке "отправить"
        var isSendClick = false;
        $('.m-new-comment__button').click( function(ev) {
            if (isSendClick)
                return false;
            isSendClick = true;
            var thisEl = $(ev.target);
            thisEl.addClass('m-button_activated');
            return true;
        });

        // Открываем главную форму ввода комментария
        $('#js-comment-form-root').find('#js-comment-form-btn').trigger('click');

        // Если пришла страница с якорем и он есть на странице, то скроллим туда
        var idx = location.href.indexOf("#");
        if (idx != -1) {
            var hrefAnchor = location.href.substring(idx+1);

            // Ищем в якоре индикатор открытия формы
            var isOpenForm = false;
            var idxReply = hrefAnchor.indexOf('_reply');

            if (idxReply != -1) {
                isOpenForm = true;
                hrefAnchor = hrefAnchor.substring(0, idxReply);
            }

            var insEl = $('#'+hrefAnchor);
            if (insEl.length) {
                $('#js-show-comments').trigger('click');

                // Открываем форму ввода комментария
                if (isOpenForm) {
                    var formEl = insEl.find('.m-comment__reply');
                    if (formEl.length)
                        formEl.trigger('click');
                }
            }
        }

        var commentsCount = $(document).data('portal.commentsCount');
        if (commentsCount < 1) {
            // Скрываем кнопку "комментарии" и открываем форму комментирования 
            $('#js-show-comments').trigger('click');
            $('#js-show-comments').hide();
        }
    });
})(jQuery);
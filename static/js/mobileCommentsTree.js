(function($){
	$('document').ready(function() {
		$('#comments div.comments-list').delegate('a.comment-item__quote','click', function () {
			$(this).hide().siblings('span.comment-item__quote').show();
			return false;
		});

		var isGuest = function() {
			// воспринимаем забаненного как гостя
			if($(document).data('portal.user.isInGlobalBan'))
				return true;

			return(!$(document).data('portal.user.uid'));
		};

		var $commentForm = $('#message').clone().attr('id','');
		var commentTypeCode = $(document).data('portal.commentTypeCode');
		$commentForm.find('input[name=objectType]').val(commentTypeCode);
		if (isGuest()) {
			var setLocationBeforeSend = function() {
				$(this).find('input[name=location]').val(location.href);
			};
			$('#message').find('form').bind('submit', setLocationBeforeSend);
			$commentForm.find('form').bind('submit', setLocationBeforeSend);
		} else {
			var postCommentFunction = function() {
				var $form = $(this);
				$form.css('opacity','.5').find('input[type=submit]').attr('disabled','disabled');
				var answerOnComment = $form.find('input[name=objectType]').val() == commentTypeCode;
				$.ajax({
					type: 'post',
					url: $form.attr('action'),
					data: $form.serialize(),
					dataType: 'json',
					success: function(result) {
						$form.css('opacity',1).find('input[type=submit]').attr('disabled','');
						if (!result) {
							alert("Ошибка при отправке комментария");
							return;
						}
						if (result.error) {
							$form
								.find('div.comment-form__row').addClass('error')
								.find('div.orange-hint__ico').text(result.error).parent().show();
							return;
						}
						var $comment = $(result.html);
						if (answerOnComment) {
							$commentForm.hide();
							$commentForm.after($comment);
						} else {
							$('#comments div.comments-list').append($comment);
						}
						location.hash = '#'+$comment.attr('id');
						$form
							.find('div.comment-form__row').removeClass('error')
							.find('div.orange-hint').hide();
						$form.find('textarea').val('');
					},
					error: function () {
						$form.css('opacity',1).find('input[type=submit]').attr('disabled','');
						alert("Во время отправки комментария произошла ошибка");
					}
				});
				return false;
			};
			$('#message').find('form').bind('submit', postCommentFunction);
			$commentForm.find('form').bind('submit', postCommentFunction);
		}

		// Кнопка Ответ
		$('#comments div.comments-list').delegate('a.comment-btn-answ', 'click', function() {
			$commentForm
				.detach().show()
				.find('div.comment-form__row').removeClass('error')
				.find('div.orange-hint').hide();
			$commentForm.find('textarea').val('');
			$(this).parents('div.comment-item').after($commentForm);
			$commentForm.find('input[name=objectId]').val( $(this).attr('href').replace(/[^#]+#c/,'') );
			$commentForm.find('input:first, textarea:first').focus();

			return false;
		});

		// Кнопка Комментировать
		$('#comment-button').bind('click', function (){
			$( $(this).attr('href') ).find('input:first, textarea:first').focus();

			return false;
		});

	});
})(jQuery);
(function ($) {

$(document).bind('documentbodyloadend', function () {

	var host = document.location.host.replace(/^(.*\.)?([^\.]+\.[^\.]+)$/, '$2'),
		urlRegExp = new RegExp('^(?:.+\.' + host + '|https?:\/\/' + host + '|)\/(register|login|repair)'),
		currentTab = 'login';

	var popup = {
			buttons: [],
			popupshow: function (options, $popup, $title, $content) {

				$content.find('[rel=' + currentTab[1] + ']').click();
			},
			title: 'Вход на сайт'
		};

	popup.content = initTabs([
		{
			caption:
			'<u class="js_user_popup_tabs_tab_link js_user_popup_tabs_tab_link-login js_inline-block rc-bl rc-br" rel="login">Авторизация</u>',

			content:
			'<form method="POST" action="' + $(document).data('portal.user.loginUrl') + '" ' +
			'      class="login" style="display: none;"> ' +
			' <p class="js_context"> ' +
			'  <label class="js_user_popup_left-label" for="popup_login_login"> ' +
			'   Ваш логин:</label> ' +
			'  <i class="js_user_popup_right-field_wrap"> ' +
			'   <input class="js_forms_text js_user_popup_right-field" ' +
			'          id="popup_login_login" name="LoginForm[login]" ' +
			'          type="text" /> ' +
			'  </i> ' +
			' </p> ' +
			' <p class="js_context js_half-line-top"> ' +
			'  <label class="js_user_popup_left-label" for="popup_login_password"> ' +
			'   Ваш пароль:</label> ' +
			'  <i class="js_user_popup_right-field_wrap"> ' +
			'   <input class="js_forms_password js_user_popup_right-field" ' +
			'          id="popup_login_password" name="LoginForm[password]" ' +
			'          type="password" /> ' +
			'  </i> ' +
			' </p> ' +
			' <p class="js_context js_half-line-top"> ' +
			'  <label class="js_user_popup_left-label" for="popup_login_password"> ' +
			'   Запомнить меня:</label> ' +
			'  <i class="js_user_popup_right-field_wrap"> ' +
			'   <input class="js_forms_password js_user_popup_right-field" ' +
			'          id="popup_login_password" name="LoginForm[rememberMe]" ' +
			'          type="checkbox" /> ' +
			'  </i> ' +
			' </p> ' +
			' <div style="display: none;"> ' +
			'  <div id="popup_login_errors-summary" ' +
			'       class="js_message js_message_fail js_half-line-top ie_layout rc4"></div> ' +
			' </div> ' +
			' <div style="display: none;"> ' +
			'  <div id="popup_login_success" ' +
			'       class="js_message js_message_success js_half-line-top ie_layout rc4"> ' +
			'   Добро пожаловать. Осуществляется вход</div> ' +
			' </div> ' +
			'</form>',

			buttons: [{
				caption: 'Войти',
				highlited: true,
				type: 'submit'
			}],

			success: function () { document.location.href = document.location.href; }
		},

		{
			caption:
			'<u class="js_user_popup_tabs_tab_link js_user_popup_tabs_tab_link-register js_inline-block rc-bl rc-br" rel="register">Регистрация</u>',

			content:
			'<form  method="POST" action="' + $(document).data('portal.user.registerUrl') + '" ' +
			'      class="register" style="display: none;"> ' +
			' <p class="js_context"> ' +
			'  <label class="js_user_popup_left-label" for="popup_register_login"> ' +
			'  Ваш логин:</label> ' +
			'  <i class="js_user_popup_right-field_wrap"> ' +
			' <input class="js_forms_text js_user_popup_right-field" ' +
			'        id="popup_register_login" name="RegisterNewUserForm[login]" ' +
			'          type="text" /> ' +
			'  </i> ' +
			' </p> ' +
			' <p class="js_context js_line-top"> ' +
			'  <label class="js_user_popup_left-label" for="popup_register_pass"> ' +
			'   Пароль:</label> ' +
			'  <i class="js_user_popup_right-field_wrap"> ' +
			'   <input class="js_forms_password js_user_popup_right-field" ' +
			'          id="popup_register_pass" name="RegisterNewUserForm[pass]" ' +
			'          type="password" /> ' +
			'  </i> ' +
			' </p> ' +
			' <p class="js_context js_line-top"> ' +
			'  <label class="js_user_popup_left-label" for="popup_register_passConfirmation"> ' +
			'   Повторите пароль:</label> ' +
			'  <i class="js_user_popup_right-field_wrap"> ' +
			'   <input class="js_forms_password js_user_popup_right-field" ' +
			'          id="popup_register_passConfirmation" name="RegisterNewUserForm[passConfirmation]" ' +
			'          type="password" /> ' +
			'  </i> ' +
			' </p> ' +
			' <div class="js_hr js_line-top"><hr /></div> ' +
			' <p class="js_context js_line-top"> ' +
			'  <label class="js_user_popup_left-label" for="popup_register_email"> ' +
			'   Ваш e-mail:</label> ' +
			'  <i class="js_user_popup_right-field_wrap"> ' +
			'   <input class="js_forms_text js_user_popup_right-field" ' +
			'          id="popup_register_email" name="RegisterNewUserForm[email]" ' +
			'          type="text" /> ' +
			'  </i> ' +
			' </p> ' +
			' <p class="js_context js_line-top"> ' +
			'  <label class="js_user_popup_captcha-label" for="popup_register_verifyCaptchaCode"> ' +
			'   Введите буквы с картинки:</label> ' +
			'  <input class="js_forms_text js_user_popup_captcha-field" ' +
			'         id="popup_register_verifyCaptchaCode" name="RegisterNewUserForm[verifyCaptchaCode]" ' +
			'         type="text" /> ' +
			'  <img src="' + $(document).data('portal.user.registerCaptchaUrl') + '?' + Math.random() + '" />' +
			' </p> ' +
			' <div class="js_hr js_line-top"><hr /></div> ' +
			' <p class="js_line-top"> ' +
			'  Выполняя регистрацию вы принимаете условия пользовательского соглашения ' +
			' </p> ' +
			' <div style="display: none;"> ' +
			'  <div id="popup_register_errors-summary" class="js_message js_message_fail js_half-line-top ie_layout rc4"></div> ' +
			' </div> ' +
			' <div style="display: none;"> ' +
			'  <div id="popup_register_success" class="js_message js_message_success js_half-line-top ie_layout rc4">Добро пожаловать. Осуществляется вход</div> ' +
			' </div> ' +
			'</form>',

			buttons: [
				{
					caption: 'Зарегистрироваться',
					highlited: true,
					type: 'submit'
				},
				{
					action: function (options, $popup) { $popup.popuphide(); },
					caption: 'Отмена'
				}
			],

			init: function () {

				var $form = $(this),
					$captcha = $form.find('#popup_register_verifyCaptchaCode').siblings('img');

				$captcha
					.data('originalSrc', $captcha.attr('src'))
					.click(refreshCaptcha);

				function refreshCaptcha() {

					$captcha.attr('src', $captcha.data('originalSrc') + Math.random());
				}
			},

			success: function () { document.location.href = document.location.href; },

			fail: function () { $(this).find('#popup_register_verifyCaptchaCode').siblings('img').click(); }
		},

		{
			caption:
			'<u class="js_user_popup_tabs_tab_link js_user_popup_tabs_tab_link-repair js_inline-block rc-bl rc-br" rel="repair">Напомнить пароль</u>',

			content:
			'<form action="' + $(document).data('portal.user.repairUrl') + '" ' +
			'      class="repair" style="display: none;"> ' +
			' <p class="js_context"> ' +
			'  <label class="js_user_popup_left-label" for="popup_repair_email">Укажите ваш e-mail:</label> ' +
			'  <i class="js_user_popup_right-field_wrap"> ' +
			'   <input class="js_forms_text js_user_popup_right-field" ' +
			'          id="email" name="email" ' +
			'          type="text" /> ' +
			'  </i> ' +
			' </p> ' +
			' <div style="display: none;"> ' +
			'  <div id="popup_repair_errors-summary" class="js_message js_message_fail js_half-line-top ie_layout rc4"></div> ' +
			' </div> ' +
			' <div style="display: none;"> ' +
			'  <div id="popup_repair_success" class="js_message js_message_success js_half-line-top ie_layout rc4">Пароль выслан на ваш адрес</div> ' +
			' </div> ' +
			'</form>',

			buttons: [
				{
					caption: 'Напомнить',
					highlited: true,
					type: 'submit'
				},
				{
					action: function (options, $popup) { $popup.popuphide(); },
					caption: 'Отмена'
				}
			]
		}
	]);

	if ($.browser.msie) {

		popup.animation = { show: false, hide: false };
	}
/*
	$('a')
		.filter(function () { return urlRegExp.test($(this).attr('href') || ''); })
		.click(function () { currentTab = urlRegExp.exec($(this).attr('href') || ''); })
		.popup(popup);
*/
	popup.login = function () {

		popup.content.find('[rel=login]').click();

		return popup;
	};

	popup.register = function () {

		popup.content.find('[rel=egister]').click();

		return popup;
	};

	popup.repair = function () {

		popup.content.find('[rel=repair]').click();

		return popup;
	};

	$(document).data('portal.user.popup', popup);
});

function initTabs(tabs) {

	var $captions = $('<ul class="js_user_popup_tabs" />'),
		$containers = $('<div />');

	$.each(tabs, function (i, tab) {

		var $tab = $(tab.caption),
			formName = $tab.attr('rel');

		$tab
			.click(function () {

				$captions
					.find('.js_user_popup_tabs_tab_link')
					.removeClass('js_user_popup_tabs_tab_link-active');

				$tab.addClass('js_user_popup_tabs_tab_link-active rc5');

				$containers
					.children()
					.hide()
					.filter('.' + formName)
					.show();

				rocon.update(this);

				if ($.browser.msie && $.browser.version < 7) {

					document.body.className = document.body.className;
				}
			})
			.appendTo($captions)
			.wrap('<li class="js_user_popup_tabs_tab" />');

		$(tab.content)
			.append($.popup.getButtons(tab.buttons))
			/*.submit(function (e) {

				e.stopPropagation();
				e.preventDefault();

				formAction.call(this, formName, tab.success, tab.fail);

				return false;
			})*/
			.each(function () { tab.init ? tab.init.call(this) : ''; })
			.appendTo($containers);

	});

	return $captions.add($containers);
}

function formAction(formName, success, fail) {

	var $form = $(this);

	$form.find('.js_message').parent().slideUp('fast');

	$.ajax({
		type: 'post',
		url: $form.attr('action'),
		data: $form.serialize(),
		dataType: 'json',
		success: function(result) {

			if (!result) {

				displayErrors($form, formName, 'Произошла ошибка');
				fail ? fail.call(this) : '';
			}

			else if (result.status && result.status == 'ok') {

				var $message = $form
					.find('#popup_' + formName + '_success')
					.parent()
					.slideDown('fast', function () { success ? success.call(this) : ''; })
					.end();

				rocon.update($message.get(0));
			}

			else {

				displayErrors($form, formName, result.error);
				fail ? fail.call(this) : '';
			}
		},
		error: function () {

			displayErrors($form, formName, 'Произошла ошибка');
			fail ? fail.call(this) : '';
		}
	});
}

function displayErrors($form, formName, errors) {

	if (!errors) {

		return;
	}

	var errorsSummary = [];

	if (typeof errors != 'string') {

		$.each(errors, function (field, text) {

			var $field = $form.find('#popup_' + formName + '_' + field + '');

			if (!$field.length) {

				errorsSummary[errorsSummary.length] = text;
				return;
			}

			if (!$field.data('portal.message')) {

				var $messageLine = $('<div class="js_half-line-top" />').hide(),
					$message = $('<div class="js_message js_message_fail ie_layout rc4" />').appendTo($messageLine);

				$field
					.data('portal.message', $message)
					.data('portal.messageLine', $messageLine);

				$field.parents('p:first')
					.after($messageLine);
			}

			else {

				var $message = $field.data('portal.message'),
					$messageLine = $field.data('portal.messageLine');
			}

			$message
				.html(text + '');

			$messageLine
				.slideDown('fast')
				.end();

			rocon.update($message.get(0));
		});
	}

	else {

		errorsSummary[errorsSummary.length] = errors;
	}

	if (errorsSummary.length) {

		var $errorsSummary = $form.find('#popup_' + formName + '_errors-summary');

		if (!$errorsSummary.length) {

			return;
		}

		$errorsSummary
			.html(errorsSummary.join('<br />'))
			.parent()
			.slideDown('fast')
			.end();

		rocon.update($errorsSummary.get(0));
	}
}
})(jQuery);


var gporShowLoginPopup = function () {
    var mainLink = $('.b-header-auth__tab .gpor_auth:first');
    if (!mainLink.eq(0) || typeof(GporAuth) == 'undefined' || !GporAuth )
    {
        alert ('Зарегистрируйтесь или войдите на сайт');
        return false;
    }
    $(mainLink).trigger('click');
    return false;
}

$(document).ready(function(){
    $('.head_menu_item-enter').bind('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        gporShowLoginPopup();
        return;
        /*
        $.popup.show($(document).data('portal.user.popup').login());
        var register = $(".js_user_popup_tabs_tab_link-register");
        register.after($("<a href='/registration/' target='_blank' class='js_user_popup_tabs_tab_link js_user_popup_tabs_tab_link-register js_inline-block rc-bl rc-br'>Регистрация</a>"));
        var forget = $(".js_user_popup_tabs_tab_link-repair");
        forget.after($("<a href='/getpass/' target='_blank' class='js_user_popup_tabs_tab_link js_user_popup_tabs_tab_link-repair js_inline-block rc-bl rc-br'>Напомнить пароль</a>"))
        $("#popup_login_login").attr("name", "LoginForm[login]");
        $("#popup_login_password").attr("name", "LoginForm[password]");
        $("form.login").attr("action", "/login/");
        register.remove();
        forget.remove();
        return;
        */
    });

});
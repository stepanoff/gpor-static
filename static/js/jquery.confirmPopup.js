(function($) {
	$.fn.confirmPopup = function(options) {
		var config = {
			title: '',
			msg: '',
			width: '500px',
			popup_show: function() {},
			popup_hide: function () { },
			confirm_action: function() {},
			cancel_action:  function() {},
			buttons: {ok: 'Да', cancel: 'Нет'}
		};

		if (options) {
			$.extend(config, options);
		}

		var content = '';
		content+= '<div class="js_popup_content_inside">' + config['msg'] + '</div>';
		content+= '<div class="js_popup_content_inside_buttons">';
		content+= '<i class="button buttons_wrap rc3">';
		content+= '<b class="opera_inline-block-wrap">';
		content+= '<input id="confirmPopupOk" class="forms_button js_popup_button js_popup_button-higlited" type="submit" value="' + config['buttons']['ok'] + '">';
		content+= '</b></i>';
		content+= '<input id="confirmPopupCancel" class="forms_button js_popup_button " type="button" value="' + config['buttons']['cancel'] + '">';
		content+= '</div>';

		var init_popup = function() {
			$('#confirmPopupOk').unbind();
			$('#confirmPopupOk').click(function(){
				config['confirm_action']();
				$.popup.hide();
			});

			$('#confirmPopupCancel').unbind();
			$('#confirmPopupCancel').click(function(){
				config['cancel_action']();
				$.popup.hide();
			});
		}

		var popup_show = function() { config['popup_show'](); init_popup(); };

		this.each(function() {
			$(this).popup({
				title: config.title,
				width: config.width,
				content: content,
				popupshow: popup_show,
				popuphide: config['popup_hide']
			});
		});

		return this;
	};
})(jQuery);
if (history && history.navigationMode) history.navigationMode = 'compatible';
jQuery.fn.extend({
	FormNavigate: function(o){
		var def = {
			message: '',
			rootEl: null
		};
		var settings = jQuery.extend(false, def, o);
		if (!settings.rootEl) return;

		var formdata_original = true;
		var original_content = {};
		jQuery(window).bind('beforeunload', function (){
			$(settings.rootEl + ' iframe, ' + settings.rootEl + ' input[type=text], ' + settings.rootEl + ' textarea').each(function(){
				var t = $(this);
				var content = t.contents().find('body').html() || t.val() || null;
				var elId = t.attr('id');
				if (!elId) return;
				if (elId in original_content) {
					if (original_content[elId] != content) formdata_original = false;
				}
			});
			if (!formdata_original) return settings.message;
		});

		$(settings.rootEl + ' iframe, ' + settings.rootEl + ' input[type=text], ' + settings.rootEl + ' textarea').each(function(){
			var t = $(this);
			var content = t.contents().find('body').html() || t.val() || null;
			var elId = t.attr('id');
			if (!elId) return;
			original_content[elId] = content;
		});

		jQuery(this).find(" input[type='password'], input[type='radio'], input[type='checkbox'], input[type='file']").live('change keypress', function(event){
			formdata_original = false;
		});

		jQuery(this).find(":submit, input[type='image']").click(function(){
			formdata_original = true;
			jQuery(window).unbind('beforeunload');
		});
	}
});
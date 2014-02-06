/**
 * jQuery liveTranslit plugin
 *
 * @author 	shmakov
 * @version 0.0.1
 */
(function($) {
	$.fn.liveTranslit = function(target, userOptions) {
		var options = {
			targetNotEmpty: true, // if target not empty, do nothing
			validateTarget: true
		}
		$.extend(options, userOptions);

		var target = $(target);
		var $this = $(this);

		target.keyup(function(){
			var sorce_str = $(this).val();
			if (sorce_str.length > 0) {
				$this.unbind('keyup');
			}

			if (!options.validateTarget) {
				return;
			}

			var result = sorce_str.replace($.fn.liveTranslit.defaults.allowedCharacters, '');

			if (sorce_str != result) {
				target.val( result );
			}
		});

		if (target.val().length > 0 && options.targetNotEmpty) {
			return this;
		}

		$this.keyup(function(){
			var str = $(this).val().toLowerCase();
			var result = '';
			for (var i = 0, len = str.length; i < len; i++) {
				result+= $.fn.liveTranslit.transliterate(str.charAt(i));
			}
			result = result.replace($.fn.liveTranslit.defaults.allowedCharacters, '');

			target.val( result );
		});

		// IE does't support indexOf for array
		if (!Array.indexOf) {
			Array.prototype.indexOf = function(obj) {
				for (var i = 0; i < this.length; i++) {
					if (this[i] == obj) {
						return i;
					}
				}
				return -1;
			}
		}

		return this;
	};

	/**
	 * Transliterate character
	 *
	 * @param char
	 */
	$.fn.liveTranslit.transliterate = function(charName) {
		var result = charName;
		var index = $.fn.liveTranslit.defaults.dictOriginal.indexOf(charName);
		if (index != -1) {
			result = $.fn.liveTranslit.defaults.dictTranslate[index];
		}

		return result;
	};

	/**
	 * Plugin defaults
	 */
	$.fn.liveTranslit.defaults = {
		/**
		 * Dictionaries for transliterate cyrillic-latin
		 * (ГОСТ 7.79:2000 =)
		 */
		dictOriginal:  ['а', 'б', 'в', 'г', 'д', 'е',
						'ё', 'ж', 'з', 'и', 'й', 'к',
						'л', 'м', 'н', 'о', 'п', 'р',
						'с', 'т', 'у', 'ф', 'х', 'ц',
						'ч', 'ш', 'щ', 'ъ', 'ы', 'ь',
						'э', 'ю', 'я', ' ', '-', '_'
						],
		dictTranslate: ['a', 'b', 'v',  'g', 'd', 'e',
						'jo','zh','z',  'i', 'jj','k',
						'l', 'm', 'n',  'o', 'p', 'r',
						's', 't', 'u',  'f', 'kh','c',
						'ch','sh','shh','',  'y', '',
						'eh','ju','ja', '_', '-', '_'
						],
		/**
		 * Allowed characters in transliterate string
		 */
		allowedCharacters: /[^a-z0-9\-\_\.]/g
	};
})(jQuery);
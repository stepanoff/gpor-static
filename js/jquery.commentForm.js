/**
 * depends on:
 * $(document).data('portal.resources')
 * $(document).data('portal.siteDomain')
 * smiles array
 * popup plugin
 */
(function($) {
	jQuery.fn.commentForm = function(options) {
		return this.each(function() {
			var commentForm = {
				$buttons: null,
				$textarea: null,
				$smiles: null,
				linkPopup: null,
				config: {
					interfaceResourcesUrl: $(document).data('portal.resources'),
					siteDomain: $(document).data('portal.siteDomain'),
					smiles : $(document).data('commentForm.smiles'),
					refreshActionsOnly: false
				},

				init: function(domEl) {
					this.$textarea = $(domEl);
					if (options) {
						$.extend(this.config, options);
					}

					this.linkPopup = '\
					<table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse: collapse;">\
						<tr style="height: 70px; vertical-align: top;">\
							<td align="top" style="width: 45px;">\
								<img border="0" style="margin-left: -8px; position: relative; z-index: 999; width: 37px; height: 34px; visibility: visible;" src="'+this.config.interfaceResourcesUrl+'/img/linkForm/confirm_ico.gif" />\
							</td>\
							<td style="color: rgb(66, 66, 66); font-size: 12px; vertical-align: top;">\
								<div style="margin-top: 5px;">\
									<input class="inserted_link_content" type="text" value="http://" style="padding: 3px; width: 200px; color: rgb(182, 181, 180); font-size: 14px;" />\
								</div>\
							</td>\
						</tr>\
						<tr style="height: 30px;">\
							<td align="center" colspan="2" style="white-space: nowrap; border-top: 1px solid rgb(210, 209, 203);">\
								<div style="margin-top: 15px;">\
									<img class="inserted_link_submit" title="Да" src="'+this.config.interfaceResourcesUrl+'/img/linkForm/button_yes.gif" style="width: 68px; height: 16px; cursor: pointer;" />\
									&nbsp;\
									<img class="inserted_link_cancel" title="Отмена" src="'+this.config.interfaceResourcesUrl+'/img/linkForm/cancel.gif" style="width: 68px; height: 16px; cursor: pointer;" />\
								</div>\
							</td>\
						</tr>\
					</table>';

					this._generateSmiles();

					var buttons = '\
					<table class="comments_editor" cellspacing="0" cellpadding="0">\
						<tbody><tr>\
							<td>\
								<div>\
									<img class="boldButton" src="'+this.config.interfaceResourcesUrl+'/img/commentForm/b.gif" title="Полужирный">\
									<img class="italicButton" src="'+this.config.interfaceResourcesUrl+'/img/commentForm/i.gif" title="Курсив">\
									<img class="strikeButton" src="'+this.config.interfaceResourcesUrl+'/img/commentForm/s.gif" title="Зачёркнутый">\
								</div>\
								<div>\
									<img class="leftButton" src="'+this.config.interfaceResourcesUrl+'/img/commentForm/left.gif" title="По левому краю">\
									<img class="centerButton" src="'+this.config.interfaceResourcesUrl+'/img/commentForm/center.gif" title="По центру">\
									<img class="rightButton" src="'+this.config.interfaceResourcesUrl+'/img/commentForm/right.gif" title="По правому краю">\
								</div>\
								<div>\
									<img class="linkButton" src="'+this.config.interfaceResourcesUrl+'/img/commentForm/link.gif" title="Вставить ссылку">\
									<img class="userButton" src="'+this.config.interfaceResourcesUrl+'/img/commentForm/user.gif" title="Ссылка на пользователя">\
									<img class="imageButton" src="'+this.config.interfaceResourcesUrl+'/img/commentForm/pic.gif" title="Вставить изображение">\
									<img class="videoButton" src="'+this.config.interfaceResourcesUrl+'/img/commentForm/video.gif"title="Вставить видео">\
									<img class="audioButton" src="'+this.config.interfaceResourcesUrl+'/img/commentForm/audio.gif"title="Вставить аудио">\
								</div>\
								<div class="smile_block">\
									<img class="quoteButton" src="'+this.config.interfaceResourcesUrl+'/img/commentForm/quote.gif" title="Цитировать">\
									<img class="smilesButton" src="'+this.config.interfaceResourcesUrl+'/img/commentForm/smile.gif" title="Смайлики">\
								</div>\
							</td>\
						</tr>\
					</tbody></table>';

					if (!this.config.refreshActionsOnly){
						this.$buttons = $(buttons);
						this.$textarea.wrap('<div class="js_comment_form-pad"></div>').before(this.$buttons);
					}

					this._bindActions();
				},

				_generateSmiles: function() {
//					if ($('table.smilesTable').length == 0) {
						var smiles = '<table class="smilesTable" cellspacing="0" cellpadding="0" style="border: 1px solid gray; background: white; z-index: 9999; display: none; margin-left: 4px; margin-top: 5px; position:absolute;">';
						var i=0;
						smiles+='<tr>';
						for (var smile in this.config.smiles) {
							smiles+= '<td align="center"><a title="'+smile+'" href="#"><img alt="'+smile+'" src="'+this.config.smiles[smile]+'"></a></td>';
							i++;
							if (i % 7 == 0) {
								i=0;
								smiles+='</tr><tr>';
							}
						}
						for (var j=i; j<7; j++)
							smiles+='<td></td>';
						smiles+='</tr></table>';
						this.$smiles = $(smiles);

						if (this.config.refreshActionsOnly){
							this.$smiles.attr('id','jsCommentSmiles_clone');
						}
						$('body').append(this.$smiles);
//					} else {
//						this.$smiles = $('table.smilesTable');
//					}
				},

				_bindActions: function() {
					var inst = this;

					if (this.$buttons == null){
						this.$buttons = this.$textarea.siblings('table.comments_editor');
					}

					this.$buttons.find('img.boldButton').bind('click', function() {
						inst._surroundText('[b]','[/b]');
					});
					this.$buttons.find('img.italicButton').bind('click', function() {
						inst._surroundText('[i]','[/i]');
					});
					this.$buttons.find('img.strikeButton').bind('click', function() {
						inst._surroundText('[s]','[/s]');
					});
					this.$buttons.find('img.leftButton').bind('click', function() {
						inst._surroundText('[left]','[/left]');
					});
					this.$buttons.find('img.centerButton').bind('click', function() {
						inst._surroundText('[center]','[/center]');
					});
					this.$buttons.find('img.rightButton').bind('click', function() {
						inst._surroundText('[right]','[/right]');
					});
					this.$buttons.find('img.userButton').bind('click', function() {
						inst._surroundText('[user]','[/user]');
					});
					this.$buttons.find('img.imageButton').bind('click', function() {
						inst._image_upload();
					});
					this.$buttons.find('img.videoButton').bind('click', function() {
						inst._video_upload();
					});
					this.$buttons.find('img.audioButton').bind('click', function() {
						inst._audio_upload();
					});
					this.$buttons.find('img.quoteButton').bind('click', function() {
						inst._quote();
					});
					this.$buttons.find('img.smilesButton').bind('click', function() {
						var top = parseInt(inst.$textarea.offset().top);
						var left = parseInt(inst.$textarea.offset().left);
						inst.$smiles.css({top: top+"px"});
						inst.$smiles.css({left: left+"px"});
						inst.$smiles.show();

						$(document).bind("mouseup.commentForm", function (e) {
							if ($(e.target).parents('.smilesTable').length == 0) {
								inst.$smiles.hide();
								$(document).unbind('mouseup.commentForm');
							}
						});

						return false;
					});
					this.$smiles.delegate('a','click', function(e) {
						inst._surroundText($(this).attr('title'),'');
						inst.$smiles.hide();
						$(document).unbind('mouseup.commentForm');

						return false;
					});
					this.$buttons.find('img.linkButton').popup({
						title: "Вставка ссылки",
						content: inst.linkPopup,
						width: "250px"
					}).bind("click", function () {
						$(".js_popup_frame").css("width", "360px", "background", "#F9F9F7");
						$(".js_popup_content").css("background", "#F9F9F7");

						$("img.inserted_link_cancel").bind("click", function () {
							$(".js_popup").css("display", "none");

							return false;
						});

                        $("img.inserted_link_submit").unbind("click");
                        $(".inserted_link_content").unbind("focus");
                        $(".inserted_link_content").bind("focus", function(){
                            $(".inserted_link_content").attr('value','');
                        });
						$("img.inserted_link_submit").bind("click", function () {
							var link = $(".inserted_link_content").attr("value");
							inst._surroundText("[url="+link + "]", "[/url]");
							$(".js_popup").css("display", "none");

							return false;
						});
					});
				},

				_surroundText : function (text1, text2) {
					var textarea = this.$textarea.get(0);
					if (typeof(textarea.caretPos) != "undefined" && textarea.createTextRange) {
						var caretPos = textarea.caretPos, temp_length = caretPos.text.length;
						caretPos.text = caretPos.text.charAt(caretPos.text.length - 1) == ' ' ? text1 + caretPos.text + text2 + ' ' : text1 + caretPos.text + text2;

						if (temp_length == 0) {
							caretPos.moveStart("character", -text2.length);
							caretPos.moveEnd("character", -text2.length);
							caretPos.select();
						}
						else
							textarea.focus(caretPos);
					} else if (typeof(textarea.selectionStart) != "undefined") {
						var begin = textarea.value.substr(0, textarea.selectionStart);
						var selection = textarea.value.substr(textarea.selectionStart, textarea.selectionEnd - textarea.selectionStart);
						var end = textarea.value.substr(textarea.selectionEnd);
						var newCursorPos = textarea.selectionStart;
						var scrollPos = textarea.scrollTop;

						textarea.value = begin + text1 + selection + text2 + end;

						if (textarea.setSelectionRange) {
							if (selection.length == 0)
								textarea.setSelectionRange(newCursorPos + text1.length, newCursorPos + text1.length);
							else
								textarea.setSelectionRange(newCursorPos, newCursorPos + text1.length + selection.length + text2.length);
							textarea.focus();
						}
						textarea.scrollTop = scrollPos;
					}
					else {
						textarea.value += text1 + text2;
						textarea.focus(textarea.value.length - 1);
					}
				},

				_image_upload : function () {
					var inst = this;
					$.popup.show({
							title: 'Загрузка изображения',
							content: '<iframe src="http://'+this.config.siteDomain+'/new66_upload_gate.php?object_type=photo#' + encodeURIComponent(document.location.href) + '" scrolling="no" style="width:390px;height:260px" />',
							width: 400
					});
					$(".js_popup_content").css("padding", "0px");
					$(".js_popup_frame").css("width", "450px");
					$.receiveMessage(function(e) {
						inst._surroundText('[photo]'+e.data+'[/photo]', '');
						$.popup.hide();
					}, "http://"+this.config.siteDomain);
				},

				_video_upload : function () {
					var inst = this;
					$.popup.show({
						title: 'Загрузка видео',
						content: '<iframe src="http://'+this.config.siteDomain+'/new66_upload_gate.php?object_type=video#' + encodeURIComponent(document.location.href) + '" scrolling="no" style="width: 390px;height:385px" />',
						width: 400
					});
					$(".js_popup_content").css("padding", "0px");
					$(".js_popup_frame").css("width", "450px");
					$.receiveMessage(function(e) {
						if (parseInt(e.data)==e.data)
							inst._surroundText('[video]' + e.data + '[/video]', '');
						else
							inst._surroundText('[externalvideo]' + e.data + '[/externalvideo]', '');
						$.popup.hide();
					}, "http://"+this.config.siteDomain);
				},

				_audio_upload : function () {
					var inst = this;
					$.popup.show({
						title: 'Загрузка аудио',
						content: '<iframe src="http://'+this.config.siteDomain+'/new66_upload_gate.php?object_type=audio#' + encodeURIComponent(document.location.href) + '" scrolling="no" style="width:390px;height:260px" />',
						width: 400
					});
					$(".js_popup_content").css("padding", "0px");
					$(".js_popup_frame").css("width", "450px");
					$.receiveMessage(function(e) {
						inst._surroundText('[audio]' + e.data + '[/audio]', '');
						$.popup.hide();
					}, "http://"+this.config.siteDomain);
				},

				_quote : function () {
					var quote = "";
					if (document.all) {
						var quoteobj = document.selection.createRange();
						quote = quoteobj.text;
					}
					else {
						quote = window.getSelection().toString();
					}
					this._surroundText('[quote]' + quote, '[/quote]');
				}
			};

			commentForm.init(this);
		});
	};
})(jQuery);
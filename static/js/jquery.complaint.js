/**
 * depends on:
 * $(document).data('portal.resources')
 * $(document).data('portal.siteDomain')
 * popup plugin
 */
(function($) {
	jQuery.fn.complaint = function(opts) {
		return this.each(function(){
					if ($(this).attr('id'))
						elId = $(this).attr('id');
					else
					{
						elId = 'complaint'+$.fn.complaint.count;
						$(this).attr("id", elId);
					}
					$.fn.complaint.instances[elId] = new Complaint(this, opts);
					$.fn.complaint.count++;
					return $.fn.complaint.instances[elId];
				});
			};

	$.fn.complaint.instances = new Object();
	$.fn.complaint.count = 0;


		var Complaint = function (obj, options) {
			var commentForm = {
				element: null,
				popupHtml: null,
				config: {
					interfaceResourcesUrl: $(document).data('portal.resources'),
					siteDomain: $(document).data('portal.siteDomain'),
					title: "Сообщение",
					callbackFnc: false
				},

				init: function(domEl) {
					this.element = $(domEl);
					options = options ? options : {};
					this.config = $.extend({}, this.config, options);

					this.config.callbackFnc = this.config.callbackFnc ? this.config.callbackFnc : function (el, result) {
						if(result.sent) {
							el.remove();
						}
					}
					
					this.popupHtml='\
						<table style="width: 100%">\
							<tr style="height: 70px;">\
								<td style="width: 70px; vertical-align: top; padding-top: 10px;">\
									<img src="'+this.config.interfaceResourcesUrl+'/img/linkForm/confirm_ico.gif" style="width: 37px; height: 34px; visibility: visible;">\
								</td>\
								<td style="color: #424242; font-size: 12px; vertical-align: top; padding-top: 17px;">\
									<div><b>Действительно подать жалобу?</b></div>\
								</td>\
							</tr>\
							<tr style="height: 40px;">\
								<td align="center" style="white-space: nowrap; border-top: 1px solid #D2D1CB;" colspan="2">\
									<div style="margpopup pluginin-top: 15px;">\
										<input class="button-submit" style="width: 68px; height: 16px" type="image" src="'+this.config.interfaceResourcesUrl+'/img/linkForm/button_yes.gif" alt="Да" title="Да">&nbsp;\
										<input class="button-cancel" style="width: 68px; height: 16px" type="image" src="'+this.config.interfaceResourcesUrl+'/img/linkForm/cancel.gif" alt="Отмена" title="Отмена">\
									</div>\
								</td>\
							</tr>\
						</table>';

					this._bindActions();
				},

				_bindActions: function() {
					var inst = this;

					this.element.popup({
						title: this.config.title,
						content: this.popupHtml
					}).bind("click", function (e) {
                        e.preventDefault();
						$(".js_popup_frame").css("width", "420px");

						$("input.button-cancel").bind("click", function () {
							$(".js_popup").hide();

							return false;
						});
						$("input.button-submit").bind("click", function () {
							var url = inst.element.attr('href');

							if(url == "" || url == "#")
								url = inst.element.attr('rel');

							$.ajax({
								url: url,
								type: 'post',
								dataType: 'json',
								success: function(result) {
								inst.config.callbackFnc (inst.element, result);
								}
							});

							$(".js_popup").hide();
							return false;
						});

						return false;
					});
				}
			};

			commentForm.init(obj);
	};

})(jQuery);
											$(document).ready(function () {
                                                var activeClass = 'b-afisha-channels-grid__card__item_state_opened';
												$(".b-afisha-channels-grid dl a").click(function() {
													if ($(this).parents("dl").hasClass(activeClass)) {
														$(this).next().hide().end()
															   .parents("dl").removeClass(activeClass);
													} else {
														$(this).next().show().end()
															   .parents("dl").addClass(activeClass);
													}
													return false;
												});

											});
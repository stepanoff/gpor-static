(function($) {
	jQuery.fn.pollEditor = function(value) {
		return this.each(function() {
			var pollEditor = {
				init: function(domEl) {
					var pollEditor = this;

					pollEditor.answersCounter = 0;
					pollEditor.domEl = domEl;
					pollEditor.el = $(pollEditor.domEl);
					domEl.pollEditor = this;

					this.el.find(".poll-add-answer-handler").click(function(){
						pollEditor.addAnswer();
						return false;
					});

					if(value) {
						this.el.find("[name='poll[title]']").attr("value", value.title);
						this.el.find("[name='poll[text]']").attr("value", value.text);
						this.el.find("[name='poll[multiple]']").attr("value", value.multiple);

						for (key in value.answers) {
							var answer = value.answers[key];
							pollEditor.addAnswer(answer);
						}
					}
				},
				createAnswerNode: function() {
					var pollEditor = this;
					var key = this.answersCounter++;
					var node = $(
							"<div class='poll-answer'>"
							+ "<input type='text' class='poll-answer-title' name='poll[answers]["+key+"][title]'>"
							+ "<input type='hidden' class='poll-answer-id' name='poll[answers]["+key+"][id]'>"
							+ " <a href='#' class='btn poll-answer-up-handler' title='Вверх'><i class='icon-arrow-up'></i></a> "
							+ " <a href='#' class='btn poll-answer-down-handler' title='Вниз'><i class='icon-arrow-down'></i></a> "
							+ " <a href='#' class='btn poll-answer-delete-handler' title='Удалить'><i class='icon-remove'></i></a>"
							+ "</div>"
							);

					node.find(".poll-answer-delete-handler").click(function(){
						pollEditor.removeAnswer(node);
						return false;
					});

					node.find(".poll-answer-up-handler").click(function(){
						pollEditor.moveAnswerUp(node);
						return false;
					});

					node.find(".poll-answer-down-handler").click(function(){
						pollEditor.moveAnswerDown(node);
						return false;
					});

					return node;
				},
				addAnswer: function(answerData) {
					answerNode = this.createAnswerNode();
					this.el.find(".poll-answers-list").append(answerNode);

					if(answerData) {
						answerNode.find(".poll-answer-title").attr("value", answerData.title);
						answerNode.find(".poll-answer-id").attr("value", answerData.id);
					}
				},
				removeAnswer: function(node) {
					node.remove();
				},
				moveAnswerUp: function(node) {
					var answers = this.el.find(".poll-answer");
					var index = answers.index(node);

					if(index == 0)
						return;

					var i = 0;
					var answersList = this.el.find(".poll-answers-list");

					for(i = 0; i < answers.size(); ) {
						var answer = answers.eq(i);

						if(++i == index) {
							node.appendTo(answersList);
							i++;
						}

						answer.appendTo(answersList);
					}
				},
				moveAnswerDown: function(node) {
					var answers = this.el.find(".poll-answer");
					var index = answers.index(node);

					if(index == (answers.size()-1) )
						return;

					var i = 0;
					var answersList = this.el.find(".poll-answers-list");

					for(i = 0; i < answers.size(); i++) {
						var answer = answers.eq(i);

						if(i == index) {
							i++;
							answers.eq(i).appendTo(answersList);
						}

						answer.appendTo(answersList);
					}
				}
			};

			pollEditor.init(this);
		});
	};
})(jQuery);
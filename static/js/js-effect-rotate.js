/*
При ховере на элементы hoverSelectors показывает кнопку play на элементе buttonContainer
Слушает событие contentReplaced
 */
js_effect_rotate = function(opts){

            var defaults = {
				'containerSelector' : '', // 
				'itemSelector' : '', // 
                'rotateLeftLink' : '', // 
                'rotateRightLink' : '', // 
				'containerName': ''
            };

            var o = $.extend({}, defaults, opts);
            var obj = false;
          
			var objRightLink = $("#" + o.rotateRightLink);
			var objLeftLink = $("#" + o.rotateLeftLink);
			var objContainer = $(o.containerSelector);
			var objItem = objContainer.find("." + o.itemSelector);
			var wrapClass = o.containerName + "__wrap";
			wrapObj = $("." + wrapClass);
			
			
			count = objItem.length;
			containerWidth = objContainer.width();			
			
			
			objRightLink.bind("click", function() {
				objContainer.css("position", "relative");
				objItem.eq(count-1).removeClass("b-container_visibility_hidden");
				$("." + wrapClass).animate({"height" : objContainer.find("." + o.itemSelector).eq(count-1).height() + "px"}, 100);
				objContainer.animate({"left" : "-100%"}, 200);
				return false;
			});
			
			objLeftLink.bind("click", function() {
				$("." + wrapClass).animate({"height" : objContainer.find("." + o.itemSelector).eq(0).height() + "px"}, 100);
				//objItem.eq(count-1).addClass("b-container_visibility_hidden");
				objContainer.animate({"left" : "0%"}, 200);
				return false;
			});			
			
			
			

			
			
			//objItem.css("border", "1px solid black");objContainer.css("border", "1px solid blue");objLeftLink.css("border", "1px solid red");objRightLink.css("border", "1px solid green");
		  
            // start
            this.init = function () {
                objContainer.wrap('<div class="' + wrapClass + '" style="overflow: hidden; height: ' + objContainer.find("." + o.itemSelector).eq(0).height() + "px" + '"></div>');
				objContainer.find("." + o.itemSelector).eq(count - 1).css("marginRight", "-100%");
				
				
            }

            this.initUi = function () {
                
            }
        };


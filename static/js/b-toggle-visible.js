b_toggle_visible = function(opts){

            var defaults = {
                'containerSelector' : 'body',
                'targetSelectors' : {},
                'openLinkClass' : 'b-toggle-visible__label_layout_closed',
                'closeLinkClass' : 'b-toggle-visible__label_layout_opened',
                'activeClass' : 'b-toggle-visible_state_open',
                'inactiveClass' : 'b-toggle-visible_state_close',
                'itemSelector' : 'b-toggle-visible'
            };

            var o = $.extend({}, defaults, opts);
            var obj = $(o.itemSelector);

            var initUi = function(evt) {
                evt = evt ? evt : false;
                var el = obj;
                if (evt) {
                    var targ = evt['target'] ? evt['target'] : false;
                    if (targ && o.itemSelector) {
                        var containerFound = false;
                        var closestContainer = $(targ).find(o.itemSelector);
                        if (!closestContainer.length)
                            closestContainer = $(targ).parent().find(o.itemSelector);
                        if (closestContainer.length) {
                            containerFound = true;
                            el = closestContainer;
                        }
                        if (!containerFound)
                            return;
                    }
                    else if (!o.itemSelector)
                        el = obj;
                }

                obj = el;
    
                if (obj.hasClass(o.inactiveClass)) {
                    var container = obj.closest(o.containerSelector);
                    for (i in o.targetSelectors) {
                        container.find(o.targetSelectors[i]).hide();
                    }
                }

                obj.delegate("."+o.openLinkClass, 'click', function(){
                    var container = $(this).closest(o.containerSelector);
                    $(this).closest(o.itemSelector).removeClass(o.inactiveClass).addClass(o.activeClass);
                    for (i in o.targetSelectors) {
                        container.find(o.targetSelectors[i]).show();
                    }
                    return false;
                });
                obj.delegate("."+o.closeLinkClass, 'click', function(){
                    var container = $(this).closest(o.containerSelector);
                    $(this).closest(o.itemSelector).removeClass(o.activeClass).addClass(o.inactiveClass);
                    for (i in o.targetSelectors) {
                        container.find(o.targetSelectors[i]).hide();
                    }
                    return false;
                });
            }

            // start
            this.init = function () {
                app.addListener ('contentReplaced', initUi);
            }

            this.initUi = function () {
                initUi();
            }
        };
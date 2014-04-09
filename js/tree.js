(function($){

    $.fn.jquery_tree = function(opts){
        opts = $.extend({}, $.fn.jquery_tree.defaults, opts);
        return this.each(function(){
            $.fn.jquery_tree.instances[$(this).attr('id')] = new Tree(this, opts, $(this).attr('id') );
            return $.fn.jquery_tree.instances[$(this).attr('id')];
        });
    };
    
    $.fn.jquery_tree.instances = {};
    $.fn.jquery_tree_refresh = function(){
        if($.fn.jquery_tree.instances[$(this).attr('id')])
            return $.fn.jquery_tree.instances[$(this).attr('id')].refreshValue();
    };  
    
    $.fn.jquery_tree_open = function(tree_instance_id){
        tree_instance_id = tree_instance_id?tree_instance_id:this.attr('name');
        if($.fn.jquery_tree.instances[tree_instance_id])
            return $.fn.jquery_tree.instances[tree_instance_id].dialogObject.dialog('open');
    };  

    
    $.fn.jquery_tree.defaults = {
        CLASS_JQUERY_TREE : 'jquery-tree',
        CLASS_JQUERY_TREE_CONTAINER : 'jquery-tree-container',
        CLASS_JQUERY_TREE_HIDDEN : 'jquery-tree-hidden',
        CLASS_JQUERY_TREE_CONTROLS : 'jquery-tree-controls',
        CLASS_JQUERY_TREE_VALUE : 'jquery-tree-value',
        CLASS_JQUERY_TREE_TOGGLE : 'jquery-tree-toggle',
        CLASS_JQUERY_TREE_COLLAPSE_ALL : 'jquery-tree-collapseall',
        CLASS_JQUERY_TREE_EXPAND_ALL : 'jquery-tree-expandall',
        CLASS_JQUERY_TREE_COLLAPSED : 'jquery-tree-collapsed',
        CLASS_JQUERY_TREE_HANDLE : 'jquery-tree-handle',
        CLASS_JQUERY_TREE_TITLE : 'jquery-tree-title',
        CLASS_JQUERY_TREE_NODE : 'jquery-tree-node',
        CLASS_JQUERY_TREE_LEAF : 'jquery-tree-leaf',
        CLASS_JQUERY_TREE_DISABLED : 'jquery-tree-disabled',
        CLASS_JQUERY_TREE_CHECKED : 'jquery-tree-checked',
        CLASS_JQUERY_TREE_UNCHECKED : 'jquery-tree-unchecked',
        CLASS_JQUERY_TREE_CHECKED_PARTIAL : 'jquery-tree-checked-partial',
        COLLAPSE_ALL_CODE : 'закрыть все',
        EXPAND_ALL_CODE : 'открыть все',
        CHOOSE_CODE : 'выбрать',
        TREE_NODE_HANDLE_CODE : '<span class="jquery-tree-handle">+</span>',
        TREE_NODE_HANDLE_COLLAPSED : "+",
        TREE_NODE_HANDLE_EXPANDED : "&minus;",
        selectParents : true,
        collapseChildrenResult : false,
        autoSelectChildren : true,
        showSelected : true,
        autoRefreshSelected : false,
        autoOpenNode : true,
        usePopup : true,
        title: 'выберите город',
        defaultNodeId: false
    };

    var Tree = function(obj, o, instance_id){
            if (o.usePopup)
            {
                $(obj).before('<div class="' + o.CLASS_JQUERY_TREE_CONTAINER + '"></div>');
                this.dialogObject = $(obj).parent().find('div.'+o.CLASS_JQUERY_TREE_CONTAINER);
                $(this.dialogObject).dialog({ 
                    autoOpen: false, 
                    modal: true, 
                    resizable: false, 
                    draggable: false, 
                    width: 700, 
                    height:600, 
                    title: o.title,
                    close: function(event, ui) { $(obj).jquery_tree_refresh(); }
                });
                $(this.dialogObject).html($(obj).parent().html());
                
                $(obj).before('<div class="' + o.CLASS_JQUERY_TREE_TOGGLE + '">'+o.CHOOSE_CODE+'</div>');
                toggleObject = $(obj).parent().find("."+o.CLASS_JQUERY_TREE_TOGGLE).attr('name', instance_id);
            }
            
            if (o.showSelected)
            {
                $(obj).before('<div class="' + o.CLASS_JQUERY_TREE_VALUE + '"></div>');
                this.valueObject = $(obj).parent().find("."+o.CLASS_JQUERY_TREE_VALUE);
            }

            $(obj).before('<div class="' + o.CLASS_JQUERY_TREE_HIDDEN + '"></div>');
            this.inputsObject = $(obj).parent().find("."+o.CLASS_JQUERY_TREE_HIDDEN);
            name = $(obj).find('input:checkbox:first').attr('name');
            this.hidden_input = '<input type="hidden" name="'+name+'" value="{1}"/>';

            if (o.usePopup)
            {
                $(obj).remove();
                
                this.treeObject = $(this.dialogObject).children('ul');
                
                toggleObject.tree_instance_id = instance_id;
                $(toggleObject).click (function(){$(this).jquery_tree_open(); });
            }
            else
            {
                this.treeObject = $(obj);
            }
            
            $(this.treeObject).addClass(o.CLASS_JQUERY_TREE);
            
            var controls = '';
            if (o.COLLAPSE_ALL_CODE)
                controls = '<span class="'+o.CLASS_JQUERY_TREE_COLLAPSE_ALL+'">'+o.COLLAPSE_ALL_CODE+'</span>';
            if (o.EXPAND_ALL_CODE)
                controls += '<span class="'+o.CLASS_JQUERY_TREE_EXPAND_ALL+'">'+o.EXPAND_ALL_CODE+'</span>';
            
            if (controls != '')
                $(this.treeObject).before('<div class="' + o.CLASS_JQUERY_TREE_CONTROLS + '">' + controls + '</div>');
            if (o.COLLAPSE_ALL_CODE)
                $(this.treeObject).parent().find('.'+ o.CLASS_JQUERY_TREE_CONTROLS + ' .' + o.CLASS_JQUERY_TREE_COLLAPSE_ALL).click(function(){
                    $(this).parent().next('.' + o.CLASS_JQUERY_TREE)
                        .find('li:has(ul)')
                        .addClass(o.CLASS_JQUERY_TREE_COLLAPSED)
                        .find('.' + o.CLASS_JQUERY_TREE_HANDLE)
                        .html(o.TREE_NODE_HANDLE_COLLAPSED);
                });

            if (o.EXPAND_ALL_CODE)
                $(this.treeObject).parent().find('.'+ o.CLASS_JQUERY_TREE_CONTROLS + ' .' + o.CLASS_JQUERY_TREE_EXPAND_ALL)
                    .click(function(){
                        $(this).parent().next('.' + o.CLASS_JQUERY_TREE)
                            .find('li:has(ul)')
                            .removeClass(o.CLASS_JQUERY_TREE_COLLAPSED)
                            .find('.' + o.CLASS_JQUERY_TREE_HANDLE)
                            .html(o.TREE_NODE_HANDLE_EXPANDED);
                    });

            $('li', this.treeObject).find(':first').addClass(o.CLASS_JQUERY_TREE_TITLE)
                .closest('li').addClass(o.CLASS_JQUERY_TREE_LEAF);

            $('li:has(ul:has(li))', this.treeObject).find(':first')
                .before(o.TREE_NODE_HANDLE_CODE)
                .closest('li')
                    .addClass(o.CLASS_JQUERY_TREE_NODE)
                    .addClass(o.CLASS_JQUERY_TREE_COLLAPSED)
                    .removeClass(o.CLASS_JQUERY_TREE_LEAF);

            $('.' + o.CLASS_JQUERY_TREE_HANDLE, o.treeObject).bind('click', function(){ toggleNode(this); });
            
            var toggleNode = function (obj) {
                var leafContainer = $(obj).parent('li');
                var leafHandle = leafContainer.find('>.' + o.CLASS_JQUERY_TREE_HANDLE);
                leafContainer.toggleClass(o.CLASS_JQUERY_TREE_COLLAPSED);
                if (leafContainer.hasClass(o.CLASS_JQUERY_TREE_COLLAPSED))
                    leafHandle.html(o.TREE_NODE_HANDLE_COLLAPSED);
                else
                    leafHandle.html(o.TREE_NODE_HANDLE_EXPANDED);
            };
            
            var checkParentCheckboxes = function (checkboxElement){
                if (!o.selectParents)
                    return true;
                if (typeof checkboxElement == 'undefined' || !checkboxElement)
                    return true;
                var closestNode = $(checkboxElement).closest('ul');
                var parentCheckbox = closestNode.closest('li').find('>.' + o.CLASS_JQUERY_TREE_TITLE + ' input:checkbox');

                if (parentCheckbox.length > 0) {

                    var allCheckboxes = closestNode.find('input:checkbox');
                    var checkedCheckboxes = closestNode.find('input:checkbox:checked');
                    var allChecked = allCheckboxes.length == checkedCheckboxes.length;

                    parentCheckbox.get(0).checked = allChecked;
                    
                    if (o.autoSelectChildren)
                    {
                        if (!allChecked && checkedCheckboxes.length > 0)
                            parentCheckbox.closest('label')
                                .addClass(o.CLASS_JQUERY_TREE_CHECKED_PARTIAL)
                                .removeClass(o.CLASS_JQUERY_TREE_CHECKED)
                                .removeClass(o.CLASS_JQUERY_TREE_UNCHECKED);
                        else
                            if (allChecked)
                                parentCheckbox.closest('label')
                                    .removeClass(o.CLASS_JQUERY_TREE_CHECKED_PARTIAL)
                                    .removeClass(o.CLASS_JQUERY_TREE_UNCHECKED)
                                    .addClass(o.CLASS_JQUERY_TREE_CHECKED);
                            else
                                parentCheckbox.closest('label')
                                    .removeClass(o.CLASS_JQUERY_TREE_CHECKED_PARTIAL)
                                    .removeClass(o.CLASS_JQUERY_TREE_CHECKED)
                                    .addClass(o.CLASS_JQUERY_TREE_UNCHECKED);
                    }
                    
                    return checkParentCheckboxes(parentCheckbox.get(0));
                }
                if (o.autoRefreshSelected)
                    this.refreshValue();
                return true;
            };
            
            var toggleChildren = function (checkboxElement) {
                isChecked = $(checkboxElement).attr('checked');
                pl = $(checkboxElement).closest('li');
                if (isChecked)
                {
                    pl.find("input:checkbox:enabled").attr('checked', 'checked');
                    pl.find('label.'+o.CLASS_JQUERY_TREE_UNCHECKED).addClass(o.CLASS_JQUERY_TREE_CHECKED)
                    .removeClass(o.CLASS_JQUERY_TREE_UNCHECKED)
                    .removeClass(o.CLASS_JQUERY_TREE_CHECKED_PARTIAL);
                }
                else
                {
                    pl.find("input:checkbox").removeAttr('checked');
                    pl.find('label.'+o.CLASS_JQUERY_TREE_TITLE).addClass(o.CLASS_JQUERY_TREE_UNCHECKED)
                    .removeClass(o.CLASS_JQUERY_TREE_CHECKED)
                    .removeClass(o.CLASS_JQUERY_TREE_CHECKED_PARTIAL);
                }
            
            };

            var checkCheckbox = function (checkboxElement){
                isChecked = $(checkboxElement).attr('checked');
                if (o.autoSelectChildren || !isChecked)
                {
                    toggleChildren (checkboxElement);
                }
                if (checkParentCheckboxes(checkboxElement))
                    return true;
            };

            var setLabelClass = function (checkboxElement){
                
                isDisabled = $(checkboxElement).attr('disabled');
                isChecked = $(checkboxElement).attr('checked');

                if (isDisabled) {
                    $(checkboxElement).closest('label')
                    .addClass(o.CLASS_JQUERY_TREE_DISABLED)
                    .removeClass(o.CLASS_JQUERY_TREE_CHECKED)
                    .removeClass(o.CLASS_JQUERY_TREE_UNCHECKED)
                    .removeClass(o.CLASS_JQUERY_TREE_CHECKED_PARTIAL);
                    $(checkboxElement).attr('value', '');
                }
                else if (isChecked) {
                    $(checkboxElement).closest('label')
                        .addClass(o.CLASS_JQUERY_TREE_CHECKED)
                        .removeClass(o.CLASS_JQUERY_TREE_UNCHECKED)
                        .removeClass(o.CLASS_JQUERY_TREE_CHECKED_PARTIAL);
                }
                else {
                    $(checkboxElement).closest('label')
                        .addClass(o.CLASS_JQUERY_TREE_UNCHECKED)
                        .removeClass(o.CLASS_JQUERY_TREE_CHECKED)
                        .removeClass(o.CLASS_JQUERY_TREE_CHECKED_PARTIAL);
                }
            };
            
            var expandNode = function (liElement)
            {
                $(liElement)
                .removeClass(o.CLASS_JQUERY_TREE_COLLAPSED)
                .find('.' + o.CLASS_JQUERY_TREE_HANDLE)
                .html(o.TREE_NODE_HANDLE_EXPANDED);
                
                $(liElement).find('li:has(ul)')
                .removeClass(o.CLASS_JQUERY_TREE_COLLAPSED)
                .find('.' + o.CLASS_JQUERY_TREE_HANDLE)
                .html(o.TREE_NODE_HANDLE_EXPANDED);
            };

            var labelClick = function (labelElement){
                var checkbox = $('input:checkbox', labelElement);
                var checked = checkbox.attr('checked');
                checkbox.attr('checked', !checked);
                setLabelClass(checkbox);

                if (o.autoOpenNode && $(labelElement).parent().hasClass(o.CLASS_JQUERY_TREE_NODE))
                    expandNode ($(labelElement).parent());
            };
            
            this.refreshValue = function (){
                $(this.valueObject).html('');
                $(this.inputsObject).html('');
                _this = this;
                $(this.treeObject).find("input:checked").each (function(){
                    var closestNode = $(this).closest('ul');
                    
                    var parentCheckbox = closestNode.closest('li').find('>.' + o.CLASS_JQUERY_TREE_TITLE + ' input:checkbox');
    
                    toWrite = false;
                    if (!o.collapseChildrenResult) {
                        if (parentCheckbox.length > 0)
                            toWrite = true;
                    }
                    else {
                        if (parentCheckbox.length > 0 && $(parentCheckbox).attr('checked') ){
                            if (!o.selectParents)
                                toWrite = true;
                        }
                        else {
                            toWrite = true;
                        }
                    }
                    
                    if (toWrite)
                    {
                        val = $(_this.valueObject).html()+' '+$(this).parent().find('span').html();
                        $(_this.valueObject).html(val);
                        
                        str = _this.hidden_input.replace('{1}', $(this).attr('value'));
                        $(_this.inputsObject).append(str);
                    }

                });
            };
            
            $('input:enabled', this.treeObject).click(function(){
                setLabelClass(this);
                checkCheckbox(this);
            })
            .each(function(){
                setLabelClass(this);
                if (this.checked)
                {
                    if (checkParentCheckboxes(this))
                    {
                        // auto-open nodes with selected leafs
                        parentCheckbox = $(this).closest('ul').closest('li').find('>.' + o.CLASS_JQUERY_TREE_TITLE + ' input:checkbox');
                        if (parentCheckbox.length > 0  )
                        {
                            parentHandle = $(parentCheckbox).closest('li').find('.'+o.CLASS_JQUERY_TREE_HANDLE);
                            if (parentHandle.parent().hasClass(o.CLASS_JQUERY_TREE_COLLAPSED))
                                parentHandle.click();
                        }
                        if (o.autoSelectChildren)
                            toggleChildren (this);
                    }
                }
            })
            .closest('label').click(function(){
                labelClick(this);
                checkCheckbox($('input:checkbox', this));
            });
            
            $('input:disabled', this.treeObject).each(function(){
                setLabelClass(this);
            });
            
            // selectParentsOff
            if (!o.selectParents)
            {
                $('.'+o.CLASS_JQUERY_TREE_NODE, this.treeObject).each(function(){
                    $(this).children('label').find('input:checkbox').remove();
                    $(this).children('label').unbind('click')
                    .removeClass(o.CLASS_JQUERY_TREE_DISABLED)
                    .removeClass(o.CLASS_JQUERY_TREE_CHECKED)
                    .removeClass(o.CLASS_JQUERY_TREE_UNCHECKED)
                    .removeClass(o.CLASS_JQUERY_TREE_CHECKED_PARTIAL)
                    .bind ('click', function(){ $(this).parent().find('.'+o.CLASS_JQUERY_TREE_HANDLE).click();return false; });
                });
            }
            
            // Auto select default node
            if (o.defaultNodeId) {
                var el = $(this.treeObject).find('#'+o.defaultNodeId);
                el.attr('checked','cheched');
                checkCheckbox(el.get());
            }

            // set selected values
            if (o.showSelected)
                this.refreshValue();

    };
})(jQuery);
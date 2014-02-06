newsAdminTags = function(opts) {

    var defaults = {
        'containerSelector' : '',
        'inputSelector' : '',
        'inputName' : '',
        'autoCompleteUrl' : '',
        'editTagUrl' : '',
        'unionTagUrl': '',
        'tags' : {},
        'tagStatusPlot' : '',

        'tagPlotClass' : 'tags__tagRow_status_plot',
        'addTagClass' : 'addTag',
        'editTagClass' : 'editTag',
        'unionTagClass': 'unionTag',
        'removeTagClass' : 'removeTag',
        'moveUpTagClass' : 'moveUpTag',
        'moveDownTagClass' : 'moveDownTag'
    };

    var o = $.extend({}, defaults, opts);

    var obj = false;
    if (o.inputSelector)
        obj = $(o.inputSelector);
    var container = obj.closest(o.containerSelector);
    obj.remove();

    var currentTag = false;

    // добавляем контейнер с тегами
    var div = $("<div>");
    div.addClass("tags");
    container.append(div);
    var tagContainer = container.find(".tags");

    // добавляем текстовый инпут с автокомплитом
    var input = $("<input>");
    input.attr("type", "text");
    input.attr("name", "tags__autocomplete");
    input.attr("value", '');
    container.append(input);
    var autoCompleteInput = container.find('input[name="tags__autocomplete"]');
    container.append('<a class="addTag" title="Добавить" href="#"><span class="icon-add poll-add-handler"></span></a>');

    var addTag = function (attributes) {
        var input = $('<input>');
        input.attr("type", "hidden");
        input.attr("name", o.inputName);
        var div = $("<div>");
        div.addClass("tags__tagRow");

        div.append(input);
        div.append('<span class="tags__tagRow__value"></span>');

        var btns = '<div class="tags__tagRow__btns"><a href="#" class="editTag buttons_edit_small">Правка</a><a href="#" class="removeTag buttons_remove_small">Удалить</a><a href="#" class="unionTag buttons_union_small" title="Объединить">&nbsp;</a></div>';
        div.append(btns);

        updateTag(div, attributes);

        tagContainer.append(div);
    }

    var removeTag = function (el) {
        var d = $(el).closest(".tags__tagRow");
        d.remove();
    }

    var updateTag = function (tagRowObj, attributes) {
        tagRowObj.find(".tags__tagRow__value").html(attributes['name']);
        tagRowObj.find("input").val(attributes['name']);
        if (attributes['status'] == o.tagStatusPlot)
            tagRowObj.addClass(o.tagPlotClass);
        else
            tagRowObj.removeClass(o.tagPlotClass);
    }

    var unionTag = function(el) {
        currentTag = $(el).closest(".tags__tagRow");
        var input = currentTag.find("input");
        $.popup.show({ 
            title: 'Объединить тег "' + input.val() + '"', 
            content: '<div id="unionTagForm"></div>', 
            width: 500, height: 100, overflow: "auto" 
        });
        $.ajaxCallback(o.unionTagUrl, {'tag': input.val()});
        $("#unionTagForm").delegate('input[type="submit"]', 'click', function(){ sendForm($(this)); return false; });
    }

    var obtainResponse = function(data) {
        if (data['ok']) {
            if (data['tagAttributes']) {
                updateTag (currentTag, data['tagAttributes']);
            }
            if (data['newTag']) {
                addTag(data['newTag']);
            }
            if (data['removeCurrentTag']) {
                removeTag(currentTag);
            }
            currentTag = false;
            $.popup.hide();
        }
    }

    var sendForm = function (el) {
        var formObj = el.closest("form");
        var url = formObj.attr("action");
        var data = formObj.serializeArray();
        $.ajaxCallback(url, data, obtainResponse);
    }

    var editTag = function (el) {
        currentTag = $(el).closest(".tags__tagRow");
        var input = currentTag.find("input");
        $.popup.show({ title: 'Редактирование тега', content: '<div id="editTagForm"></div>', width: 600, height: 400, overflow: "auto" });
        $("#editTagForm").delegate('input[type="submit"]', 'click', function(){ sendForm($(this)); return false; });
        $.ajaxCallback(o.editTagUrl, {'tag': input.val()});
    }

    var moveUpTag = function (el) {
    }

    var moveDownTag = function (el) {
    }

    var addValue = function (el) {
        var attributes = {};
        attributes['name'] = el['value'];
        attributes['status'] = el['data'][0];
        attributes['id'] = el['data'][1];
        autoCompleteInput.val('');
        addTag(attributes);
    }

    autoCompleteInput.autocomplete(o.autoCompleteUrl, {
        selectFirst: false,
        //useDelimiter: true,
        'onItemSelect' : function(el) {addValue(el);}
        //'onFinish' : function(el) {alert(el); addValue();}
    });

    var init = function () {
        // вставляем в него текущие теги
        if (o.tags) {
            var i = 0;
            for (i in o.tags) {
                addTag(o.tags[i]);
            }
        }

        // добавление тега
        container.delegate("."+o.addTagClass, 'click', function(){
            var el = {
                'value' : autoCompleteInput.val(),
                'data' : [0, 0]
            };
            addValue(el);
            return false;
        });

        // удаление тега
        container.delegate("."+o.removeTagClass, 'click', function(){
            removeTag($(this));
            return false;
        });

        // редактирование тега
        container.delegate("."+o.editTagClass, 'click', function(){
            editTag($(this));
            return false;
        });

        // объединение тега
        container.delegate("."+o.unionTagClass, 'click', function(){
            unionTag($(this));
            return false;
        });

        // сдвинуть тег вверх
        // сдвинуть тег вниз
    }

    init();
    // start
    this.init = function () {
        init();
    }

    this.initUi = function () {

    }
};
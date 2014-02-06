var Credit = {
	_model: '',
	_compare_list: {},

	init: function(model, compare_list)
	{
		if (!model) {
			return;
		}
		Credit._compare_list = compare_list || {};
		Credit._model = model;
		Credit._init_checkbox();
		Credit._draw_table();
	},

	compare: function()
	{
		$('#search-results__table-submit-form').submit();
	},

    clear: function()
    {
        $("#search-results__table-submit-form input[name='compare[]']").remove();
        $("#search-results__table-submit_bufer li").remove();
        $('#search-results__table-list-submit').css('display', 'none');
        $("#searchResultsTableList input").each(function(){
                $(this).attr('checked', false);
                $(this).closest('td').find('a').css('display', 'none');
                Credit._compare('delete', this.value);
        });
    },

	_draw_table: function()
	{
		var content = '';
		var compare_inputs = '';
		var i = 1;
		for (var p in Credit._compare_list) {
			var class_name = 'search-results__table-list-tr';
			if (i % 2 == 0) {
				class_name = 'search-results__table-list-tr odd';
			}
			/*content+= '<tr class="' + class_name + '">';
			content+= '<td><a target="_blank" href="' + Credit._compare_list[p]['url'] + '">' + Credit._compare_list[p]['name'] + '</a></td>';
			content+= '<td><a title="Удалить" class="buttons_remove_small inline-block" onclick="Credit._delete(' + p + ')">Удалить</a></td>';
			content+= '</tr>';*/

            content += '<li class="b-credit-compare__elem">';
            content += '<a href="' + Credit._compare_list[p]['url'] + '" class="b-credit-compare__credit">' + Credit._compare_list[p]['name'] + '</a>';
            content += '<span class="b-credit-compare__remove" onclick="Credit._delete(' + p + ')">✕</span></li>';
			compare_inputs+= '<input type="hidden" name="compare[]" value="' + p + '" />';
			i++;
		}
		$('#search-results__table-submit-form').html(compare_inputs);
		$("#search-results__table-submit_bufer li").remove();
		$("#search-results__table-submit_bufer").append(content);

		if (content.length > 0) {
			$('#search-results__table-list-submit').css('display', 'block');
		}
		else {
			$('#search-results__table-list-submit').css('display', 'none');
		}
	},

	_init_checkbox: function()
	{
		$("#searchResultsTableList input").each(function(){
			var el = $(this);
			var compare_link = el.parent().find('a');
			if (Credit._compare_list[el.val()]) {
				el.attr('checked', 'checked');
				compare_link.css('display', 'inline-block');
			}
			/*compare_link.click(function(){
				Credit.compare();
				return false;
			});*/
			el.click(function() {
				if($(this).attr('checked')){
					var action = 'add';
					//el.parent().find('a').css('display', 'inline-block');
				}
				else {
					var action = 'delete';
					//el.parent().find('a').css('display', 'none');
				}
				Credit._compare(action, $(this).val());
			});

		});
	},

	_compare: function(action, id)
	{
		$.ajax({
			type: 'POST',
			dataType: 'json',
			url: '/bank/editcomparecredit/',
			data: {
				model: Credit._model,
				action: action,
				id: id
			},
			success: function(data) {
				if (data) {
					Credit._compare_list = data;
					Credit._draw_table();
				}
			}
		});
	},

	_delete: function(id)
	{
		$("#searchResultsTableList input").each(function(){
			if (this.value == id) {
				$(this).attr('checked', false);
				$(this).closest('td').find('a').css('display', 'none');
			}
		});
		Credit._compare('delete', id);
	}
}
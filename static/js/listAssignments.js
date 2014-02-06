threadBox(function () {

	$(document).bind('contentbodyload', function(){

		$('.rule_delete_form').submit(function()
        {
            if ( confirm('Действительно удалить право у пользователя?') )
            {
                var el = $(this);

                $.ajax(
                        {
                            'type':     'POST',
                            'url':      el.attr('action'),
                            'data':     el.serialize(),
                            'success':  function(data, textStatus)
                                        {
                                            el.parent().remove()
                                        }
                        }
                      );
            }

            return false;
        });

        $('#moduleId').change(function()
        {
            var
                el      = $(this),
                link    = el.data('link')||null;

            if ( link )
            {
                $.ajax(
                        {
                            'type':     'POST',
                            'dataType': 'json',
                            'url':      link,
                            'data':     {
                                            'moduleId': $(this).val()
                                        },
                            'success':  function(data, textStatus)
                                        {
                                            var
                                                select = $('#itemName'),
                                                text = '';

                                            $.each(data, function(key, val)
                                            {
                                                text += '<option value="' + key + '">' + val + '</option>';
                                            });

                                            if ( !text )
                                            {
                                                select.hide();
                                            }
                                            else
                                            {
                                                select.html(text).show();
                                            }
                                        }
                        }
                      );
            }
        });
	});

});
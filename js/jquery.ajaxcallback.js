(function ($) {

$.ajaxCallback = function ()
{
    if (!arguments.length)
        return;

    if (!$.isPlainObject(arguments[0]))
    {
        var options = {
                url: arguments[0],
                data: arguments[1] || {},
                success: arguments[2] || function(){},
                error: arguments[3] || function(){},
                before: arguments[4] || function(){},
                type: 'post'
            };
    }
    else
    {
        var options = {};
        $.extend( options, { type: 'post', dataType: 'json', success: function(){} }, arguments[0] );
    }

    var optionsSuccess = options.success;

    function callback(data)
    {
        options.before.call(this, data);

        if (!data)
            return;

		if (data.messages)
		{
			Messager.addMessages(data.messages);
			delete (data['messages']);
		}
		
		succ = data.success ? data.success : false;
		if (data.success)
			delete (data['success']);

        if (data)
        {
            for (i in data)
                $('#'+i).html(data[i]);
        }
        
        if (succ)
            data.success.call(this, data);
        else
            optionsSuccess.call(this, data);
    }

    options.success = callback;
    options.dataType = 'json';

    $.ajax(options);
};

$.ajaxCallbackForm = function ()
{
	callback = arguments[2] ? arguments[2] : false;
	url = arguments[1] ? arguments[1] : formObj.action;
	formObj = arguments[0];
	tmp = $(formObj).serialize();
	send_data = new Object();
	send_data['jqueryForm'] = tmp;
	url = url + "?submitted=1";
	$.ajaxCallback(url, send_data, callback);
};


$.ajaxCallbackFormFull = function ()
{
    if (!arguments.length)
        return;

    var options = { data: {ajax : 1, iframeAjax : 1} };
    
    options.success = arguments[1] || function () { };
    var optionsSuccess = options.success;
	
    function callback(data)
    {
        if (!data)
            return;
        
		if (data.messages)
		{
			Messager.addMessages(data.messages);
			delete (data['messages']);
		}

		succ = data.success ? data.success : false;
		if (data.success)
			delete (data['success']);

        if (data)
        {
            for (i in data)
                $('#' + i).html(data[i]);
        }

        if (succ)
            data.success.call(this, data);
        else
            optionsSuccess.call(this, data);
    }
    
    options.success = callback;
    options.dataType = 'json';
	
	$(arguments[0]).ajaxForm( options );
	$(formObj).submit();
	return false;
};

})(jQuery);
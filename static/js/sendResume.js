var sendResumeContainer = false;
var sendResumeDialogForm = false;
function ShowSendResume (data, link)
{
	link = link?link:false;
	data = data?data:false;
	
	if (sendResumeContainer == false)
	{
		$('<div id="sendResumeContainer" class="hidden"><div id="sendResumeDialogForm"></div></div>').appendTo($('body'));
		sendResumeContainer = $("#sendResumeContainer");
		sendResumeDialogForm = $("#sendResumeDialogForm");
		sendResumeContainer.dialog({ autoOpen: false, modal: true, resizable: false, draggable: false, width: 700, position: ['center', 100], title: "Отправить отклик" });
	}

	if (data)
	{
		if (data['sendResumeDialogForm'])
		{
			sendResumeDialogForm.html(data['sendResumeDialogForm']);
			if (data['ok'])
			{
				sendResumeContainer.dialog('close');
			}
			else
			{
				sendResumeContainer.dialog('open');
			}
		}
		return false;
	}
	else if (sendResumeDialogForm.html()=='')
	{
		url = $(link).attr('href');
		$.ajaxClassback (url, {}, ShowSendResume);
		return false;
	}
	else
	{
		sendResumeContainer.dialog('open');
	}
	return false;
}
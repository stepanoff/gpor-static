

function videoProcessDelete()
	{
	if (confirm('Вы уверены что хотите удалить этот видео файл?'))
		{
		
		}

	return false;
	}

function videoProcessSubmit()
	{
	$('#videoNameTarget').val($('#videoName').val());
	$('#videoDescTarget').val($('#videoDesc').val());

	$('#editVideoForm').submit();

	return false;
	}




$(document).ready(function(){
	$('.videoDeleteProcess').confirmPopup({
		title: 'Удаление видео',
		msg: 'Вы уверены что хотите удалить этот видео файл?',
		confirm_action: function(){$('#editVideoForm').submit();}
	})
})


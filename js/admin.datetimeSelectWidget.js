$(document).ready(function ()
{
	function getWithBeginingZero(value)
	{
		if (value < 10)
			return "0" + value;
		else
			return value;
	}

	function initDatePicker()
	{
		$(".hiddentime").each(function (index) {
			var startDate = new Date($(this).val() * 1000);

			var timemask = getWithBeginingZero(startDate.getHours()) + ":" + getWithBeginingZero(startDate.getMinutes());
			var datepick = getWithBeginingZero(startDate.getDate()) + "." + getWithBeginingZero(startDate.getMonth() + 1) + "." + (startDate.getYear() + 1900);

			$(this).parent("div").find(".timemask").val(timemask);
			$(this).parent("div").find(".datepick").val(datepick);
		});

		$(".datepick").datepicker({
			onSelect:function (DateText, inst) {
				setTimeStamp(DateText, inst.input.siblings(".timeEntry_wrap").find(".timemask").val(), inst.input.siblings(".hiddentime"));
			}
		});

		$(".timemask").timeEntry({
			show24Hours:true,
			allowEmpty:false,
			spinnerImage:""
		}).change(function () {
			setTimeStamp($(this).parent().siblings(".datepick").val(), $(this).val(), $(this).parent().siblings(".hiddentime"));
		});
	}

	function setTimeStamp(dateVal, timeVal, returnObject) 
	{
		var timeArr = timeVal.split(":");
		var dateArr = dateVal.split(".");
		var date = new Date(
			parseInt(dateArr[2], 10), // year
			parseInt(dateArr[1], 10) - 1, // month
			parseInt(dateArr[0], 10), // day
			parseInt(timeArr[0], 10), // hours
			parseInt(timeArr[1], 10) // minutes
		);
		returnObject.val(Math.round(date.getTime() / 1000));
	}

	initDatePicker();

	$('input[type="checkbox"].needDisable').click(function ()
	{
		setNull = null;
		container = $(this).parent();
		datepick = container.children('input.datepick').toggleClass('hidden');
		timemask = container.find('input.timemask').toggleClass('hidden');
		if (datepick.hasClass('hidden'))
			container.children('input[type="hidden"]').val(setNull);
		else
			container.children('input[type="hidden"]').val(container.children('input[type="hidden"]').attr('default'));
	});

	$('input[type="checkbox"]:checked.needDisable').each(function(i,e)
	{
		$(e).click().attr('checked','checked');
	});
});
jQuery(document).bind('keydown', 'Ctrl+Left', function(e) {
	if (e.target.tagName.toLowerCase() == 'textarea' ||
		e.target.tagName.toLowerCase() == 'input') {
		return;
	}
	var href = jQuery('ul.yiiSitePager .previous a').attr('href');
	if (href)
	{
		document.location = href;
	}
	else
	{
		var href = jQuery('.pagerDiscountBox .pagerDiscountArr .prev').attr('href');
		if (href)
		{
			document.location = href;
		}
	}

	e.stopPropagation();
	e.preventDefault();
	return false;
});

jQuery(document).bind('keydown', 'Ctrl+Right', function(e) {
	if (e.target.tagName.toLowerCase() == 'textarea' ||
		e.target.tagName.toLowerCase() == 'input') {
		return;
	}
	var href = jQuery('ul.yiiSitePager .next a').attr('href');
	if (href)
	{
		document.location = href;
	}
	else
	{
		var href = jQuery('.pagerDiscountBox .pagerDiscountArr .next').attr('href');
		if (href)
		{
			document.location = href;
		}
	}
	e.stopPropagation();
	e.preventDefault();
	return false;
});
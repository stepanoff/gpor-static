$(document).ready(function() {

	var $menu = $('.b-header-menu'),
		$hidemenu = $('.b-header-menu__hidemenu'),
		$current = $('.b-header-menu__item_current'),
		$nowCurrent = false,
		$subCurrent = $('.b-header-menu__hidemenu__item_current');

	$menu.menuAim({
		rowSelector: '> li',
		submenuSelector: '.js-header-menu__sub',
		activate: activateSubmenu,
//		deactivate: deactivateSubmenu,
		exitMenu: exitMenuFunc,
		exitOnMouseOut: false,
		submenuDirection: 'below'
	});



	function activateSubmenu(row) {
		var $row = $(row);
		var e = event;
		var isBrandingPic = $(e.relatedTarget).hasClass('branding-pic') || $(e.relatedTarget).closest('div').hasClass('branding-pic');
		var isNewSubmenu = false;
		if ($nowCurrent) {
			isNewSubmenu = $nowCurrent.find('.b-header-menu__item__link').attr('href') != $row.find('.b-header-menu__item__link').attr('href');
		}

		if ($nowCurrent && (!isBrandingPic || isNewSubmenu))
			$nowCurrent.find('.b-header-menu__item__sub').hide();

		$menu.find('.b-header-menu__item').removeClass('cur');

		$row.addClass('cur');
		$nowCurrent = $row;

		$('.b-header-menu__item__sub').css('left', - $('.js-main-col').offset().left + 'px');

		$('.b-header-menu__item__sub').width($(window).width() + 'px');


		$row.find('.b-header-menu__item__sub').slideDown(150);
	}

	function exitMenuFunc(e) {
		return false;
		var active = $(e).find('.cur');
		if (active.hasClass('b-header-menu__item_hidemenu_yes') || !active.find('.b-header-menu__item__sub').length) {
			return true;
		}
		return false;
	}

	function deactivateSubmenu(row) {
		var e = event;
		var isBrandingPic = $(e.relatedTarget).hasClass('branding-pic') || $(e.relatedTarget).closest('div').hasClass('branding-pic');
		var isMenu = $(e.relatedTarget).closest('.b-header-menu__item').length;
		if (!isBrandingPic && !isMenu ) {
			$menu.find('.b-header-menu__item').removeClass('cur');
			if ($nowCurrent)
				 $nowCurrent.find('.b-header-menu__item__sub').hide();
			$nowCurrent = false;
		};
	}


	function hiliteCurrent(e) {
		var y = e.pageY;
		var offset = $menu.offset();
		if (y < offset.top) {
			deactivateSubmenu($current);
		}
		$current.addClass('b-header-menu__item_current');
	}

	function cancelCurrent() {
		$current.removeClass('b-header-menu__item_current')
	}

	function hiliteSubCurrent() {
		$subCurrent.addClass('b-header-menu__hidemenu__item_current');
	}

	function cancelSubCurrent() {
		$subCurrent.removeClass('b-header-menu__hidemenu__item_current')
	}

	$menu.on('mouseover', cancelCurrent);
	$menu.on('mouseout', hiliteCurrent);

	$hidemenu.on('mouseover', cancelSubCurrent);
	$hidemenu.on('mouseout', hiliteSubCurrent);

	$('.b-header-menu__item__sub').mouseout(function (e) {
		deactivateSubmenu($(this).closest('.b-header-menu__item'));
	});

});

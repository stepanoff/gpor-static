<?php
return array(
	"items" => array(
		array(
			"caption" => "Заголовок",
			"link" => "Ссылка",
			"customHtml" => "Есть ксатомный html-блок в выпадающем меню",
			"linkList" => "Есть список ссылок в выпадающем меню (bool)",
			"links" => array(
				array(
					"col" => "Отступ слева",
					"span" => "Ширина колонки",
					"columnLinks" => array(
						array(
							"link" => "url ссылки",
							"caption" => "Текст ссылки",
						),
					),
				),
			),
		),
	),
	"moreItems" => array(
		array(
			"col" => "Отступ слева",
			"columnLinks" => array(
				array(
					"link" => "url ссылки",
					"caption" => "Текст ссылки",
					"size" => "Размер шрифта (false - дефолтный, l - большой)",
				),
			),
		),
	),
);
?>
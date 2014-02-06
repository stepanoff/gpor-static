var OnlineComments = function () {
	this.params = {
		period:    3000,
		url:       '',
		elem:      '',
		onModified:function (data, x, status) {
		},
		bgPause:   false
	};

	this.interval = null;
	this.lastId = null;
	this.google = null;
	this.msg = 0;

	this.init = function (params) {
		var me = this;
		this.params = $.extend(this.params, params);
		this.google = $(this.params.selector);
		this.google.find('.b-online-translation__descr span').click(function(){me.doUpdate()});
		if (this.params.bgPause) {
			$(window).blur(function () {
				me.pause()
			});
			$(window).focus(function () {
				me.resume()
			});
		}
	};

	this.start = function () {
		var me = this;
		this.interval = setInterval(function () {
			me.doUpdate()
		}, this.params.period);
		$(window).scroll(function(){
			if(me.isVisible()) me.read();
		});
	};

	this.doUpdate = function () {
		var me = this;
		$.ajax({
			url:       this.params.url,
			data:      {
				'id':me.lastId
			},
			type:      'get',
			success:   function (data, status, x) {
				me.google.find('.b-online-translation__ico').fadeOut(500);
				me.google.find('.b-online-translation__descr span').animate({opacity:1},500);

				data = eval('(' + data + ')');
				var lastId = me.lastId;

                var date = new Date();
                //date.setTime(parseInt(comment.time) * 1000);
                var m = date.getMinutes() + "";
                if (m.length < 2) m = "0" + m;
                var time = date.getHours() + ':' + m;
                me.google.find('.b-online-translation__descr span').html('Последнее обновление: <b>' + time + '</b>');

				for (var comment in data) {
					comment = data[data.length - comment - 1];
					var commentId =  parseInt(comment.id);
					if (me.lastId >= commentId)
						continue;

					if (lastId < commentId )
						lastId = commentId;
					me.msg++;
					me.google.find('dl').prepend("<dt style='display:none;' id='oc" + comment.id + "' online='" + comment.id + "'>" +
						time + "<a name='oc" + comment.id + "'></a></dt><dd style='display:none;'>" + comment.text + "</dd>");
					$('#oc'+comment.id).fadeIn(500);
					$('#oc'+comment.id).next().fadeIn(500);
				}
				me.lastId = lastId;

				var notify = "Новое сообщение в трансляции";
				if(me.msg>1) notify = "Новых сообщений в трансляции: "+me.msg;
				me.google.find('' + '.b-online-translation__fixed-plashka span').text(notify);
				if (me.msg > 0 && !me.isVisible()) me.google.find('.b-online-translation__fixed-plashka').show();

				me.google.find('.b-online-translation__fixed-plashka').click(function(){
					me.read()
				});
				me.params.onModified(data, x, status);
			},
			beforeSend:function (x) {
				me.lastId = parseInt(me.google.find('dt:eq(0)').attr('online'));
				me.google.find('.b-online-translation__ico').fadeIn(500);
				me.google.find('.b-online-translation__descr span').animate({opacity:0},500);
				if (!me.lastId) me.lastId = -1;
			},
			cache:     false
		});
	};

	this.isVisible = function(){
		var me = this;

		var head = me.google.find('.b-online-translation-header');
		return (head.offset().top >= window.scrollY && head.offset().top < (window.scrollY + $(window).height()));
	}

	this.read = function(){
		this.msg = 0;
		var me = this;

		me.google.find('.b-online-translation__fixed-plashka').hide();
	}

	this.pause = function () {
		clearInterval(this.interval);
		this.interval = null;
	};

	this.resume = function () {
		if (this.interval != null) return;
		this.start();
	};
};
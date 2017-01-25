$('.poster')
	.on({
		mouseenter: function() {
			$(this).find('.poster-desc').stop().animate({
				'height': '100%'
			}, 200);
		},
		mouseleave: function() {
			$(this).find('.poster-desc').stop().animate({
				'height': 0
			}, 200);
		}
	});

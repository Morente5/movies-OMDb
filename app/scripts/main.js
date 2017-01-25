function getParams() {

	var params = ''

	var title = $('#input-title').val();
	if ( !!title  ) {
		params += 's=' + title + '&';
	}

	switch( $('#input-type').val() ) {
    case '1':
        params += 'type=movie&';
        break;
    case '2':
        params += 'type=series&';
        break;
	}
	
	var year = $('#input-year').val();
	if ( !!year  ) {
		params += 'y=' + year + '&';
	}
	return params;
}

function appendMovie(movie) {
	if (movie.Poster == 'N/A') movie.Poster = 'images/poster.png'
	$('#search-container')
		.append( $('<div>').addClass('poster item-image').attr('id', movie.imdbID)
			.append( $('<img>').addClass('poster-img img-responsive').attr('src', movie.Poster) )
			.append( $('<div>').addClass('poster-desc')
				.append( $('<h2>').text(movie.Title) )
				.append( $('<p>').text(movie.Year) )
			)
		)
}

function reloadEvents() {
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
}

var page = 0;
var pageTotal = 0;
var scrollable = false;

const URL = 'http://www.omdbapi.com/?';
var params = '';

$(document).ajaxStart( () => $('.spinner').show() );
$(document).ajaxStop( () => $('.spinner').hide() );

reloadEvents();

$('#search-btn, #adv-search-btn')
	.click( event => {
		event.preventDefault();
		$('#search-container').empty();

		page = 1;
		params = getParams();

		$.getJSON(URL + params, data => {
			pageTotal = Math.ceil(data.totalResults / 10)
			
			$.each(data.Search, (i, movie) => {
				appendMovie(movie)
			});
			reloadEvents();
			if (page < pageTotal) {
				scrollable = true;
			}
		});
	});


$(window).scroll( () => {
	var targetScroll = $(document).height() - $(window).height();
	if( !!scrollable && $(window).scrollTop() > targetScroll - 50) {
		scrollable = false;

		params = getParams() + 'page=' + ++page;

		$.getJSON(URL + params, data => {
			
			$.each(data.Search, (i, movie) => {
				appendMovie(movie)
			});
			reloadEvents();
			if (page < pageTotal) {
				scrollable = true;
			}
		});
	};
});

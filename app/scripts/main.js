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
			},
			click: function() {
				var id = $(this).attr('id');
				$.getJSON('https://www.omdbapi.com/?i=' + id, data => {
					$('#modal-title, #modal-type, #modal-year, #modal-country, #modal-genre, #modal-director, #modal-writer, #modal-cast, #modal-plot').empty();
					$('#modal-title').text(data.Title);
					$('#modal-type').text(data.Type);
					$('#modal-year').text(data.Year);
					$('#modal-country').text(data.Country);
					$('#modal-genre').text(data.Genre);
					$('#modal-director').text(data.Director);
					$('#modal-writer').text(data.Writer);
					$('#modal-cast').text(data.Cast);
					$('#modal-plot').text(data.Plot);
					$('#modal-link').attr('href', 'https://www.imdb.com/title/' + id)
									.attr('target','_blank');

				})
				.then( () => $('#myModal').modal() );
			}
		});
}

var page = 0;
var pageTotal = 0;
var scrollable = false;

const URL = 'https://www.omdbapi.com/?';
var params = '';

$(document).ajaxStart( () => $('.spinner').show() );
$(document).ajaxStop( () => $('.spinner').hide() );

reloadEvents();

$("#input-title")
	.bind('keypress', event => {
		if (event.keyCode == 13) $("#search-btn").click();  // ENTER key simulates pressing search button
	});

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

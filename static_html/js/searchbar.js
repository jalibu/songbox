let songResults;
typeof $.typeahead === 'function' &&
  $.typeahead({
    input: '.js-typeahead',
    minLength: 2,
    maxItem: 15,
    order: 'asc',
    hint: true,
    dynamic: true,
    display: ['title', 'textSnipped'],
    group: { key: 'category' },
    maxItemPerGroup: 5,
    backdrop: {
      'background-color': '#fff',
    },
    href: '#',
    dropdownFilter: [
      {
        key: 'category',
        template: '<strong>{{category}}</strong>',
        all: 'Alle Lieder',
      },
    ],
    emptyTemplate: function (query) {
      $('#searchResults').hide();
      return 'Kein Ergebnis für "' + query + '"';
    },
    source: {
      ajax: {
        url: '/api/songs/search?q={{query}}&addTextSnipped=true&includeText=true&includeTitle=true',
      },
    },
    template: function (query, item) {
      let result = '<span>';
      result += `<h6 class="searchResultTitle">{{title}} ${
        item.hasChords ? ' <i class="fas fa-guitar"></i>' : ''
      }</h6>`;

      if (item.textSnipped) {
        result +=
          '<span class="searchResultPhrase"> [..] {{textSnipped}} [..]</span>';
      }
      result += '</span>';
      return result;
    },
    callback: {
      onClickAfter: function (node, a, item, event) {
        openModalForSongId(item.id);
      },
      onShowLayout: function (node, query) {
        $('html, body').animate(
          { scrollTop: $('.js-typeahead').offset().top - 60 },
          1000,
        );
      },
      onSubmit: function (node, form, item, event) {
        let searchField = $(node[0]);
        let searchTerm = searchField.val();
        doFullSearch(searchTerm);
        $('#searchResults').show();
        event.preventDefault();
      },
      onCancel: function (node, item, event) {
        $('#searchResults').hide();
        $('html, body').animate({ scrollTop: $('#search').offset().top }, 1000);
      },
      onSearch: function (node, query) {
        $('#searchResults').hide();
      },
    },
  });

$.getJSON('/api/songs', (data) => {
  if (data && data.numberOfSongs) {
    $('#databaseSize').append(
      'Größe der Datenbank: ' + data.numberOfSongs + ' Lieder.',
    );
  }
});

let openModalForSongId = function (songId) {
  $('#songTextPrintBtn').data('song-id', songId);
  $.getJSON('/api/songs/' + songId, function (result) {
    $('#songTextTitle').html(result.title);
    $('#songText').html(result.text);
    $('#modalAlert').hide();
    $('#songTextModal').modal('show');
    $('.js-typeahead').val('');
    if (result.hasChords) {
      $('#songText').addClass('chordline');
    } else {
      $('#songText').removeClass('chordline');
    }
  });
};

let doFullSearch = function (searchTerm) {
  let opts = {
    includeTitle: $('#cbIncludeTitle').prop('checked'),
    includeText: $('#cbIncludeText').prop('checked'),
    chordsOnly: $('#cbChordsOnly').prop('checked'),
  };
  $.getJSON(`/api/songs/search?q=${searchTerm}`, opts, (data) => {
    $('.ibox-content > h5').html(
      data.length +
        ' Treffer für <span class="text-navy">"' +
        searchTerm +
        '"</span>',
    );
    songResults = data;
    renderResults(0);
  });
};

let renderResults = function (start) {
  let resultsPerPage = 10;
  $('#searchResultsContent').html('');
  let lastSong =
    (start + 1) * resultsPerPage <= songResults.length
      ? (start + 1) * resultsPerPage - 1
      : songResults.length - 1;
  for (i = start * resultsPerPage; i <= lastSong; i++) {
    let song = songResults[i];
    let markup = '<div class="hr-line-dashed"></div>';
    markup += '<div class="search-result">';
    markup +=
      '<h6><a class="searchResultPrint" data-song-id="' +
      song.id +
      '" href="#">' +
      song.title +
      '</a></h6>';
    markup += '<p>';
    if (song.category) {
      markup += '<i class="fa fa-tag"></i> ' + song.category + '&nbsp; ';
    }
    if (song.hasChords) {
      markup += '<i class="fas fa-guitar"></i> Akkorde';
    }
    markup += '</p>';
    if (song.textSnipped) {
      markup += '<p>' + song.textSnipped + '</p>';
    }
    if (song.phrase) {
      markup +=
        '<p class="phraseSearchResult"><i class="fa fa-search"></i> Treffer in Liedzeile: [..] ' +
        song.phrase +
        ' [..]</p>';
    }
    markup += '</div>';
    $('#searchResultsContent').append(markup);
  }

  $('.searchResultPrint').click(function (evt) {
    let songId = $(this).data('song-id');
    openModalForSongId(songId);
    evt.preventDefault();
  });

  let pages = Math.ceil(songResults.length / resultsPerPage);
  if (pages > 1) {
    let pagination = '';
    let firstPage;
    let hasMoreFront = false;
    let hasMoreBack = false;
    if (start - 3 > 0) {
      firstPage = start - 3;
      hasMoreFront = true;
    } else {
      firstPage = 0;
    }
    let lastPage;
    if (start + 3 >= pages) {
      lastPage = pages;
    } else {
      lastPage = start + 3;
      hasMoreBack = true;
    }
    if (pages > 2 && start !== 0) {
      pagination +=
        '<li class="page-item"><a data-pagination="' +
        (start - 1) +
        '" class="page-link" href="#">Vor</a></li>';
    }
    if (hasMoreFront) {
      pagination +=
        '<li class="page-item disabled"><a class="page-link" href="#">..</a></li>';
    }
    for (i = firstPage + 1; i <= lastPage; i++) {
      if (i === start + 1) {
        pagination +=
          '<li class="page-item active"><a data-pagination="' +
          (i - 1) +
          '" class="page-link" href="#">' +
          i +
          '</a></li>';
      } else {
        pagination +=
          '<li class="page-item"><a data-pagination="' +
          (i - 1) +
          '" class="page-link" href="#">' +
          i +
          '</a></li>';
      }
    }
    if (hasMoreBack) {
      pagination +=
        '<li class="page-item disabled"><a class="page-link" href="#">..</a></li>';
    }
    if (pages > 2 && start !== pages) {
      pagination +=
        '<li class="page-item"><a data-pagination="' +
        (start + 1) +
        '" class="page-link" href="#">Weiter</a></li>';
    }
    $('.pagination').html(pagination);
    $('html, body').animate(
      { scrollTop: $('.js-typeahead').offset().top - 60 },
      500,
    );
    $('.page-link').click(function (evt) {
      renderResults($(this).data('pagination'));
      evt.preventDefault();
    });
  } else {
    $('.pagination').html('');
  }
};

$(document).ready(function () {
  $('.cb-song-filter').change(function () {
    let term = $('.js-typeahead').val();
    if (term.length > 0) {
      doFullSearch(term);
    }
  });
});

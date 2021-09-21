$.getJSON('faq.json', (data) => {
  $.each(data.faq, (key, val) => {
    let markup = '<div class="card">';
    markup += '<div class="card-header" id=heading"' + key + '">';
    markup += '<h5 class="mb-0">';
    markup +=
      '<button class="btn btn-link" data-toggle="collapse" data-target="#collapse' +
      key +
      '" aria-expanded="true" aria-controls="collapse"' +
      key +
      '>';
    markup += val.q;
    markup += '</button>';
    markup += '</h5>';
    markup += '</div>';
    markup +=
      '<div id="collapse' +
      key +
      '" class="collapse" aria-labelledby="heading' +
      key +
      '" data-parent="#accordion">';
    markup += '<div class="card-body">';
    markup += val.a;
    markup += '</div></div></div>';
    $('#accordion').append(markup);
  });
});

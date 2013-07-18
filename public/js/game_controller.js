$('.artist').on('click', function() {
  name = $(this)[0].innerHTML;
  similar_clicked(name);
});
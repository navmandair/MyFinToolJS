$(function() {
  $("#ticker").autocomplete({
    source: function(request, response) {
      $.ajax({
        url: "/ticker/search",
        dataType: "json",
        data: {
          search_key: request.term
        },
        success: function(data) {
          response(data);
        }
      });
    },
    minLength: 1,
    select: function(event, ui) {
    }
  });
});


$(document).ready(function() {
  var now = new Date();
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear() + "-" + (month) + "-" + (day);
  $('#end_date').val(today);

});
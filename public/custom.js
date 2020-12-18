/*$(function() {
  $("#tickers").autocomplete({
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
});*/

$(document).ready(function() {
  var now = new Date();
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear() + "-" + (month) + "-" + (day);
  $('#end_date').val(today);

});

$(document).ready(function() {

$('#tickers').select2({
  ajax: {
    url: '/ticker/search',

    delay: 500,

    data: function (params) {
      var query = {
        search_key: params.term,
        type: 'public'
      }
      return query;
    },

    processResults: function (arrayData, params) {
      
      var data = $.map(arrayData, function (obj) 
      {
        obj.id = obj.id || obj["1. symbol"]; // replace pk with your identifier
        obj.text = obj.text || obj["2. name"] + ' - ' + obj["1. symbol"];
        return obj;
      });

      return {
        results: data
      };
    }
  }
});

});
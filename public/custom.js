$( function() {
  $( "#ticker" ).autocomplete({
      source: function( request, response ) {
        $.ajax( {
          url: "/ticker/search",
          dataType: "json",
          data: {
            search_key: request.term
          },
          success: function( data ) {
            response( data );
          }
        } );
      },
      minLength: 1,
      select: function( event, ui ) {
      }
    } );
  } );
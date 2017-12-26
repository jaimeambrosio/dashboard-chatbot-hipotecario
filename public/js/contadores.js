$(document).ready(function() {
    var conversacionesMes = "";
    var mensajesMes = "";  
    var conversacionesSemana = "";
    var mensajesSemana = "";  

  $.get( '/getCountConversacionesMonth', function(data) {
      console.log("showing conversations", data);

      conversacionesMes = data[0].count;

      $.get( '/getCountMensajesMonth', function(data) {
      console.log("showing mensajes", data);

      mensajesMes = data[0].count;

      $('#mensajesMonth').append(mensajesMes + ' <i class="glyphicon glyphicon-envelope"></i>');
      $('#conversacionesMonth').append(conversacionesMes + ' <i class="glyphicon glyphicon-comment"></i>');

            
    });
  });

  $.get( '/getCountConversacionesWeek', function(data) {
     

      conversacionesSemana = data[0].count;

      $.get( '/getCountMensajesWeek', function(data) {
      

      mensajesSemana = data[0].count;

      $('#mensajesWeek').append(mensajesSemana + ' <i class="glyphicon glyphicon-envelope"></i>');
      $('#conversacionesWeek').append(conversacionesSemana + ' <i class="glyphicon glyphicon-comment"></i>');

            
    });
  });

});
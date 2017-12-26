$(document).ready(function() {

      $.get( '/getAllMensajesMonth', function(data) {
      
      var datacsv = data;

      var csv = Papa.unparse(datacsv);

      var csv ="\ufeff"+csv;
      var blob = new Blob([csv]);

      $("#descargarMonth").attr("href", window.URL.createObjectURL(blob, {type: "text/plain"}));
      $("#descargarMonth").attr("download", "Reporte-Dashboard-Mensual.csv");                
    });

      $.get( '/getAllMensajesWeek', function(data) {
      
      var datacsv = data;

      var csv = Papa.unparse(datacsv);
      var csv ="\ufeff"+csv;
      var blob = new Blob([csv]);

      $("#descargarWeek").attr("href", window.URL.createObjectURL(blob, {type: "text/plain"}));
      $("#descargarWeek").attr("download", "Reporte-Dashboard-Semanal.csv");                
    });

  });
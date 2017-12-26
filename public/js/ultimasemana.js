
$(document).ready(function() {
      
      var monthNames = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SET", "OCT", "NOV", "DEC"];
      var labelsMensajes = [];
      var cantidadesMensajes = [];  
      var arrayFechas = [];
      var labelsFechas = [];

      $.get( '/getMensajesPorDia', function(data) {
            
            data.forEach(function(item) {
                labelsMensajes.push(item.fecha);
                cantidadesMensajes.push(item.cantidad);
            });

            arrayFechas = labelsMensajes;

            arrayFechas.forEach(function(item) {
                var stringFechaAux = item;
                var index = 12;
                stringFechaAux = stringFechaAux.substr(0, index) + '5' + stringFechaAux.substr(index + 1);
                               
                d= new Date(stringFechaAux);               
                               
                fecha = monthNames[d.getMonth()]+"-"+d.getDate();
                
                labelsFechas.push(fecha);
              });

            var lineData = {
              labels: labelsFechas,
              datasets: [
                  {
                    "data": cantidadesMensajes,
                     "lineTension": 0,
                    "pointHoverRadius": 5,
                    "pointHoverBackgroundColor": "rgba(75,192,192,1)",
                    "pointHoverBorderColor": "rgba(220,220,220,1)",
                    "pointHoverBorderWidth": 2,
                    "pointRadius": 3,
                    "borderCapStyle": 'butt',
                    "backgroundColor": "rgba(220,220,220,0)",
                    "borderColor": "#bd004e",
                    "strokeColor": "#bd004e",
                    "pointColor": "#bd004e",
                    "yAxesGroup": "main",
                    "pointHighlightFill": "#EFFB08",
                    "pointHighlightStroke": "rgba(251,8,239,1)"
                      
                  }]
            };

            var options = {
                responsive: true,
                legend: {
                    display: false,
                    labels: {
                        fontFamily: "omnessemibold",
                        fontColor: '#000'
                    }
                },
                scales: {
                  xAxes: [{
                      ticks: {
                          fontFamily: "omnessemibold",
                      }
                  }],
                  yAxes: [{
                      ticks: {
                          fontFamily: "omnessemibold",
                      }
                  }]
                }
              };

            var ctx = document.getElementById("canvasLine").getContext("2d");

            var myPieChart = new Chart(ctx,{
              type : 'line',
                responsive: false,
                populateSparseData: false,
                animation: false,
                bezierCurve: false,
                datasetFill:false,  
                data : lineData,
                options: options
          }); 

      });
    });

var flagChart = false;
    function cambiarChart(){
      if(flagChart){
        flagChart=false;
        $("#divSemana").css("display", "block");
        $("#divMes").css("display", "none");
        $("#headerChart").html("Última Semana");
        $("#cambiarChart").html("Ver Mensual");
      }else{
        flagChart=true;
        $("#divSemana").css("display", "none");
        $("#divMes").css("display", "block");
        $("#headerChart").html("Últimos Meses");
        $("#cambiarChart").html("Ver Semanal");
      }      
    }


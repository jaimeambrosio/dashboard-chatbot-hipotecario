$(document).ready(function() {
      var labelsPie = [];
      var cantidades = [];  

      $.get( '/getTopProductosCantidad', function(data) {
            
            data.forEach(function(item) {
                labelsPie.push(item.product);
                cantidades.push(item.cantidad);
            });

            var pieData = {
              labels: labelsPie,
              datasets: [
                  {
                      data: cantidades,
                      backgroundColor: [
                          "#FF6384",
                          "#36A2EB",
                          "#FFCE56",
                          "#00FF7F",
                          "#228B22"
                      ],
                      hoverBackgroundColor: [
                          "#FF6384",
                          "#36A2EB",
                          "#FFCE56",
                          "#00FF7F",
                          "#228B22"
                      ]
                  }]
            };

            var options = {
                responsive: true,
                legend: {
                    display: true,
                    labels: {
                        fontFamily: "omnessemibold",
                        fontColor: '#000'
                    }
                }
              };

            var ctx = document.getElementById("canvaspie").getContext("2d");

            var myPieChart = new Chart(ctx,{
              type: 'pie',
              data: pieData,
              options: options
          }); 

      });
    });

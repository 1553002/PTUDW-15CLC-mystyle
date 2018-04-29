var ctx = document.getElementById("myPieChart");
      var myPieChart = new Chart(ctx, {
      type: 'pie',
      data: {
      labels: ["Quý I", "Quý II", "Quý III", "Quý IV"],
      datasets: [{
      data: [12.21, 15.58, 11.25, 8.32],
      backgroundColor: ['#007bff', '#dc3545', '#ffc107', '#28a745'],
      }],
    },
});

var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
      data: [15339, 21345, 18483, 24003, 23489, 24092, 12034, 21345, 18483, 24003, 23489, 33019],
      lineTension: 0,
      backgroundColor: 'transparent',
      borderColor: '#007bff',
      borderWidth: 4,
      pointBackgroundColor: '#007bff'
    }]
  },
  options: {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: false
        }
      }]
    },
    legend: {
      display: false,
    }
  }
});

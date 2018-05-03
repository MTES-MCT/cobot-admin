import { Line } from 'vue-chartjs';

export default {
  extends: Line,
  props: ['datas'],
  mounted() {
    this.renderChart(
      {
        labels: this.datas.data.labels,
        datasets: [
          {
            data: this.datas.data.datasets[0].data,
            backgroundColor: [
              'rgba(71, 183,132,.5)', // Green
            ],
            fill: false,
            borderColor: [
              '#47b784',
            ],
            borderWidth: 3,
          },
        ],
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        linetension: 1,
        legend: {
          display: false,
        },
        title: {
          display: true,
          fontSize: 18,
          fontColor: '#000',
          text: 'Evolution des contributions',
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              padding: 25,
            },
          }],
        },
      },
    );
  },
};

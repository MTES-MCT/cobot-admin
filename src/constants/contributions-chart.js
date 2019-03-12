import { Line } from 'vue-chartjs';

export default {
  extends: Line,
  props: ['datas'],
  mounted() {
    this.createGraph();
  },
  methods: {
    createGraph() {
      this.renderChart(
        {
          labels: this.datas.data.labels,
          datasets: [
            {
              data: this.datas.data.datasets[0].data,
              backgroundColor: [
                '#FFF',
              ],
              fill: false,
              borderColor: [
                '#D63764',
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
  },
};

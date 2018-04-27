<template>
  <div class="main-card row justify-center">
    <div style="text-align: center">
      <h2>Opensolar Map</h2>
    </div>
    <div>
      <q-card class="q-ma-sm" inline style="width: 250px;" color="neutral">
        <q-card-main>
          <q-card-title>
            <strong>PHOTOS</strong>
          </q-card-title>
          <div class="row justify-center">
            <div class="picto">
              <q-icon name="collections" color="primary"/>
            </div>
            <div class="mention">
              <h4>815</h4>
            </div>
          </div>
        </q-card-main>
        <q-card-actions class="row justify-end actions">
          <q-btn flat size="sm"
                  align="right"
                  icon-right="arrow_forward"
                  label="Gérer ma collection"/>
        </q-card-actions>
      </q-card>

      <q-card class="q-ma-sm" inline style="width: 250px;" color="neutral">
        <q-card-main>
          <q-card-title>
            <strong>CONTRIBUTIONS</strong>
          </q-card-title>
          <div class="row justify-center">
            <div class="picto">
              <q-icon name="public" color="warning"/>
            </div>
            <div class="mention">
              <h4>1315</h4>
            </div>
          </div>
        </q-card-main>
        <q-card-actions class="row justify-end actions">
          <q-btn flat size="sm"
                  align="right"
                  icon-right="arrow_forward"
                  label="accèder au détail"/>
        </q-card-actions>
      </q-card>

      <q-card class="q-ma-sm" inline style="width: 250px;" color="neutral">
        <q-card-main>
          <q-card-title>
            <strong>ACHEVEMENT</strong>
          </q-card-title>
          <div class="row justify-center">
            <div class="picto">
              <q-icon name="track_changes" color="info"/>
            </div>
            <div class="mention">
              <h4>30%</h4>
            </div>
          </div>
        </q-card-main>
        <q-card-actions class="row justify-end actions">
          <q-btn flat size="sm"
                  align="right"
                  icon-right="arrow_forward"
                  label="accèder au détail"/>
        </q-card-actions>
      </q-card>
    </div>

    <canvas id="contribution-chart" class="chart"></canvas>

  </div>
</template>

<style>
</style>

<script>
import Chart from 'chart.js';
import { planetChartData } from '../constants/data-chart.js';

export default {
  name: 'DashboardIndex',
  data: () => ({
    datacollection: {
      labels: ['January', 'February'],
      datasets: [
        {
          label: 'Data One',
          backgroundColor: '#f87979',
          data: [40, 20],
        },
      ],
    },
  }),
  mounted() {
    this.createChart('contribution-chart', planetChartData);
  },
  methods: {
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId);
      return new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      });
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .main-card
    border-radius 2px
    width 65vw
    max-width 1200px
  .chart
    background-color $neutral
    margin-top 20px
    width 100%
    box-shadow 0 1px 5px rgba(0,0,0,0.2),
    0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
  .q-card
    color #000 !important
    .q-card-container
      padding 5px
    .picto
      font-size 48px
    .mention
      h4
        padding-top 10px
        padding-left 10px
        -webkit-margin-before 0
        -webkit-margin-after 0
      p
        margin-bottom 0
    .actions
       margin-top: 10px;
       border-top: 1px solid #EEE;
  .bg-neutral
      background-color $neutral
</style>

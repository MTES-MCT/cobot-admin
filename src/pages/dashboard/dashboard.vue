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
              <h4>{{ statistics.datas }}</h4>
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
              <h4>{{ statistics.contributions }}</h4>
            </div>
          </div>
        </q-card-main>
        <q-card-actions class="row justify-end actions">
          <q-btn flat size="sm"
                  align="right"
                  icon-right="arrow_forward"
                  @click="goTo('dashboard.contributions', '1234-5678-9101')"
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
              <h4>{{ statistics.achievement }}%</h4>
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
    <div class="Chart">
      <contributions-chart-data v-if="chart.data.labels.length > 0"
                                :datas="chart"></contributions-chart-data>
    </div>
  </div>
</template>

<script>
import { DATASET_STATS_QUERY } from '../../constants/graphql';
import _ from 'lodash';
import contributionsChartData from '../../constants/contributions-chart.js';

export default {
  name: 'DashboardIndex',
  components: {
    contributionsChartData,
  },
  data: () => ({
    chart: {
      data: {
        labels: [],
        datasets: [{
          data: [],
        }],
      },
    },
    statistics: {
      datas: 0,
      contributions: 0,
      achievement: 0,
    },
  }),
  methods: {
    goTo(to, id) {
      this.$router.push({ name: to, params: { id } });
    },
  },
  apollo: {
    statistics: {
      query: DATASET_STATS_QUERY,
      variables: {
        source: 'opensolarmap',
      },
      pollInterval: 5000,
      update(data) {
        const graphX = _.map(data.DataSetStats.contributionsGraph, 'createdAt');
        const graphY = _.map(data.DataSetStats.contributionsGraph, 'numAnswers');
        this.chart.data.labels = graphX;
        this.chart.data.datasets[0].data = graphY;
        return data.DataSetStats;
      },
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
  .Chart
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

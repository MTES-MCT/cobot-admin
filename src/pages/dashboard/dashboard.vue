<template>
  <div class="main-card row justify-center">
    <div style="text-align: center">
      <h2>{{ projectName }}</h2>
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
                  @click="goTo('dashboard.contributions', $route.params.name)"
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
import { clone } from 'quasar';
import moment from 'moment';
import _ from 'lodash';
import { DATASET_STATS_QUERY, DATASET_STATS_SUB } from '../../constants/graphql';
import contributionsChartData from '../../constants/contributions-chart.js';

export default {
  name: 'DashboardIndex',
  components: {
    contributionsChartData,
  },
  data() {
    return {
      project: this.$route.params.name,
      projectName: this.$localStorage.get('projectName'),
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
    };
  },
  methods: {
    goTo(to, id) {
      this.$router.push({ name: to, params: { id } });
    },
  },
  apollo: {
    gqlStatistics: {
      query: DATASET_STATS_QUERY,
      subscribeToMore: {
        document: DATASET_STATS_SUB,
        variables() {
          return {
            source: this.project,
          };
        },
        updateQuery(data, { subscriptionData }) {
          this.statistics = clone(data.DataSetStats);
          this.statistics.contributions += 1;
          const graphX = _.map(data.DataSetStats.contributionsGraph, 'createdAt');
          const graphY = _.map(data.DataSetStats.contributionsGraph, 'numAnswers');
          if (graphX[graphX.length - 1] !== moment(subscriptionData.data.createdAt).format('YYYY-MM-DD')) {
            graphX.push(moment(subscriptionData.data.createdAt).format('YYYY-MM-DD'));
            graphY.push(1);
          } else {
            graphY[graphY.length - 1] = parseInt(graphY[graphY.length - 1], 10) + 1;
          }
          this.chart.data.labels = graphX;
          this.chart.data.datasets[0].data = graphY;
          return data;
        },
      },
      variables() {
        return {
          source: this.project,
        };
      },
      update(data) {
        const graphX = _.map(data.DataSetStats.contributionsGraph, 'createdAt');
        const graphY = _.map(data.DataSetStats.contributionsGraph, 'numAnswers');
        this.chart.data.labels = graphX;
        this.chart.data.datasets[0].data = graphY;
        this.statistics = {
          achievement: data.DataSetStats.achievement,
          contributions: data.DataSetStats.contributions,
          datas: data.DataSetStats.datas,
        };
        return data.DataSetStats;
      },
    },
  },
};
</script>

<style scopped lang="stylus">
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

<template>
  <div>
    <cc-subheader-dashboard />
    <div class="row main">
      <div class="col-3">
        <cc-left-panel-dashboard />
      </div>
      <div class="col-9">
        <div class="main-card row justify-center">
          <div class="row justify-center">
            <div v-if="$auth.check([80, 100])"
                class="col-md-6 col-sm-12"
                style="text-align: center;">
              <q-card class="q-ma-sm" inline style="width: 250px;" color="neutral">
                <q-card-main>
                  <q-card-title>
                    <strong>CONTRIBUTEURS</strong>
                  </q-card-title>
                  <div class="row justify-center">
                    <div class="picto">
                      <q-icon name="supervised_user_circle" color="pink"/>
                    </div>
                    <div class="mention">
                      <h4>{{ statistics.contributors }}</h4>
                    </div>
                  </div>
                </q-card-main>
                <q-card-actions class="row justify-end actions">
                  <q-btn  @click="goTo('dashboard.contributors', $route.params.id)"
                          flat size="sm"
                          align="right"
                          icon-right="arrow_forward"
                          label="Gérer mes contributeurs"/>
                </q-card-actions>
              </q-card>
            </div>
            <div v-if="$auth.check([80, 100])"
                class="col-md-6 col-sm-12"
                style="text-align: center;">
              <q-card class="q-ma-sm" inline style="width: 250px;" color="neutral">
                <q-card-main>
                  <q-card-title>
                    <strong>PHOTOS</strong>
                  </q-card-title>
                  <div class="row justify-center">
                    <div class="picto">
                      <q-icon name="collections" color="pink"/>
                    </div>
                    <div class="mention">
                      <h4>{{ statistics.datas }}</h4>
                    </div>
                  </div>
                </q-card-main>
                <q-card-actions class="row justify-end actions">
                  <q-btn  @click="goTo('dashboard.dataset', $route.params.id)"
                          flat size="sm"
                          align="right"
                          icon-right="arrow_forward"
                          label="Gérer ma collection"/>
                </q-card-actions>
              </q-card>
            </div>
            <div class="col-md-6 col-sm-12" style="text-align: center;">
              <q-card class="q-ma-sm" inline style="width: 250px;" color="neutral">
                <q-card-main>
                  <q-card-title>
                    <strong>CONTRIBUTIONS</strong>
                  </q-card-title>
                  <div class="row justify-center">
                    <div class="picto">
                      <q-icon name="public" color="pink"/>
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
                          @click="goTo('dashboard.contribute.object', $route.params.id)"
                          label="accèder au détail"/>
                </q-card-actions>
              </q-card>
            </div>
            <div class="col-md-6 col-sm-12" style="text-align: center;">
              <q-card class="q-ma-sm" inline style="width: 250px;" color="neutral">
                <q-card-main>
                  <q-card-title>
                    <strong>ACHEVEMENT</strong>
                  </q-card-title>
                  <div class="row justify-center">
                    <div class="picto">
                      <q-icon name="track_changes" color="pink"/>
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
          </div>
          <div class="Chart">
            <contributions-chart-data v-if="chart.data.labels.length > 0"
                                      ref="chart"
                                      :datas="chart"></contributions-chart-data>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';
import { DATASET_STATS_QUERY, DATASET_STATS_SUB } from '../../constants/graphql';
import contributionsChartData from '../../constants/contributions-chart.js';

import CcLeftPanelDashboard from 'components/cc-left-panel-dashboard';
import CcSubheaderDashboard from 'components/cc-subheader-dashboard';

export default {
  name: 'DashboardIndex',
  components: {
    contributionsChartData,
    CcLeftPanelDashboard,
    CcSubheaderDashboard,
  },
  data() {
    return {
      projectId: this.$route.params.id,
      projectName: null,
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
  mounted() {
    if (this.projectId) {
      this.$router.push({ name: 'dashboard', params: { id: this.projectId } });
    } else {
      const lastProjectOpened = JSON.parse(this.$localStorage.get('project'));
      if (lastProjectOpened) {
        this.$router.push({ name: 'dashboard', params: { id: lastProjectOpened.id } });
      } else {
        this.$localStorage.remove('projects');
        this.$auth.logout({
          makeRequest: false,
          redirect: '/auth/login',
        });
      }
    }
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
            id: this.projectId,
          };
        },
        updateQuery(data, { subscriptionData }) {
          if (data.DataSetStats && data.DataSetStats.contributionsGraph.length > 0) {
            this.statistics.contributions += 1;
            const graphX = _.map(data.DataSetStats.contributionsGraph, 'createdAt');
            const graphY = _.map(data.DataSetStats.contributionsGraph, 'numAnswers');
            if (graphX[graphX.length - 1] !== moment(subscriptionData.data.createdAt).format('YYYY-MM-DD')) {
              graphX.push(moment(subscriptionData.data.createdAt).format('YYYY-MM-DD'));
              graphY.push(1);
            } else {
              const val = parseInt(graphY[graphY.length - 1], 10) + 1;
              graphY[graphY.length - 1] = val.toString();
            }
            this.chart.data.labels = graphX;
            this.chart.data.datasets[0].data = graphY;
            this.$refs.chart.createGraph();
            return data;
          }
          return [];
        },
      },
      variables() {
        return {
          id: this.projectId,
        };
      },
      update(data) {
        this.statistics = {
          achievement: data.DataSetStats.achievement,
          contributors: data.DataSetStats.contributors,
          contributions: data.DataSetStats.contributions,
          datas: data.DataSetStats.datas,
        };
        if (data.DataSetStats && data.DataSetStats.contributionsGraph) {
          const graphX = _.map(data.DataSetStats.contributionsGraph, 'createdAt');
          const graphY = _.map(data.DataSetStats.contributionsGraph, 'numAnswers');
          this.chart.data.labels = graphX;
          this.chart.data.datasets[0].data = graphY;
          return data.DataSetStats;
        }
        return [];
      },
    },
  },
};
</script>

<style scopped lang="stylus">
  @import '~variables'
  .main-card
    border-radius 2px
    width 100%
    margin 20px 0px 40px 0px
    padding 0px 20px 00px 20px
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

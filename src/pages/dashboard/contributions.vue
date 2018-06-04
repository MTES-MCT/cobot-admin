<template>
  <div class="main-card row justify-center">
    <div style="text-align: center">
      <h2>Contribution - {{ projectName }}</h2>
    </div>
    <div class="row no-wrap">
      <div class="col bg-white">
        <cc-contributions-table
          style=""
          v-if="dataset.length > 0"
          :config="tableConfig"
          :columns="columns"
          :datas="dataset"
          :actions="[]"
          :filter="filter"/>
      </div>
    </div>
  </div>
</template>

<script>
import { clone } from 'quasar';
import CcContributionsTable from 'components/cc-contributions-table';
import { DATASET_QUERY } from '../../constants/graphql';

export default {
  name: 'DashboardIndex',
  components: {
    CcContributionsTable,
  },
  data() {
    return {
      dataset: [],
      project: this.$route.params.name,
      projectName: this.$localStorage.get('projectName'),
      tableConfig: {
        title: this.$t('contributions.title'),
        columnPicker: false,
        pagination: {
          sortBy: null,
          descending: false,
          page: 1,
          rowsPerPage: 15,
        },
        rowHeight: 50,
      },
      columns: [
        {
          name: 'fileName',
          required: true,
          label: this.$t('contributions.file'),
          align: 'left',
          field: 'file',
          sortable: true,
        },
        {
          name: 'file',
          required: true,
          label: this.$t('contributions.image'),
          align: 'left',
          field: 'file',
          sortable: true,
        },
        {
          name: 'map',
          required: true,
          label: this.$t('contributions.map'),
          align: 'left',
          field: 'metadata',
          sortable: true,
        },
        {
          name: 'numAnswers',
          label: this.$t('contributions.numUserAnswers'),
          field: 'numAnswers',
          align: 'left',
          sortable: true,
        },
        {
          name: 'userAnswers',
          label: this.$t('contributions.userAnswers'),
          field: 'usersAnswers',
          align: 'left',
          sortable: true,
        },
        {
          name: 'action',
          align: 'right',
          filter: false,
          sort: false,
        },
      ],
      filter: '',
    };
  },
  mounted() {
  },
  methods: {
  },
  apollo: {
    dataset: {
      query: DATASET_QUERY,
      variables() {
        return {
          source: this.project,
        };
      },
      update(data) {
        return clone(data.DataSetBySource);
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

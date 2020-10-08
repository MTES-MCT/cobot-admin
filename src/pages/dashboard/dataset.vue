<template>
  <div>
    <cc-subheader-dataset :numItem="datasetNum"/>
    <div class="row main" v-if="dataset">
      <div class="col-3">
        <cc-left-panel-dataset />
      </div>
      <div class="col-9">
        <div v-if="$auth.check([80, 100])"
            class="main-card dataset">
          <div class="col-md-6 col-sm-12" style="text-align: center;">
            <div v-masonry
                 transition-duration='0.3s'
                 item-selector='.grid-item'
                 column-width='.grid-sizer'
                 percent-position='true'>
              <div v-for="data in dataset"
                  :key="data._id"
                  fit-width="true"
                  v-masonry-tile
                  class="grid-item">
                <div class="grid-sizer"></div>
                <div @click="onSelect(data)"
                     :class="{ 'active': data.isActive, 'hasNone': data.hasNone }"
                     style="padding-bottom: 10px;">
                  <img :src="setImgUrl(data.file)" style="width: 98%">
                  <p>{{ data.file }}</p>
                  <div v-if="data.numAnswers > 0" style="width: 100%; text-align: center">
                    <q-chip v-for="(answer, answerIndex) in data.groupedAnswers"
                            :key="answerIndex"
                            @click="onPreview(data)"
                            style="margin-bottom: 5px;"
                            color="dark">{{ answerIndex }} ({{ answer.length }})</q-chip>
                  </div>
                  <div v-else style="width: 100%; text-align: center;">
                    <p>aucune contribution</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-sm-12" style="text-align: center;">
            <paginate v-if="datasetNumPage > 1"
              :page-count="datasetNumPage"
              :prev-text="'précédent'"
              :next-text="'suivant'"
              :container-class="'pagination'"
              :click-handler="onChangePage">
            </paginate>
          </div>
        </div>
      </div>
      <q-modal v-model="openPreview"
               class="modalPreview">
        <q-modal-layout>
          <q-toolbar color="dark" slot="header">
            <q-toolbar-title>
            Prévisualisation
            </q-toolbar-title>
          </q-toolbar>
          <div class="layout-padding">
            <cc-label-map v-if="previewData"
                          :projectId="projectId"
                          :data="previewData"></cc-label-map>
          </div>
        </q-modal-layout>
      </q-modal>
    </div>
  </div>
</template>

<script>
// import _ from 'lodash';
import { mapState, mapGetters } from 'vuex';
import { DATASET_BY_SOURCE_QUERY, DATASET_COUNT_BY_SOURCE } from '../../constants/graphql';

import CcLeftPanelDataset from 'components/cc-left-panel-dataset';
import CcSubheaderDataset from 'components/cc-subheader-dataset';
import CcLabelMap from 'components/cc-label-map';

export default {
  name: 'Dataset',
  components: {
    CcLeftPanelDataset,
    CcSubheaderDataset,
    CcLabelMap,
  },
  computed: {
    ...mapGetters({
      dataset: 'dataset/getDataset',
    }),
    ...mapState('dataset', ['pagerOffset', 'refresh']),
  },
  watch: {
    refresh(newVal) {
      if (newVal) {
        this.skipDatasetQuery = false;
      }
    },
  },
  data() {
    return {
      projectId: this.$route.params.id,
      datasetNum: 0,
      datasetNumPage: 0,
      pager: null,
      pagerLimit: 20,
      data: null,
      skipDatasetQuery: false,
      previewData: null,
      openPreview: false,
    };
  },
  mounted() {
    this.$root.$on('update:imported', () => {
      if (this.$apollo.queries.Dataset) {
        this.$apollo.queries.Dataset.refresh();
      }
    });
  },
  methods: {
    setImgUrl(file) {
      return `${process.env.API_URL}/img/${this.projectId}/${file}`;
    },
    onPreview(data) {
      this.previewData = data;
      this.openPreview = true;
    },
    onSelect(data) {
      this.$store.dispatch('dataset/setData', data);
    },
    onChangePage(page) {
      this.$store.commit('dataset/SET_PAGER_OFFSET', page - 1);
      this.setPage();
    },
    setPage() {
      this.$apollo.queries.Dataset.fetchMore({
        variables: {
          id: this.projectId,
          offset: this.pagerLimit * this.pagerOffset,
          limit: this.pagerLimit,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          this.$store.dispatch('dataset/setData', fetchMoreResult.DataSetBySource);
          this.$store.dispatch('dataset/setDataset', fetchMoreResult.DataSetBySource);
        },
      });
    },
  },
  apollo: {
    Dataset: {
      query: DATASET_BY_SOURCE_QUERY,
      fetchPolicy: 'no-cache',
      variables() {
        return {
          id: this.projectId,
          offset: 0,
          limit: 20,
        };
      },
      update(data) {
        if (data.DataSetBySource.length > 0) {
          this.$store.dispatch('dataset/setData', data.DataSetBySource[0]);
          this.$store.dispatch('dataset/setDataset', data.DataSetBySource);
          this.$store.commit('dataset/SET_REFRESH', false);
        } else {
          // this.datasetNum = 0;
          this.$store.dispatch('dataset/setDataset', null);
        }
      },
    },
    DatasetCount: {
      query: DATASET_COUNT_BY_SOURCE,
      fetchPolicy: 'no-cache',
      variables() {
        return {
          projectId: this.projectId,
        };
      },
      update(data) {
        if (data.CountDataSetBySource > 0) {
          this.datasetNum = data.CountDataSetBySource;
          this.datasetNumPage = Math.ceil(this.datasetNum / this.pagerLimit);
        }
      },
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .pagination {
    display: inline-block;
    padding-left: 0;
    margin: 20px 0;
    border-radius: 4px;
  }
  .pagination > li {
    display: inline;
  }
  .pagination > li > a,
  .pagination > li > span {
    position: relative;
    float: left;
    padding: 6px 12px;
    margin-left: -1px;
    margin-right: 10px;
    line-height: 1.42857143;
    color: $pink;
    border-radius: 25px;
    text-decoration: none;
    background-color: #fff;
    border: 1px solid $pink;
  }
  .main-card
    border-radius 2px
    width 100%
    margin 20px 0px 40px 0px
    padding 0px 20px 00px 20px
  .modalPreview
    .modal-content
      max-height 85vh
    .layout-padding
      padding-top 10px
  .dataset
   .grid-sizer,
    .grid-item
      width 25%
      .active
        border solid 5px $pink
      .hasNone
        opacity 0.5
</style>

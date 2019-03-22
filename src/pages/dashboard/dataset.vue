<template>
  <div>
    <cc-subheader-dataset v-if="dataset" :numItem="dataset.length"/>
    <div class="row main">
      <div class="col-3">
        <cc-left-panel-dataset />
      </div>
      <div class="col-9">
        <div v-if="$auth.check([80, 100]) && dataset"
            class="main-card dataset">
          <div class="col-md-6 col-sm-12" style="text-align: center;">
            <q-card v-for="data in dataset"
                    :key="data._id"
                    @click.native="onSelect(data)"
                    :class="{ 'active': data.isActive, 'hasNone': data.hasNone }"
                    class="q-ma-sm"
                    inline>
              <q-card-media>
                <img :src="setImgUrl(data.file)" style="width: 300px">
              </q-card-media>
              <q-card-main>
                <p>{{ data.file }}</p>
              </q-card-main>
              <q-card-actions>
                <div v-if="data.numAnswers > 0" style="width: 100%; text-align: center">
                  <q-chip v-for="(answer, answerIndex) in groupAnswers(data.usersAnswers)"
                          :key="answerIndex"
                          @click="onPreview(data)"
                          color="dark">{{ answerIndex }} ({{ answer.length }})</q-chip>
                </div>
                <div v-else style="width: 100%; text-align: center;">
                  <p>aucune contribution</p>
                </div>
              </q-card-actions>
            </q-card>
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
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { DATASET_BY_SOURCE_QUERY } from '../../constants/graphql';

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
  },
  data() {
    return {
      projectId: this.$route.params.id,
      data: null,
      skipDatasetQuery: false,
      previewData: null,
      openPreview: false,
    };
  },
  mounted() {
    this.$root.$on('update:imported', () => {
      this.skipDatasetQuery = false;
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
    groupAnswers(usersAnswers) {
      const groupedAnswers = _.groupBy(usersAnswers, (answer) => {
        if (answer.answers.label.id) {
          return answer.answers.label.label;
        }
        return answer.answers.label;
      });
      return groupedAnswers;
    },
  },
  apollo: {
    Dataset: {
      query: DATASET_BY_SOURCE_QUERY,
      fetchPolicy: 'no-cache',
      variables() {
        return {
          id: this.projectId,
        };
      },
      update(data) {
        const dataset = data.DataSetBySource.reverse();
        this.$store.dispatch('dataset/setData', dataset[0]);
        this.$store.dispatch('dataset/setDataset', dataset);
        this.skipDatasetQuery = true;
      },
      skip() {
        return this.skipDatasetQuery;
      },
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
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
    .active
      border solid 5px $pink
    .hasNone
      opacity 0.5
    .q-card
      width 300px
      height 400px
      &:hover
        cursor pointer
      .q-card-main
        text-align left
        p
          white-space nowrap
          overflow hidden
          text-overflow ellipsis
      .q-card-actions
        .q-chip
          margin-top 10px
          margin-left 5px
</style>

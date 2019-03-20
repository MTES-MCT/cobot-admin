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
                    :class="{ 'active': data.isActive }"
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
                  <q-chip v-for="(answer, index) in groupAnswers(data._id, data.usersAnswers)"
                          :key="index"
                          color="dark">{{ index }} ({{ answer.length }})</q-chip>
                </div>
                <div v-else style="width: 100%; text-align: center;">
                  <p>aucune contribution</p>
                </div>
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { DATASET_BY_SOURCE_QUERY } from '../../constants/graphql';

import CcLeftPanelDataset from 'components/cc-left-panel-dataset';
import CcSubheaderDataset from 'components/cc-subheader-dataset';

export default {
  name: 'Dataset',
  components: {
    CcLeftPanelDataset,
    CcSubheaderDataset,
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
    };
  },
  watch: {
    dataset(newVal) {
      console.log(newVal);
    },
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
    onSelect(data) {
      this.$store.dispatch('dataset/setData', data);
      this.$apollo.queries.Dataset.refresh();
    },
    groupAnswers(id, answers) {
      const groupedAnswers = _.groupBy(answers, (answer) => {
        if (answer.label.id) {
          return answer.label.label;
        }
        return answer.label;
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
  .dataset
    .active
      border solid 5px $pink
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

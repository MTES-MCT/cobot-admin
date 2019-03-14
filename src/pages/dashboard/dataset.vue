<template>
  <div>
    <cc-subheader-dataset />
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
                <p class="text-faded"><q-icon name="place" />
                  {{ data.numAnswers }} contributions
                </p>
              </q-card-main>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash';
import { DATASET_BY_SOURCE_QUERY } from '../../constants/graphql';

import CcLeftPanelDataset from 'components/cc-left-panel-dataset';
import CcSubheaderDataset from 'components/cc-subheader-dataset';

export default {
  name: 'Dataset',
  components: {
    CcLeftPanelDataset,
    CcSubheaderDataset,
  },
  data() {
    return {
      projectId: this.$route.params.id,
      dataset: null,
      selectedDataIndex: '0',
      selectedData: null,
    };
  },
  methods: {
    setImgUrl(file) {
      return `${process.env.API_URL}/img/${this.projectId}/${file}`;
    },
    onSelect(data) {
      this.$store.dispatch('dataset/setData', data);
      this.setActive(data);
    },
    setActive(data) {
      this.dataset[this.selectedDataIndex].isActive = false;
      this.selectedDataIndex = _.findKey(this.dataset, { _id: data._id });
      this.dataset[this.selectedDataIndex].isActive = true;
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
        const dataset = data.DataSetBySource;
        _.each(dataset, (d) => {
          d.isActive = false;
        });
        this.dataset = dataset;
        this.$store.dispatch('dataset/setData', this.dataset[0]);
        this.setActive(this.dataset[0]);
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
      &:hover
        cursor pointer
      .q-card-main
        text-align left
        p
          white-space nowrap
          overflow hidden
          text-overflow ellipsis
</style>

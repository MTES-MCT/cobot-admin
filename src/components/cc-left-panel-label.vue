<template>
  <q-list v-if="dataset" highlight style="position: fixed; width:25%; height: 100vh;">
    <q-list-header>
      <div class="row justify-around tabs">
        <div class="active">
          <a href="">à qualifier</a>
        </div>
        <div>
          <a href="">mes contributions</a>
        </div>
      </div>
    </q-list-header>
    <q-item v-if="toContribe.length === 0">
      <q-item-main label="Merci ! Vous avez qualifié l'ensemble de nos données." />
    </q-item>
    <div style="height: calc(100vh - 217px); overflow-y: auto;">
      <q-item v-for="data in toContribe"
              :key="data._id"
              @click.native="contribute(data._id)"
              class="item"
              :class="{'itemActive': data.isActive}">
        <q-item-side>
          <q-item-tile class="image">
            <img :src="setImg(data.file)">
          </q-item-tile>
        </q-item-side>
        <q-item-main :label="data.file"
                     :sublabel="`${data.numAnswers} contributions`" />
      </q-item>
    </div>
    <!-- <q-list-header>Contribuées</q-list-header>
    <q-item v-for="data in contributed"
            :key="data._id">>
        <q-item-side>
          <q-item-tile class="image">
            <img :src="setImg(data.file)">
          </q-item-tile>
        </q-item-side>
        <q-item-main :label="data.file"
                    :sublabel="`${data.numAnswers} contributions`" />
    </q-item> -->
  </q-list>
</template>

<script>
import _ from 'lodash';
import { DATASET_BY_SOURCE_QUERY } from '../constants/graphql';

export default {
  name: 'CcLeftPanel',
  data() {
    return {
      projectId: this.$route.params.id,
      datasetId: this.$route.params.dataset,
      currentIndex: null,
      dataset: null,
      toContribe: null,
      contributed: null,
    };
  },
  watch: {
    $route(to) {
      this.datasetId = to.params.dataset;
      this.$apollo.queries.Dataset.refresh();
    },
  },
  created() {
    this.$root.$on('projectChanged', (project) => {
      this.projectId = project.id;
      setTimeout(() => {
        this.$apollo.queries.Dataset.refresh();
      }, 300);
    });
  },
  methods: {
    setImg(img) {
      return `${process.env.API_URL}/img/${this.projectId}/${img}`;
    },
    contribute(datasetId) {
      this.$router.push(`/dashboard/contribute/object/${this.projectId}/${datasetId}`);
    },
    setActive() {
      if (this.currentIndex) {
        this.toContribe[this.currentIndex].isActive = false;
      }
      this.currentIndex = _.findKey(this.toContribe, { _id: this.datasetId });
      this.toContribe[this.currentIndex].isActive = true;
    },
  },
  apollo: {
    Dataset: {
      query: DATASET_BY_SOURCE_QUERY,
      variables() {
        return {
          id: this.projectId,
        };
      },
      update(datas) {
        const toContribe = [];
        const contributed = [];
        _.each(datas.DataSetBySource, (data) => {
          if (data.usersAnswers.length > 0) {
            const hasAnswered = _.filter(
              data.usersAnswers,
              (answer => answer.userId === this.$auth.user().id),
            );
            if (hasAnswered.length > 0) {
              contributed.push(data);
            } else {
              toContribe.push(data);
            }
          } else {
            toContribe.push(data);
          }
        });
        this.contributed = contributed;
        this.toContribe = toContribe;
        this.dataset = datas.DataSetBySource;
        this.setActive();
      },
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  // .q-list
  //   box-shadow 0px 0px 5px 0px rgba(0,0,0,0.75)
  .q-list-header
    height 60px
    margin-bottom 10px
    border-bottom 1px solid #e0e0e0
  .item
    cursor pointer
  .tabs
    margin-top 7px
  a
    position relative
    font-weight bold
    color $tertiary
    text-decoration none
    &:visited
      text-decoration none
    &:before
      content ""
      position absolute
      width 100%
      height 4px
      bottom -20px
      left 0;
      background-color $primary
      visibility hidden
      -webkit-transform scaleX(0)
      transform scaleX(0)
      -webkit-transition all 0.3s ease-in-out 0s
      transition all 0.3s ease-in-out 0s
  .itemActive
    background-color $pink
    color white
    font-weight bold
    .q-item-sublabel
      font-weight normal
      color white
  .active
    a
     &:before
      visibility visible
      -webkit-transform scaleX(1)
      transform scaleX(1)
  a
    &:hover:before
      visibility visible
      -webkit-transform scaleX(1)
      transform scaleX(1)
  .image
    img
      width 100px
</style>

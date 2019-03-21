<template>
  <q-list v-if="datasetTodo" style="position: fixed; width:25%; height: 100vh;">
    <q-list-header>
      <div class="row justify-around tabs">
        <div :class="{'active': filter === 'toContribute'}">
          <a @click="setFilter('toContribute')" href="#">
            à qualifier ({{ datasetTodo.length }})
          </a>
        </div>
        <div :class="{'active': filter === 'contributed'}">
          <a @click="setFilter('contributed')" href="#">
            mes contributions ({{ datasetDone.length }})
          </a>
        </div>
      </div>
    </q-list-header>
    <q-item v-if="datasetTodo.length === 0">
      <q-item-main label="Merci ! Vous avez qualifié l'ensemble de nos données." />
    </q-item>
    <div v-if="filter === 'toContribute'" style="height: calc(100vh - 217px); overflow-y: auto;">
      <q-item v-for="data in datasetTodo"
              :ref="data._id"
              :key="data._id"
              @click.native="contribute(data)"
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
    <div v-else style="height: calc(100vh - 217px); overflow-y: auto;">
      <q-item v-for="data in datasetDone"
              :ref="data._id"
              :key="data._id"
              @click.native="contribute(data)"
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
  </q-list>
</template>

<script>
import _ from 'lodash';
import { mapState, mapGetters } from 'vuex';

import { DATASET_BY_SOURCE_QUERY } from '../constants/graphql';

export default {
  name: 'CcLeftPanel',
  data() {
    return {
      filter: 'toContribute',
      projectId: this.$route.params.id,
      datasetTodo: null,
      datasetDone: null,
    };
  },
  computed: {
    ...mapGetters({
      dataset: 'dataset/getDataset',
      datasetId: 'dataset/getDatasetId',
    }),
    ...mapState('users', ['user']),
  },
  watch: {
    datasetId() {
      this.updateDatasetList();
    },
    dataset() {
      this.updateDatasetList();
    },
  },
  created() {
    this.$root.$on('onLabelSaved', () => {
      this.$apollo.queries.Dataset.refresh();
    });
  },
  methods: {
    setImg(img) {
      return `${process.env.API_URL}/img/${this.projectId}/${img}`;
    },
    setFilter(filter) {
      this.$store.commit('dataset/SET_IS_QUALIFIED', filter === 'contributed');
      this.filter = filter;
    },
    contribute(data) {
      this.$store.dispatch('dataset/setData', data);
      this.$store.dispatch('dataset/setDatasetId', data._id);
    },
    updateDatasetList() {
      const datasetTodo = [];
      const datasetDone = [];
      _.each(this.dataset, (data) => {
        data.isActive = (data._id === this.datasetId);
        if (data.usersAnswers.length > 0) {
          const hasAnswered = _.filter(
            data.usersAnswers,
            (answer => answer.userId === this.user.id),
          );
          if (hasAnswered.length === 0) {
            this.setFirstData(datasetTodo, data);
            datasetTodo.push(data);
          } else {
            datasetDone.push(data);
          }
        } else {
          this.setFirstData(datasetTodo, data);
          datasetTodo.push(data);
        }
      });
      this.datasetTodo = datasetTodo;
      this.datasetDone = datasetDone;
      setTimeout(() => {
        if (this.$refs[this.datasetId]) {
          this.$refs[this.datasetId][0].$el.scrollIntoView({
            behavior: 'smooth',
          });
        }
      }, 300);
    },
    setFirstData(datasetTodo, data) {
      const datasetId = this.datasetId || null;
      if (!datasetId && datasetTodo.length === 0) {
        data.isActive = true;
        this.$store.dispatch('dataset/setDatasetId', data._id);
      }
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
      async update(datas) {
        this.$store.dispatch('dataset/setDataset', datas.DataSetBySource);
      },
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
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

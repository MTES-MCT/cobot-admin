<template>
  <q-list class="panelLabel" style="position: fixed; width:25%; height: 100vh;">
    <q-list-header>
      Si la photo ci-contre contient l'un des éléments suivants,
      sélectionnez l'objet que vous allez identifier sur l'image
    </q-list-header>
    <transition-group enter-active-class="animated slideInLeft"
                      leave-active-class="animated slideOutLeft">
      <q-item key="pickup" v-if="pickUpLabel" style="text-align: center;">
        <q-item-main>
          <q-item-tile v-for="(label, index) in labels"
                       v-if="label.id !== 'none'"
                       :key="index"
                       label>
            <q-btn :label="label.label"
                  @click="onSelect(label)"
                  class="full-width"
                  style="margin-top: 10px;"
                  color="pink">
                  <q-tooltip>
                    <img :src="label.img" style="width: 200px;" />
                  </q-tooltip>
            </q-btn>
          </q-item-tile>
          <q-item-tile>
            <q-btn label="passer à la photo suivante"
                  @click="onNext()"
                  class="full-width"
                  style="margin-top: 10px;"
                  color="dark" />
          </q-item-tile>
        </q-item-main>
      </q-item>
    </transition-group>
    <transition-group
        appear
        enter-active-class="animated slideInLeft"
        leave-active-class="animated slideOutLeft"
      >
        <q-item key="confirmBlock" v-if="pickUpLabelConfirm" style="text-align: center;">
          <q-item-main>
            <q-item-tile label>
              vous avez sélectionné
            </q-item-tile>
            <q-item-tile style="margin-top: 10px;">
              <q-chip @hide="onReset()" closable color="dark">
                {{ label.label }}
              </q-chip>
            </q-item-tile>
            <q-item-tile style="padding-top: 10px;">
              Vous pouvez commencer à identifier l'objet dans l'image.
            </q-item-tile>
            <q-item-tile style="padding-top: 10px;">
              <a @click="onNext()" class="next">passer à l'image suivante</a>
            </q-item-tile>
            <q-item-tile style="margin-top: 10px;">
              <q-btn @click="onSave()"
                     v-if="canContribute"
                     label="contribuer !"
                     class="full-width"
                     style="margin-top: 10px;"
                     color="positive" />
            </q-item-tile>
          </q-item-main>
        </q-item>
      </transition-group>
    <!-- <q-item v-if="datasetTodo.length === 0">
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
    </div> -->
  </q-list>
</template>

<script>
import _ from 'lodash';
import { mapState, mapGetters } from 'vuex';

import { DATASET_BY_SOURCE_QUERY } from '../constants/graphql';

export default {
  name: 'CcLeftPanel',
  props: ['labels'],
  data() {
    return {
      label: null,
      pickUpLabel: true,
      pickUpLabelConfirm: false,
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
      canContribute: 'label/canContribute',
    }),
    ...mapState('users', ['user']),
    ...mapState('dataset', ['isDataQualified']),
  },
  watch: {
    datasetId() {
      this.onReset();
      this.$apollo.queries.Dataset.refresh();
    },
  },
  created() {
    this.$root.$on('onNext', () => {
      if (this.$apollo.queries.Dataset) {
        this.$apollo.queries.Dataset.refresh();
      }
    });
  },
  methods: {
    onSelect(selectedLabel) {
      this.label = selectedLabel;
      this.$store.commit('label/SET_LABEL', this.label);
      this.pickUpLabel = false;
      // this.$store.commit('label/SET_ACTION', 'save');
      setTimeout(() => {
        this.pickUpLabelConfirm = true;
      }, 1000);
    },
    onReset() {
      this.label = null;
      this.$store.commit('label/SET_LABEL', null);
      this.pickUpLabelConfirm = false;
      setTimeout(() => {
        this.pickUpLabel = true;
      }, 1000);
    },
    setImg(img) {
      return `${process.env.API_URL}/img/${this.projectId}/${img}`;
    },
    setFilter(filter) {
      this.$store.commit('dataset/SET_IS_QUALIFIED', filter === 'contributed');
      this.$store.dispatch('dataset/setDatasetId', null);
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
            datasetTodo.push(data);
          } else {
            datasetDone.push(data);
          }
        } else {
          datasetTodo.push(data);
        }
      });
      this.datasetTodo = datasetTodo;
      this.datasetDone = datasetDone;
      this.setFirstData();
    },
    onSave() {
      this.$store.commit('label/SET_ACTION', 'save');
    },
    onNext() {
      this.$root.$emit('onNext');
    },
    setFirstData() {
      const datasetId = this.datasetId || null;
      if (!datasetId) {
        if (!this.isDataQualified) {
          this.datasetTodo[0].isActive = true;
          this.$store.dispatch('dataset/setDatasetId', this.datasetTodo[0]._id);
        } else {
          this.datasetDone[0].isActive = true;
          this.$store.dispatch('dataset/setDatasetId', this.datasetDone[0]._id);
        }
      }
      // setTimeout(() => {
      //   if (this.$refs[this.datasetId]) {
      //     this.$refs[this.datasetId][0].$el.scrollIntoView({
      //       behavior: 'smooth',
      //     });
      //   }
      // }, 300);
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
      update(datas) {
        this.$store.dispatch('dataset/setDataset', datas.DataSetBySource);
        this.updateDatasetList();
      },
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .panelLabel
    .next
      color $pink
      font-weight bold
      text-decoration none
      &:hover
        cursor pointer
        text-decoration underline
    .q-list-header
      height 90px
      margin-bottom 10px
      border-bottom 1px solid #e0e0e0
</style>

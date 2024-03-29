<template>
  <q-list class="panelLabel" style="height: 100vh; position: fixed; width:25%;">
    <q-window-resize-observable @resize="onResize" />
    <q-list-header>
      Si la photo ci-contre contient l'un des éléments suivants,
      sélectionnez l'objet que vous allez identifier sur l'image
    </q-list-header>
    <div id="labels" :style="{'height': `${size.height - 250}px`}" style="overflow-y: auto;">
      <q-item
        key="pickup"
        v-if="pickUpLabel"
        style="text-align: center;">
        <q-item-main>
          <q-item-tile v-for="(label, index) in labels"
                        v-if="label.text !== 'no-detected'"
                        :key="index"
                        label>
            <q-btn :label="label.text"
                  @click="onSelect(label)"
                  class="full-width"
                  style="margin-top: 10px;"
                  color="pink">
                  <q-tooltip>
                    <img :src="getPhoto(label.photo)" style="width: 200px;" />
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
          <q-item-tile>
            <q-btn label="supprimer la photo"
                  @click="deleteData()"
                  class="full-width"
                  style="margin-top: 10px;"
                  color="dark" />
          </q-item-tile>
        </q-item-main>
      </q-item>
      <q-item v-if="pickUpLabelConfirm"
              key="confirmBlock"
              style="text-align: center;">
        <q-item-main>
          <q-item-tile label>
            vous avez sélectionné
          </q-item-tile>
          <q-item-tile style="margin-top: 10px;">
            <q-chip @hide="onReset()" closable color="dark">
              {{ label.text }}
            </q-chip>
          </q-item-tile>
          <q-item-tile style="padding-top: 10px;">
            Vous pouvez commencer à identifier l'objet dans l'image.
          </q-item-tile>
          <q-item-tile style="padding-top: 10px;">
            <a @click="onNext()" class="next">passer à l'image suivante</a>
          </q-item-tile>
        </q-item-main>
      </q-item>
      <q-item key="nextLabel" v-if="nextLabel" style="text-align: center;">
        <q-item-main>
          <q-item-tile label>
            <strong>Merci pour votre contribution !</strong>
          </q-item-tile>
          <q-item-tile style="margin-top: 10px;">
            <q-btn @click="onSaveAndContinue()"
                    label="continuer avec cette image"
                    class="full-width"
                    style="margin-top: 10px;"
                    color="pink" />
            <q-btn @click="onSave()"
                  label="passer à l'image suivante"
                  class="full-width"
                  style="margin-top: 10px;"
                  color="dark" />
          </q-item-tile>
        </q-item-main>
      </q-item>
    </div>
  </q-list>
</template>

<script>
import { DATA_DELETE } from '../constants/graphql';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'CcLeftPanel',
  props: ['datasetId', 'labels'],
  data() {
    return {
      label: null,
      pickUpLabel: true,
      pickUpLabelConfirm: false,
      nextLabel: false,
      projectId: this.$route.params.id,
      size: {
        height: '500px',
      },
    };
  },
  computed: {
    ...mapGetters({
      dataset: 'dataset/getDataset',
      canContribute: 'label/canContribute',
    }),
    ...mapState('users', ['user']),
    ...mapState('dataset', ['isDataQualified']),
  },
  watch: {
    canContribute(newVal) {
      if (newVal) {
        this.pickUpLabelConfirm = false;
        this.nextLabel = true;
      } else {
        this.nextLabel = false;
        this.pickUpLabel = true;
      }
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
    onResize(size) {
      this.size = size;
    },
    onSelect(selectedLabel) {
      this.label = selectedLabel;
      this.$store.commit('label/SET_LABEL', this.label);
      this.pickUpLabel = false;
      this.pickUpLabelConfirm = true;
    },
    onReset() {
      this.label = null;
      this.$store.commit('label/SET_LABEL', null);
      this.pickUpLabelConfirm = false;
      this.pickUpLabel = true;
    },
    setImg(img) {
      return `${process.env.API_URL}/img/${this.projectId}/${img}`;
    },
    onSaveAndContinue() {
      this.$store.commit('label/SET_ACTION', 'save');
      this.$store.commit('label/SET_CAN_CONTRIBUTE', false);
    },
    onSave() {
      this.$store.commit('label/SET_ACTION', 'save');
      this.$store.commit('label/SET_CAN_CONTRIBUTE', false);
      this.onNext();
    },
    onNext() {
      this.$root.$emit('onNext');
    },
    deleteData() {
      this.$q.dialog({
        title: 'Suppression',
        message: 'Etes-vous sûr de vouloir supprimer cette donnée ?',
        ok: {
          color: 'pink',
          label: 'oui',
        },
        cancel: {
          color: 'dark',
          label: 'non',
        },
        preventClose: true,
      }).then(() => {
        this.$apollo.mutate({
          mutation: DATA_DELETE,
          variables: {
            id: this.datasetId,
          },
        }).then(() => {
          this.$root.$emit('onNext');
        }).catch((error) => {
          console.log(error);
        });
      }).catch(() => {
      });
    },
    getPhoto(photo) {
      return `${process.env.API_URL}/img/labels/photos/${photo}`;
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

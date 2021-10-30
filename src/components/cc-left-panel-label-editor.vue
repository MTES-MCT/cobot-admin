<template>
  <q-list class="panelLabel" style="height: 100vh; position: fixed; width:25%;">
    <q-window-resize-observable @resize="onResize" />
    <q-list-header>
      Pour éditer un label, cliquez sur celui-ci
      ou sur le bouton "ajouter" pour en créer un nouveau.
      <q-btn label="ajouter un label"
              @click="onSelect(null)"
              class="full-width"
              style="margin-top: 10px;"
              color="dark" />
    </q-list-header>
    <div id="labels" :style="{'height': `${size.height - 250}px`}" style="overflow-y: auto;">
      <q-item
        key="pickup"
        style="text-align: center;">
        <q-item-main>
          <q-item-tile v-for="(label, index) in labels"
                        :key="index"
                        label>
            <q-btn :label="label.text"
                   @click="onSelect(label)"
                   :icon="(currentLabel.uid === label.uid ) ? 'radio_button_checked' : ''"
                   class="full-width"
                   style="margin-top: 10px;"
                   color="pink">
            </q-btn>
          </q-item-tile>
        </q-item-main>
      </q-item>
    </div>
  </q-list>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';

export default {
  name: 'CcLeftPanel',
  props: ['labels'],
  data() {
    return {
      label: null,
      size: {
        height: '500px',
      },
    };
  },
  computed: {
    ...mapGetters({
      currentLabel: 'label/getCurrentLabel',
    }),
  },
  created() {
  },
  mounted() {
    if (this.$route.params.label) {
      const selectedLabel = _.find(this.labels, label => label._id === this.$route.params.label);
      if (selectedLabel) {
        this.$store.commit('label/SET_CURRENT_LABEL', selectedLabel);
      }
    }
  },
  methods: {
    onResize(size) {
      this.size = size;
    },
    onSelect(selectedLabel) {
      this.$store.commit('label/SET_CURRENT_LABEL', selectedLabel);
    },
    onSave() {
    },
    onDelete() {
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
      height 105px
      margin-bottom 10px
      border-bottom 1px solid #e0e0e0
</style>

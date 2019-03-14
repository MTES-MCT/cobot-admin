<template>
  <q-list class="rightLabelPanelInfo">
    <q-list-header style="padding-top: 30px;">
        Label
      </q-list-header>
      <transition-group
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
      >
        <q-item key="pickup" v-if="pickUpLabel" style="text-align: center;">
          <q-item-main>
            <q-item-tile label>
              Sélectionnez l'objet que vous venez de détourer :
            </q-item-tile>
            <q-item-tile v-for="(label, index) in labels"
                        :key="index"
                        label>
              <q-btn :label="label.label"
                    @click="onSelect(label)"
                    class="full-width"
                    style="margin-top: 10px;"
                    color="pink" />
            </q-item-tile>
            <q-item-tile>
              <q-btn label="annuler"
                      @click="onCancel()"
                      class="full-width"
                      style="margin-top: 10px;"
                      color="dark" />
            </q-item-tile>
          </q-item-main>
        </q-item>
      </transition-group>
      <transition-group
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
      >
        <q-item key="confirmBlock" v-if="pickUpLabelConfirm" style="text-align: center;">
          <q-item-main>
            <q-item-tile label>
              vous avez sélectionnez
            </q-item-tile>
            <q-item-tile style="margin-top: 10px;">
              <q-chip @hide="reset()" closable color="dark">
                {{ label.label }}
              </q-chip>
            </q-item-tile>
            <q-item-tile style="margin-top: 10px;">
              <q-btn @click="onSave()"
                    label="contribuer !"
                    class="full-width"
                    style="margin-top: 10px;"
                    color="positive" />
            </q-item-tile>
          </q-item-main>
        </q-item>
      </transition-group>
      <transition-group
        appear
        enter-active-class="animated slideInRight"
        leave-active-class="animated slideOutRight"
      >
        <q-item key="nextLabel" v-if="nextLabel" style="text-align: center;">
          <q-item-main>
            <q-item-tile label>
              <strong>Merci pour votre contribution !</strong>
            </q-item-tile>
            <q-item-tile style="margin-top: 10px;">
              <q-btn @click="onCancel()"
                     label="continuer avec cette image"
                     class="full-width"
                     style="margin-top: 10px;"
                     color="positive" />
              <q-btn @click="onNext()"
                    label="passer à l'image suivante"
                    class="full-width"
                    style="margin-top: 10px;"
                    color="positive" />
            </q-item-tile>
          </q-item-main>
        </q-item>
      </transition-group>
  </q-list>
</template>

<script>
export default {
  name: 'CcRightPanelLabel',
  props: ['labels'],
  data() {
    return {
      pickUpLabel: true,
      pickUpLabelConfirm: false,
      nextLabel: false,
      label: null,
    };
  },
  mounted() {
    this.$root.$on('onLabelSaved', () => {
      this.pickUpLabelConfirm = false;
      setTimeout(() => {
        this.nextLabel = true;
      }, 1000);
    });
  },
  methods: {
    reset() {
      this.pickUpLabelConfirm = false;
      setTimeout(() => {
        this.pickUpLabel = true;
      }, 1000);
      this.label = null;
    },
    onSelect(label) {
      this.pickUpLabel = false;
      setTimeout(() => {
        this.pickUpLabelConfirm = true;
      }, 1000);
      this.label = label;
    },
    onCancel() {
      this.$store.commit('label/SET_ACTION', 'cancel');
    },
    onSave() {
      this.$store.commit('label/SET_ACTION', 'save');
      this.$store.commit('label/SET_LABEL', this.label);
    },
    onNext() {
      this.$store.commit('label/SET_ACTION', 'next');
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .rightLabelPanelInfo
    height: calc(100vh - 138px);
    overflow-y: auto;
    z-index 5890
    position fixed
    top 138px
    right 0px
    width 25%
    .q-item
      span
        width 100%
  .q-list
    background-color #F2F2F2
    box-shadow 0px 0px 5px 0px rgba(0,0,0,0.75)
  .q-list-header
    height 60px
    margin-bottom 10px
    border-bottom 1px solid #e0e0e0
</style>

<template>
  <q-list class="rightLabelPanelInfo">
    <q-list-header style="padding-top: 30px;">
        Label
      </q-list-header>
      <q-item style="text-align: center;">
        <q-item-main v-if="pickUpLabel">
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
        </q-item-main>
        <q-item-main v-else>
          <q-item-tile label>
            <!-- Sélectionnez l'objet que vous venez de détourer : -->
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
                   color="pink" />
          </q-item-tile>
        </q-item-main>
      </q-item>
  </q-list>
</template>

<script>
export default {
  name: 'CcRightPanelLabel',
  props: ['labels'],
  data() {
    return {
      pickUpLabel: true,
      label: null,
    };
  },
  methods: {
    reset() {
      this.pickUpLabel = true;
      this.label = null;
    },
    onSelect(label) {
      this.pickUpLabel = false;
      this.label = label;
    },
    onSave() {
      console.log(this.label);
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
  .q-list
    background-color #F2F2F2
    box-shadow 0px 0px 5px 0px rgba(0,0,0,0.75)
  .q-list-header
    height 60px
    margin-bottom 10px
    border-bottom 1px solid #e0e0e0
</style>

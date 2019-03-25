<template>
  <div class="row subHeader">
    <div class="col-9">
      <div class="title row col items-center">
         <q-icon name="label" color="pink" size="32px"/>
        <span class="on-right">LABELISATION</span>
      </div>
    </div>
    <div class="col-3" style="text-align: right; padding-top: 15px;">
      <q-btn @click="onHelp()"
          default
          color="grey"
          style="margin-right: 10px;">
        {{ $t("labelbot.help") }}
      </q-btn>
      <q-btn @click="onInformation()"
          default
          color="grey"
          style="margin-right: 10px;">
        {{ $t("labelbot.info") }}
      </q-btn>
    </div>
    <ccWelcome></ccWelcome>
  </div>
</template>

<script>
import ccWelcome from './cc-welcome';

export default {
  name: 'CcSubHeaderLabel',
  components: {
    ccWelcome,
  },
  props: ['items'],
  mounted() {
    this.$root.$emit('onOpenWelcome');
  },
  methods: {
    onInformation() {
      const panel = (this.$store.state.label.panel !== 'rightPanelInfo') ? 'rightPanelInfo' : null;
      this.$store.commit('label/SET_PANEL', panel);
    },
    onHelp() {
      this.$store.commit('users/SET_OPEN_HELP', true);
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .subHeader
      height 66px
      width 100%
      background-color #F0F0F0
      position: fixed
      position: fixed;
      z-index: 5900;
      box-shadow: 0 0 0 2px #F0F0F0, 0 5px 5px -4px rgba(0,0,0,0.75);
      .title
        font-weight 600
        padding-top 18px
        padding-left 10px
</style>

<template>
  <div class="row subHeader">
    <div class="col-12">
      <div class="title row col items-center">
        <q-icon name="dashboard" color="pink" size="32px"/>
        <span class="on-right">DASHBOARD</span>
      </div>
    </div>
    <!-- <div class="col-3" style="text-align: right; padding-top: 15px;">
      <q-btn @click="onSkip()"
          default
          color="positive"
          style="margin-right: 10px;">
        {{ $t("labelbot.send") }}
      </q-btn>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'CcSubHeaderUser',
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

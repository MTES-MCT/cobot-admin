<template>
  <div class="row subHeader">
    <div class="col-12">
      <div class="title row col items-center">
        <q-icon name="ballot" color="pink" size="32px"/>
        <span class="on-right">Jeu de donnée</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CcSubHeaderDataset',
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

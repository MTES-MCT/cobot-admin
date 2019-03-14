<template>
  <CcPanelPhotoInfo  v-if="data"
                     side="left"
                     :name="data.file"
                     :metadata="data.metadata" />
</template>

<script>
import CcPanelPhotoInfo from 'components/panel-photo-info';

export default {
  name: 'dashboardContributeObject',
  components: {
    CcPanelPhotoInfo,
  },
  props: ['data'],
};
</script>

<style lang="stylus">
  @import '~variables'
  .q-list
    background-color #F2F2F2
    box-shadow 0px 0px 5px 0px rgba(0,0,0,0.75)
  .q-list-header
    height 60px
    margin-bottom 10px
    border-bottom 1px solid #e0e0e0
</style>

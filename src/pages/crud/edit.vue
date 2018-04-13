<template>
  <div class="main-card">
    <div class="row no-wrap">
      <div class="col bg-white">
        [EDIT]
      </div>
    </div>
  </div>
</template>

<style>
</style>

<script>
import { clone } from 'quasar';
import CcDataTable from 'components/cc-data-table';
import { MESSAGES_QUERY } from '../../constants/graphql';

export default {
  name: 'CobotIndex',
  components: {
    CcDataTable,
  },
  data() {
    return {
    };
  },
  mounted() {
    console.log(this.$route.params.id);
  },
  apollo: {
    messages: {
      query: MESSAGES_QUERY,
      update(data) {
        return clone(data.Messages);
      },
    },
  },
};
</script>

<style lang="stylus">
  @import '~variables'
  .main-card
    border-radius 2px
    width 80vw
    max-width 1200px
  .title
    color: $tertiary
  .number
    color: $tertiary

</style>

<template>
  <div class="main-card">
    <div class="row no-wrap">
      <div class="col bg-white">
        <cc-data-table
          style=""
          v-if="messages.length > 0"
          :config="tableConfig"
          :columns="columns"
          :datas="messages"
          :actions="actions"
          :filter="filter"/>
      </div>
    </div>
  </div>
</template>

<style>
</style>

<script>
import { clone } from 'quasar';
import CcDataTable from 'components/cc-data-table';
import { MESSAGES_QUERY, MESSAGE_DELETE } from '../../constants/graphql';

export default {
  name: 'CobotIndex',
  components: {
    CcDataTable,
  },
  data() {
    return {
      messages: [],
      tableConfig: {
        title: this.$t('cobot.title'),
        columnPicker: false,
        pagination: {
          sortBy: null,
          descending: false,
          page: 1,
          rowsPerPage: 15,
        },
        rowHeight: 50,
      },
      columns: [
        {
          name: 'name',
          required: true,
          label: this.$t('cobot.name'),
          align: 'left',
          field: 'name',
          sortable: true,
        },
        {
          name: 'text',
          label: this.$t('cobot.message'),
          field: row => row.text[0].text,
          align: 'left',
          sortable: true,
        },
        {
          name: 'action',
          align: 'right',
          filter: false,
          sort: false,
        },
      ],
      actions: [
        {
          name: 'global.edit',
          goto: 'crud.edit',
          id: 'id',
        },
        {
          name: 'global.delete',
          id: 'id',
          confirm: 'cobot.confirm.delete',
          gql: MESSAGE_DELETE,
        },
      ],
      filter: '',
    };
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

<template>
  <div class="contributors">
    <q-window-resize-observable @resize="onResize" />
    <q-table
      :title="config.title"
      :data="datas"
      :config="config"
      :columns="columns"
      :filter="filter"
      :pagination.sync="config.pagination">
      <!-- <template slot="top-right" slot-scope="props">
        <q-search
          hide-underline
          color="secondary"
          v-model="filter"
          class="col-6"
        />
      </template> -->
      <q-td :style="{whiteSpace: 'normal'}"
            class="text-left" slot="body-cell-role" slot-scope="props">
         <q-select
            @input="onChangeRole(props)"
            v-model="props.row.projects[0].role"
            :options="roles"
          />
      </q-td>
      <q-td class="text-right" slot="body-cell-action" slot-scope="props">
        <q-btn v-for="(action, index) in actions" :key="index"
               v-if="props.row.role !== 100"
               style="margin-right: 10px;"
               size="sm"
               :color="action.color"
               @click="executeAction(action, props)">
               {{ $t(action.name) }}
        </q-btn>
      </q-td>
    </q-table>
  </div>
</template>

<script>
export default {
  name: 'CcDataTable',
  props: ['projectId', 'datas', 'columns', 'actions', 'config', 'filter'],
  data() {
    return {
      bodyHeight: 0,
      roles: [
        {
          label: 'Super-administrateur',
          value: 100,
        },
        {
          label: 'Administrateur',
          value: 80,
        },
        {
          label: 'Contributeur',
          value: 1,
        },
      ],
    };
  },
  methods: {
    onResize(size) {
      setTimeout(() => {
        this.setBodySize(size);
      }, 500);
    },
    setBodySize(size) {
      const el = document.getElementsByTagName('tbody');
      el[0].style.height = `${size.height - 270}px`;
    },
    onChangeRole(e) {
      e.col.action(e.row);
    },
    setCTAColor(name) {
      return (name === 'global.delete') ? 'negative' : 'primary';
    },
    executeAction(action, props) {
      if (action.goto) {
        this.$router.push({ name: action.goto, params: { id: props.row[action.id] } });
      } else if (action.confirm) {
        this.$q.dialog({
          title: this.$t('global.confirm'),
          message: this.$t(action.confirm),
          ok: {
            label: this.$t('global.yes'),
          },
          cancel: {
            color: 'negative',
            label: this.$t('global.no'),
          },
          preventClose: true,
        }).then(() => {
          this.$apollo.mutate({
            mutation: action.gql,
            variables: {
              id: this.projectId,
              email: props.row[action.id],
            },
          }).then(() => {
            this.datas.splice(props.row.__index, 1);
          }).catch((error) => {
            console.log(error);
          });
        }).catch(() => {
        });
      }
    },
  },
  beforeDestroy() {
    clearTimeout(this.timeout);
  },
  // watch: {
  //   pagination(value) {
  //     if (!value) {
  //       this.oldPagination = this.$clone(this.config.pagination);
  //       this.config.pagination = false;
  //       return;
  //     }
  //     this.config.pagination = this.oldPagination;
  //   },
  //   rowHeight(value) {
  //     this.config.rowHeight = `${value}px`;
  //   },
  //   bodyHeight(value) {
  //     const style = {};
  //     if (this.bodyHeightProp !== 'auto') {
  //       style[this.bodyHeightProp] = `${value}px`;
  //     }
  //     this.config.bodyStyle = style;
  //   },
  //   bodyHeightProp(value) {
  //     const style = {};
  //     if (value !== 'auto') {
  //       style[value] = `${this.bodyHeight}px`;
  //     }
  //     this.config.bodyStyle = style;
  //   },
  // },
};
</script>

<style lang="stylus">
  $table_width = 100%
  $table_body_height = 490px
  $column_one_width = 50%
  $column_two_width = 33%
  $column_three_width = 33%
  $column_four_width = 25%
  .contributors
    .q-table-container
      border 0px
      box-shadow none
      width $table_width
    thead, tbody
      display block
    tbody
      overflow auto
      height $table_body_height
    thead
      background-color #F2F2F2
      tr
        height 35px
    td
      height 68px
    td:nth-child(1), th:nth-child(1) { min-width: $column_one_width; }
    td:nth-child(2), th:nth-child(2) { min-width: $column_two_width; }
    td:nth-child(3), th:nth-child(3) { width: $column_three_width; }
    td:nth-child(4), th:nth-child(4) { width: $column_four_width; }
</style>

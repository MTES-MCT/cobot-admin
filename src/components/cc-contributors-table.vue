<template>
  <div>
    <q-table
      :title="config.title"
      :data="datas"
      :config="config"
      :columns="columns"
      :filter="filter"
      :pagination.sync="config.pagination"
      hide-bottom>
      <template slot="top-right" slot-scope="props">
        <q-search
          hide-underline
          color="secondary"
          v-model="filter"
          class="col-6"
        />
      </template>
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
  watch: {
    pagination(value) {
      if (!value) {
        this.oldPagination = this.$clone(this.config.pagination);
        this.config.pagination = false;
        return;
      }
      this.config.pagination = this.oldPagination;
    },
    rowHeight(value) {
      this.config.rowHeight = `${value}px`;
    },
    bodyHeight(value) {
      const style = {};
      if (this.bodyHeightProp !== 'auto') {
        style[this.bodyHeightProp] = `${value}px`;
      }
      this.config.bodyStyle = style;
    },
    bodyHeightProp(value) {
      const style = {};
      if (value !== 'auto') {
        style[value] = `${this.bodyHeight}px`;
      }
      this.config.bodyStyle = style;
    },
  },
};
</script>

<style lang="stylus">
</style>

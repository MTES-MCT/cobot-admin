<template>
  <div>
    <q-table
      :title="config.title"
      :data="datas"
      :config="config"
      :columns="columns"
      :filter="filter"
      :pagination.sync="config.pagination">
      <template slot="top-right" slot-scope="props">
        <q-search
          hide-underline
          color="secondary"
          v-model="filter"
          class="col-6"
        />
      </template>
      <q-td class="text-left" slot="body-cell-file" slot-scope="props">
        <img :src="getImgUrl(props.value)" style="width: 300px;"/>
      </q-td>
      <q-td class="text-center" slot="body-cell-numAnswers" slot-scope="props">
        <h3>{{ props.value }} </h3>
      </q-td>
      <q-td class="text-center" slot="body-cell-userAnswers" slot-scope="props">
        <div class="pctMainAnswer">
          <h2>
            {{ userAnswersResults[props.row.__index].mainResult }}%
          </h2>
          <p>{{ userAnswersResults[props.row.__index].mainResultAnswer }}</p>
        </div>
        <q-list v-if="userAnswersResults[props.row.__index].otherResults.length > 0">
          <q-collapsible :label="$t('contributions.more')">
            <div v-html="otherResults(userAnswersResults[props.row.__index].otherResults)"
                 class="otherResults">
            </div>
          </q-collapsible>
        </q-list>
      </q-td>
    </q-table>
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'CcContributionsTable',
  props: ['datas', 'columns', 'actions', 'config', 'filter'],
  data() {
    return {
      userAnswersResults: [],
    };
  },
  created() {
    this.userAnswers(this.datas);
  },
  methods: {
    getImgUrl(file) {
      return `https://dev-cc-api.wawy.io/img/${file}`;
    },
    otherResults: (results) => {
      let output = '';
      _.each(results, (r) => {
        output += `<p>${r.pct}% - ${r.answer}</p>`;
      });
      return output;
    },
    userAnswers(datas) {
      _.each(datas, (data, dataIndex) => {
        const numAnswers = data.usersAnswers.length;
        this.userAnswersResults[dataIndex] = [];
        this.userAnswersResults[dataIndex].otherResults = [];
        let answ = _.chain(data.usersAnswers)
          .groupBy('answers')
          .value();
        answ = _.values(answ).sort((a, b) => (a.length < b.length));
        _.each(answ, (a, index) => {
          const pct = Math.ceil((a.length * 100) / numAnswers);
          if (index === 0) {
            this.userAnswersResults[dataIndex].mainResult = pct;
            this.userAnswersResults[dataIndex].mainResultAnswer = a[0].answers;
          } else {
            this.userAnswersResults[dataIndex].otherResults.push({
              pct,
              answer: a[0].answers,
            });
          }
        });
      });
    },
    setCTAColor(name) {
      return (name === 'global.delete') ? 'negative' : 'primary';
    },
    executeAction(action, props) {
      if (action.goto) {
        console.log(action.goto);
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
              id: props.row[action.id],
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
  @import '~variables'
  .pctMainAnswer
    padding-bottom 20px
    p
      font-weight bold
    h2
      color $positive
      -webkit-margin-after 0
      -webkit-margin-before 0
  .otherResults
    width 220px
    white-space normal
    text-align left
</style>

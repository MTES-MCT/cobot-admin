<template>
  <q-list highlight style="position: fixed; width:25%; height: 100vh;">
    <q-list-header>
      Dernières activitées
    </q-list-header>
    <q-item v-for="(feed, index) in feeds"
            :key="index">
      <q-item-main>
        <q-item-tile label>Contribution de {{ feed.user }}</q-item-tile>
         <q-item-tile sublabel>{{ feed.relativeDate }}</q-item-tile>
      </q-item-main>
    </q-item>
  </q-list>
</template>

<script>
import moment from 'moment';
import _ from 'lodash';
import { PROJECT_CONTRIBUTORS } from '../constants/graphql';

export default {
  name: 'CcLeftPanelDashboard',
  data() {
    return {
      projectId: this.$route.params.id,
      feeds: null,
    };
  },
  apollo: {
    feeds: {
      query: PROJECT_CONTRIBUTORS,
      variables() {
        return {
          projectId: this.projectId,
        };
      },
      update(data) {
        moment.locale('fr');
        const datas = _.filter(data.ProjectContributors, user => user.activity.lastAnswersAt);
        let feeds = [];
        _.each(datas, (user) => {
          feeds.push({
            user: user.name || user.email,
            createdAt: moment(user.activity.lastAnswersAt),
            relativeDate: moment(String(user.activity.lastAnswersAt)).startOf().fromNow(),
          });
        });
        feeds = _.orderBy(feeds, ['createdAt'], ['desc']);
        return feeds;
      },
    },
  },
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

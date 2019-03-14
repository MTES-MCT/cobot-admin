/* eslint-disable global-require */
import Vue from 'vue';
import Vuex from 'vuex';

// we first import the module
import dataset from './dataset';
import users from './users';
import label from './label';
import project from './project';

Vue.use(Vuex);

const store = new Vuex.Store({
  namespace: true,
  modules: {
    dataset,
    users,
    label,
    project,
  },
});

// if we want some HMR magic for it, we handle
// the hot update like below. Notice we guard this
// code with "process.env.DEV" -- so this doesn't
// get into our production build (and it shouldn't).
if (process.env.DEV && module.hot) {
  module.hot.accept(['./dataset', './users', './label'], () => {
    const newDataset = require('./dataset').default;
    const newUsers = require('./users').default;
    const newLabel = require('./label').default;
    const newProject = require('./project').default;
    store.hotUpdate({
      modules: {
        dataset: newDataset,
        users: newUsers,
        label: newLabel,
        project: newProject,
      },
    });
  });
}

export default store;

/* eslint-disable import/prefer-default-export */
import _ from 'lodash';

export const getDatasetId = (state => state.datasetId);

export const getDataset = (state) => {
  if (state.data) {
    _.each(state.dataset, (data) => {
      data.isActive = (data._id === state.data._id);
      if (data.usersAnswers && data.usersAnswers.length > 0 && !data.usersAnswers[0].label) {
        data.usersAnswers = _.map(data.usersAnswers, answer => JSON.parse(answer.answers));
      }
    });
  }
  return state.dataset;
};

export const getData = (state) => {
  if (state.data && state.data.metadata) {
    const rawMetadata = state.data.metadata.raw;
    if (rawMetadata && typeof rawMetadata === 'string') {
      state.data.metadata.raw = JSON.parse(rawMetadata);
    }
    state.data.isActive = true;
  }
  return state.data;
};

/* eslint-disable import/prefer-default-export */
import _ from 'lodash';

const groupAnswers = (usersAnswers) => {
  const groupedAnswers = _.groupBy(usersAnswers, (answer) => {
    if (!answer.answers.label) {
      return answer.answers.label;
    }
    if (answer.answers.label.id) {
      return answer.answers.label.label;
    }
    return answer.answers.label;
  });
  return groupedAnswers;
};

export const getDatasetId = (state => state.datasetId);

export const getDataset = (state) => {
  if (state.data) {
    _.each(state.dataset, (data) => {
      data.isActive = (data._id === state.data._id);
      data.hasNone = false;
      _.each(data.usersAnswers, (answer) => {
        if (typeof answer.answers === 'string') {
          answer.answers = JSON.parse(answer.answers);
          data.groupedAnswers = groupAnswers(data.usersAnswers);
        }
        if (typeof answer.answers.label === 'string') {
          if (answer.answers.label === 'Aucun') {
            data.hasNone = true;
          }
        } else if (!answer.answers.label || answer.answers.label.id === 'none') {
          data.hasNone = true;
        }
      });
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

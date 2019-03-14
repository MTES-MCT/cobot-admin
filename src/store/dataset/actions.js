/* eslint-disable import/prefer-default-export */
export const setDatasetId = ({ commit }, id) => {
  commit('SET_DATASET_ID', id);
};

export const setDataset = ({ commit }, dataset) => {
  commit('SET_DATASET', dataset);
};

export const setData = ({ commit }, data) => {
  commit('SET_DATA', data);
};

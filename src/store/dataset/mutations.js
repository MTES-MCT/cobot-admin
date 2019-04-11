/* eslint-disable import/prefer-default-export */
export const SET_DATASET_ID = (state, id) => {
  state.datasetId = id;
};

export const SET_DATASET = (state, dataset) => {
  state.dataset = dataset;
};

export const SET_DATA = (state, data) => {
  state.data = data;
  return data;
};

export const SET_IS_QUALIFIED = (state, isQualified) => {
  state.isDataQualified = isQualified;
  return isQualified;
};

export const SET_PAGER_OFFSET = (state, pagerOffset) => {
  state.pagerOffset = pagerOffset;
  return pagerOffset;
};

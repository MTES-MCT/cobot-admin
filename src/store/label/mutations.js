/* eslint-disable import/prefer-default-export */
export const SET_PANEL = (state, panel) => {
  state.panel = panel;
};

export const SET_ACTION = (state, action) => {
  state.action = action;
};

export const SET_LABEL = (state, label) => {
  state.label = label;
};

export const SET_CAN_CONTRIBUTE = (state, boolean) => {
  state.canContribute = boolean;
};

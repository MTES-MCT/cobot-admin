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

export const SET_CURRENT_LABEL = (state, label) => {
  if (label) {
    state.currentLabel = label;
  } else {
    state.currentLabel = {
      uid: null,
      text: null,
      photo: null,
      icon: null,
      isObstacle: false,
    };
  }
};

export const SET_CAN_CONTRIBUTE = (state, boolean) => {
  state.canContribute = boolean;
};

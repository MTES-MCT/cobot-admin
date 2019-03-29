/* eslint-disable import/prefer-default-export */
export const SET_USER = (state, user) => {
  state.user = user;
};

export const SET_OPEN_WELCOME = (state, value) => {
  state.openWelcome = value;
};

export const SET_OPEN_HELP = (state, value) => {
  state.openHelp = value;
};

export const SET_OPEN_INFO = (state, value) => {
  state.openInfo = value;
};

export const SET_OPEN_EDIT_PROJECT = (state, value) => {
  state.openEditProject = value;
};

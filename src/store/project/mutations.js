export const SET_PROJECTS = (state, projects) => {
  state.projects = projects;
};

export const SET_PROJECT = (state, project) => {
  state.project = project;
  return project;
};

export const SET_PROJECT_ID = (state, projectId) => {
  state.projectId = projectId;
  return projectId;
};

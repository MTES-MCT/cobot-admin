import _ from 'lodash';

export const SET_PROJECTS = (state, projects) => {
  state.projects = projects;
};

export const SET_PROJECT = (state, project) => {
  _.each(project.labels, (label) => {
    delete label.__typename;
    _.each(label.properties, (property) => {
      delete property.__typename;
    });
  });
  state.project = project;
  return project;
};

export const SET_PROJECT_ID = (state, projectId) => {
  state.projectId = projectId;
  return projectId;
};

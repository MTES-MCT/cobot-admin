import gql from 'graphql-tag';

export const ACTIONS_QUERY = gql`query actions {
  Actions {
    id
    name
    text
  }
}`;

export const AUTOLOGIN = gql`query AutoLogin($email: String!) {
  AutoLogin(email: $email) {
    id
    email
    lastConnection
  }
}`;

export const DATASET_ANSWERS = gql`mutation dataSetAnswers($id: ID!, $answer: String!) {
  dataSetAnswers(id: $id, answer: $answer) {
    activity {
      lastAnswersAt
      numAnswers
    }
  }
}`;

export const DATASET_BY_SOURCE_QUERY = gql`query DataSetBySource($id: ID!) {
  DataSetBySource(id: $id) {
    _id,
    file,
    numAnswers,
    metadata {
      geoData {
        speed
        location {
          coordinates
        }
      }
      raw
      originalWidth
      originalHeight
      originalOrientation
    }
    usersAnswers {
      userId
      answers
    }
  }
}`;

export const DATASET_QUERY = gql`query DataSet($projectId: ID!, $id: ID, $notAnswered: Boolean) {
  DataSet(projectId: $projectId, id: $id, notAnswered: $notAnswered) {
    _id,
    file,
    numAnswers,
    metadata {
      geoData {
        speed
        location {
          coordinates
        }
      }
      raw
      originalWidth
      originalHeight
      originalOrientation
    }
    usersAnswers {
      answers
      userId
    }
  }
}`;

export const DATASET_STATS_QUERY = gql`query getDataSetStats($id: ID!) {
  DataSetStats(id: $id) {
    datas
    contributors
    contributions
    achievement
    contributionsGraph {
      createdAt
      numAnswers
    }
  }
}`;

export const DATA_DELETE = gql`mutation dataDelete($id: ID!) {
  dataDelete(id: $id)
}`;

export const DATASET_STATS_SUB = gql`subscription subContribution($id: ID!) {
  contributionAdded(id: $id) {
    createdAt
    source
  }
}`;

export const DATASET_UPLOAD_SUB = gql`subscription uploadProgress($uid: ID!) {
  uploadProgress(uid: $uid) {
   data
  }
}`;

export const ME_QUERY = gql`query user {
  Me {
    id
    name
    email
    projects {
      id
      name
      role
      question
      answers {
        _id
        text
        order
      }
    }
  }
}`;

export const MESSAGES_QUERY = gql`query getMessages {
  Messages {
    id
    name
    text {
      text
      counter
    }
    attachments {
      id
      callback
      color
      image
      text {
        text
        counter
      }
      actions {
        name
        text
        type
        value
      }
    }
  }
}`;

export const MESSAGE_QUERY = gql`query getMessage($id: ID) {
  Message(id: $id) {
    id
    name
    text {
      text
      counter
    }
    attachments {
      id
      callback
      color
      image
      text {
        text
        counter
      }
      actions {
        id
        name
        text
        type
        value
      }
    }
  }
}`;

export const USER_PASSWORD_UPDATE = gql`mutation updateUserPassword($id: ID!, $password: String!) {
  updateUserPassword(id: $id, password: $password) {
    email
  }
}`;

export const MESSAGE_UPDATE = gql`mutation updtMessage($id: ID!, $message: [MessageInput], $attachments: [AttachmentInput], $actions: [ActionInput]) {
  updateMessage(id: $id, message: $message, attachments: $attachments, actions: $actions)
}`;

export const MESSAGE_DELETE = gql`mutation removeMessage($id: ID!) {
  deleteMessage(id: $id)
}`;

export const MESSAGE_MUTATION = '';

export const PROJECT_QUERY = gql`query getProject($id: ID!) {
  Project(id: $id) {
    id
    name
    details
    question
    answers {
      text
      order
    }
    labels {
      text
      order
    }
  }
}`;

export const PROJECT_CONTRIBUTORS = gql`query contributors($id: ID!) {
  ProjectContributors(id: $id) {
    name
    email
    lastConnection
    activity {
      lastAnswersAt
    }
    projects {
      role
    }
  }
}`;

export const PROJECT_CREATE_CONTRIBUTOR = gql`mutation createProjectContributor($id: ID!, $email: String!, $role: Int!) {
  createProjectContributor(id: $id, email: $email, role: $role) {
    name
    email
    projects {
      id
      role
    }
  }
}`;

export const PROJECT_UPDATE_CONTRIBUTOR_ROLE = gql`mutation updateUserProjectsRole($email: String!, $projects: UserProjectsInput!) {
  updateUserProjectsRole(email: $email, projects: $projects) {
    email
    projects {
      id
      role
    }
  }
}`;

export const DELETE_PROJECT_CONTRIBUTOR = gql`mutation deleteProjectContributor($id: ID!, $email: String) {
  deleteProjectContributor(id: $id, email: $email) {
    name
    projects {
      id
      role
    }
  }
}`;

export const PROJECT_UPDATE = gql`mutation projectUpdate($id: ID!, $name: String, $question: String, $answers: [AnswerInput], $labels: [LabelInput]) {
  updateProject(id: $id, name: $name, question: $question, answers: $answers, labels: $labels) {
    name
  }
}`;

export const PROJECT_CREATE = gql`mutation createProject($name: String, $details: String) {
  createProject(name: $name, details: $details) {
    id
    name
    details
  }
}`;

export const PROJECT_DELETE = gql`mutation deleteProject($id: ID!) {
  deleteProject(id: $id)
}`;

export const DOWNLOAD_FROM_DROPBOX = gql`mutation dropbox($url: String, $project: ProjectInput) {
  dropbox(url: $url, project: $project)
}`;

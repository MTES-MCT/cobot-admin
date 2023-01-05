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

export const DATASET_BY_SOURCE_QUERY = gql`query DataSetBySource($id: ID!, $user: ID, $label: String, $offset: Int, $limit: Int) {
  DataSetBySource(id: $id, user: $user, label: $label, offset: $offset, limit: $limit) {
    _id,
    file,
    user_doc {
      name
      email
    }
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
    user_doc {
      name
      email
    }
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

export const DATASET_EXPORT_TO_AUTOML = gql`query AutoMLExport($projectId: ID!, $label: String) {
  AutoMLExport(projectId: $projectId, label: $label) {
    file
    metadata {
      id
      source
    }
    usersAnswers {
      answers
    }
  }
}`;

export const DATASET_NUM_LABEL_QUERY = gql`query getDataSetNumLabel($projectId: ID!, $label: String!) {
  DataSetNumLabel(projectId: $projectId, label: $label)
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

export const DATASET_COUNT_BY_SOURCE = gql`query getDataSetCount($projectId: ID!, $user: ID, $label: String) {
  CountDataSetBySource(projectId: $projectId, user: $user, label: $label)
}`;

export const ME_QUERY = gql`query user {
  Me {
    _id
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
      labels {
        _id
        text
        photo
        icon
        properties {
          name
          val_1
          val_2
          val_3
        }
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
      _id
      text
      order
      properties {
        name
        val_1
        val_2
        val_3
      }
    }
  }
}`;

export const PROJECT_CONTRIBUTORS = gql`query contributors($projectId: ID!) {
  ProjectContributors(projectId: $projectId) {
    _id
    name
    email
    lastConnection
    labels
    photos
    activity {
      lastAnswersAt
    }
    projects {
      id
      role
      isPro
    }
    project {
      role
      isPro
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

export const PROJECT_CREATE = gql`mutation createProject($name: String, $details: String, $labels: [LabelInput]) {
  createProject(name: $name, details: $details, labels: $labels) {
    id
    name
    details
    labels {
      _id
      text
      order
      properties {
        name
        val_1
        val_2
        val_3
      }
    }
  }
}`;

export const PROJECT_DELETE = gql`mutation deleteProject($id: ID!) {
  deleteProject(id: $id)
}`;

export const DOWNLOAD_FROM_DROPBOX = gql`mutation dropbox($url: String, $project: ProjectInput) {
  dropbox(url: $url, project: $project)
}`;

export const LABELS = gql`query labels {
  Labels {
    _id
    uid
    text
    ttl
    photo
    icon
    isObstacle
    properties {
      name
      val_1
      val_2
      val_3
    }
  }
}`;

export const LABELS_CREATE = gql`mutation createLabel($uid: String!, $text: String!, $ttl: Int, $photo: String, $icon: String, $isObstacle: Boolean) {
  createLabel(uid: $uid, text: $text, ttl: $ttl, photo: $photo, icon: $icon, isObstacle: $isObstacle) {
    _id
    uid
    text
    ttl
    photo
    icon
    isObstacle
  }
}`;

export const LABELS_UPDATE = gql`mutation updateLabel($id: ID!, $uid: String!, $text: String!, $ttl: Int, $photo: String, $icon: String, $isObstacle: Boolean, $properties: [PropertiesInput]) {
  updateLabel(id: $id, uid: $uid, text: $text, ttl: $ttl, photo: $photo, icon: $icon, isObstacle: $isObstacle, properties: $properties) {
    _id
    uid
    text
    ttl
    photo
    icon
    isObstacle
    properties {
      name
      val_1
      val_2
      val_3
    }
  }
}`;

export const LABELS_DELETE = gql`mutation labelDelete($id: ID!) {
  labelDelete(id: $id)
}`;

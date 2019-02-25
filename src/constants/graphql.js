import gql from 'graphql-tag';

export const ACTIONS_QUERY = gql`query actions {
  Actions {
    id
    name
    text
  }
}`;

export const DATASET_QUERY = gql`query getDataSet($id: ID!) {
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
    }
    usersAnswers {
      answers
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

export const DATASET_STATS_SUB = gql`subscription subContribution($id: ID!) {
  contributionAdded(id: $ID) {
    createdAt
    source
  }
}`;

export const ME_QUERY = gql`query user {
  Me {
    id
    name
    projects {
      id
      name
      role
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

export const MESSAGE_UPDATE = gql`mutation updtMessage($id: ID!, $message: [MessageInput], $attachments: [AttachmentInput], $actions: [ActionInput]) {
  updateMessage(id: $id, message: $message, attachments: $attachments, actions: $actions)
}`;

export const MESSAGE_DELETE = gql`mutation removeMessage($id: ID!) {
  deleteMessage(id: $id)
}`;

export const MESSAGE_MUTATION = '';

export const PROJECT_QUERY = gql`query getProject($id: ID!) {
  Project(id: $id) {
    name
    question
    answers{
      text
      order
    }
  }
}`;

export const PROJECT_UPDATE = gql`mutation projectUpdate($id: ID!, $name: String, $question: String, $answers: [AnswerInput]) {
  updateProject(id: $id, name: $name, question: $question, answers: $answers) {
    name
  }
}`;

export const PROJECT_CREATE = gql`mutation createProject($name: String) {
  createProject(name: $name) {
    id
    name
  }
}`;

export const PROJECT_DELETE = gql`mutation deleteProject($id: ID!) {
  deleteProject(id: $id)
}`;

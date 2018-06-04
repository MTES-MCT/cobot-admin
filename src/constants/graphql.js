import gql from 'graphql-tag';

export const ACTIONS_QUERY = gql`query actions {
  Actions {
    id
    name
    text
  }
}`;

export const DATASET_QUERY = gql`query getDataSet($source: String!) {
  DataSetBySource(source: $source) {
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

export const DATASET_STATS_QUERY = gql`query getDataSetStats($source: String!) {
  DataSetStats(source: $source) {
    datas
    contributions
    achievement
    contributionsGraph {
      createdAt
      numAnswers
    }
  }
}`;

export const DATASET_STATS_SUB = gql`subscription subContribution($source: String!) {
  contributionAdded(source: $source) {
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

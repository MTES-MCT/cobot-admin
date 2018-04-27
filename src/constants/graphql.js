import gql from 'graphql-tag';

export const ACTIONS_QUERY = gql`query actions {
  Actions {
    id
    name
    text
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
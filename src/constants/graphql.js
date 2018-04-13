import gql from 'graphql-tag';

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

export const MESSAGE_DELETE = gql`mutation removeMessage($id: ID!) {
  deleteMessage(id: $id)
}`;

export const MESSAGE_MUTATION = '';

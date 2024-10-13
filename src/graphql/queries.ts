import {gql} from "@apollo/client";

// Query to fetch all items
export const GET_ITEMS = gql`
  query GetItems {
    items {
      id
      title
      description
      type
      tags
      user {
        id
        name
        email
      }
    }
  }
`;

// Mutation to add a new item
export const ADD_ITEM = gql`
  mutation AddItem(
    $title: String!
    $description: String!
    $type: String!
    $tags: [String!]!
    $userId: ID!
  ) {
    addItem(
      title: $title
      description: $description
      type: $type
      tags: $tags
      user: $userId
    ) {
      title
      description
      type
      id
    }
  }
`;

// Mutation to update an existing item
export const UPDATE_ITEM = gql`
  mutation UpdateItem(
    $id: ID!
    $title: String!
    $description: String!
    $type: String!
    $tags: [String!]!
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      type: $type
      tags: $tags
    ) {
      id
      title
      description
      type
      tags
      user {
        id
        name
        email
      }
    }
  }
`;

// Mutation to delete an item
export const DELETE_ITEM = gql`
  mutation DeleteItem($id: ID!) {
    deleteItem(id: $id) {
      message
    }
  }
`;

export const GET_ITEM_BY_ID = gql`
  query GetItemById($id: ID!) {
    item(id: $id) {
      id
      title
      description
      type
      tags
      user {
        id
        name
        email
      }
    }
  }
`;

// Mutation for user registration
export const REGISTER_USER = gql`
  mutation RegisterUser($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

// Mutation for user login
export const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

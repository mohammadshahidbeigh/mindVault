import {gql} from "@apollo/client";

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

// Mutation to update an existing item
export const UPDATE_ITEM = gql`
  mutation UpdateItem(
    $itemId: ID!
    $userId: ID!
    $title: String
    $description: String
    $type: String
    $tags: [String!]
  ) {
    updateItem(
      itemId: $itemId
      userId: $userId
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
  mutation DeleteItem($itemId: ID!, $userId: ID!) {
    deleteItem(itemId: $itemId, userId: $userId) {
      id
      title
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

// Query to fetch items by user
export const GET_ITEMS_BY_USER = gql`
  query GetItemsByUser($userId: ID!) {
    itemsByUser(userId: $userId) {
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

// Mutation to update user
export const UPDATE_USER = gql`
  mutation UpdateUser($name: String, $email: String) {
    updateUser(name: $name, email: $email) {
      id
      name
      email
    }
  }
`;

// Mutation to delete user
export const DELETE_USER = gql`
  mutation DeleteUser {
    deleteUser {
      message
    }
  }
`;

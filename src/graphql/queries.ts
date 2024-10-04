import {gql} from "@apollo/client";

// Example: Query to fetch all items
export const GET_ITEMS = gql`
  query GetItems {
    items {
      id
      title
      description
      type
      tags
    }
  }
`;

// Example: Mutation to add a new item
export const ADD_ITEM = gql`
  mutation AddItem(
    $title: String!
    $description: String!
    $type: String!
    $tags: [String!]!
  ) {
    addItem(
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

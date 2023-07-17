/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateEvent = /* GraphQL */ `
  subscription OnCreateEvent(
    $filter: ModelSubscriptionEventFilterInput
    $owner: String
  ) {
    onCreateEvent(filter: $filter, owner: $owner) {
      id
      name
      description
      eventType
      eventPlatform
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateEvent = /* GraphQL */ `
  subscription OnUpdateEvent(
    $filter: ModelSubscriptionEventFilterInput
    $owner: String
  ) {
    onUpdateEvent(filter: $filter, owner: $owner) {
      id
      name
      description
      eventType
      eventPlatform
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteEvent = /* GraphQL */ `
  subscription OnDeleteEvent(
    $filter: ModelSubscriptionEventFilterInput
    $owner: String
  ) {
    onDeleteEvent(filter: $filter, owner: $owner) {
      id
      name
      description
      eventType
      eventPlatform
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onCreateBookmark = /* GraphQL */ `
  subscription OnCreateBookmark(
    $filter: ModelSubscriptionBookmarkFilterInput
    $owner: String
  ) {
    onCreateBookmark(filter: $filter, owner: $owner) {
      id
      eventID
      eventName
      event {
        id
        name
        description
        eventType
        eventPlatform
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateBookmark = /* GraphQL */ `
  subscription OnUpdateBookmark(
    $filter: ModelSubscriptionBookmarkFilterInput
    $owner: String
  ) {
    onUpdateBookmark(filter: $filter, owner: $owner) {
      id
      eventID
      eventName
      event {
        id
        name
        description
        eventType
        eventPlatform
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteBookmark = /* GraphQL */ `
  subscription OnDeleteBookmark(
    $filter: ModelSubscriptionBookmarkFilterInput
    $owner: String
  ) {
    onDeleteBookmark(filter: $filter, owner: $owner) {
      id
      eventID
      eventName
      event {
        id
        name
        description
        eventType
        eventPlatform
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onCreateTodo = /* GraphQL */ `
  subscription OnCreateTodo(
    $filter: ModelSubscriptionTodoFilterInput
    $owner: String
  ) {
    onCreateTodo(filter: $filter, owner: $owner) {
      id
      name
      description
      date
      eventID
      event {
        id
        name
        description
        eventType
        eventPlatform
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onUpdateTodo = /* GraphQL */ `
  subscription OnUpdateTodo(
    $filter: ModelSubscriptionTodoFilterInput
    $owner: String
  ) {
    onUpdateTodo(filter: $filter, owner: $owner) {
      id
      name
      description
      date
      eventID
      event {
        id
        name
        description
        eventType
        eventPlatform
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;
export const onDeleteTodo = /* GraphQL */ `
  subscription OnDeleteTodo(
    $filter: ModelSubscriptionTodoFilterInput
    $owner: String
  ) {
    onDeleteTodo(filter: $filter, owner: $owner) {
      id
      name
      description
      date
      eventID
      event {
        id
        name
        description
        eventType
        eventPlatform
        createdAt
        updatedAt
        owner
        __typename
      }
      createdAt
      updatedAt
      owner
      __typename
    }
  }
`;

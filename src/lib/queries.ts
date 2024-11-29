import { gql } from "@apollo/client";

export const streamsDetailsQuery = gql`
  query MyQuery($receiver: String!) {
    streams(
      where: { receiver: $receiver }
      orderBy: createdAtTimestamp
      orderDirection: desc
    ) {
      createdAtBlockNumber
      createdAtTimestamp
      currentFlowRate
      deposit
      id
      streamedUntilUpdatedAt
      updatedAtBlockNumber
      updatedAtTimestamp
      userData
      token {
        decimals
        isListed
        name
        symbol
        isSuperToken
      }
      receiver {
        id
        isSuperApp
        createdAtTimestamp
        createdAtBlockNumber
      }
      sender {
        createdAtTimestamp
        createdAtBlockNumber
        id
        isSuperApp
      }
    }
  }
`;

export const activeStreamsQuery = gql`
  query GetActiveStreams($receiver: String!) {
    streams(where: { receiver: $receiver, currentFlowRate_gt: 0 }) {
      currentFlowRate
    }
  }
`;

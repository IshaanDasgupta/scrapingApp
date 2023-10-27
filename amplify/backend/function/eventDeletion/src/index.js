/* Amplify Params - DO NOT EDIT
	API_SCRAPING_GRAPHQLAPIENDPOINTOUTPUT
	API_SCRAPING_GRAPHQLAPIIDOUTPUT
	ENV
	REGION
Amplify Params - DO NOT EDIT */

import crypto from '@aws-crypto/sha256-js';
import {defaultProvider} from '@aws-sdk/credential-provider-node';
import {SignatureV4} from '@aws-sdk/signature-v4';
import {HttpRequest} from '@aws-sdk/protocol-http';
import {default as fetch, Request} from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.API_SCRAPING_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const {Sha256} = crypto;

const query = /* GraphQL */ `
  query LIST_EVENTS($filter: ModelEventFilterInput) {
    listEvents(filter: $filter) {
      items {
        id
        date
      }
    }
  }
`;

const mutation = /* GraphQL */ `
  mutation DELETE_EVENT($input: DeleteEventInput!) {
    deleteEvent(input: $input) {
      id
      name
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

export const handler = async event => {
  const endpoint = new URL(GRAPHQL_ENDPOINT);

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region: AWS_REGION,
    service: 'appsync',
    sha256: Sha256,
  });

  let statusCode = 200;
  let errorBody = {};
  const body = [];
  let previousEvents = [];

  const requestToBeSignedForListing = new HttpRequest({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      host: endpoint.host,
    },
    hostname: endpoint.host,
    body: JSON.stringify({query}),
    path: endpoint.pathname,
  });

  console.log(requestToBeSignedForListing);

  const signedForListing = await signer.sign(requestToBeSignedForListing);
  const requestForListing = new Request(endpoint, signedForListing);

  let responseForListing;

  try {
    responseForListing = await fetch(requestForListing);
    const currBody = await responseForListing.json();
    previousEvents = currBody.data.listEvents.items;
    body.push(currBody);
    console.log(
      'previous events : \n\n\n',
      currBody.data.listEvents.items,
      '\n\n\n',
    );
  } catch (error) {
    console.log(error);
    statusCode = 500;
    errorBody = {
      errors: [
        {
          message: error.message,
        },
      ],
    };
  }

  await Promise.all(
    previousEvents.map(async data => {
      console.log(
        'difference \n',
        (new Date() - new Date(data.date)) / (1000 * 60 * 60 * 24),
        '\n',
      );
      if ((new Date() - new Date(data.date)) / (1000 * 60 * 60 * 24) > 30) {
        const variables = {
          input: {
            id: data.id,
          },
        };

        const requestToBeSigned = new HttpRequest({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            host: endpoint.host,
          },
          hostname: endpoint.host,
          body: JSON.stringify({query: mutation, variables}),
          path: endpoint.pathname,
        });

        console.log(requestToBeSigned);

        const signed = await signer.sign(requestToBeSigned);
        const request = new Request(endpoint, signed);

        let response;

        try {
          response = await fetch(request);
          const currBody = await response.json();
          body.push(currBody);
        } catch (error) {
          console.log(error);
          statusCode = 500;
          errorBody = {
            errors: [
              {
                message: error.message,
              },
            ],
          };
        }
      }
    }),
  );

  return {
    statusCode,
    //  Uncomment below to enable CORS requests
    // headers: {
    //   "Access-Control-Allow-Origin": "*",
    //   "Access-Control-Allow-Headers": "*"
    // },
    body: statusCode === 500 ? JSON.stringify(errorBody) : JSON.stringify(body),
  };
};

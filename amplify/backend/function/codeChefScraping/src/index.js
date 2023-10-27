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
import puppeteer from 'puppeteer-core';
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const chromium = require('@sparticuz/chromium');

const GRAPHQL_ENDPOINT = process.env.API_SCRAPING_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.AWS_REGION || 'us-east-1';
const {Sha256} = crypto;

const query = /* GraphQL */ `
  query LIST_EVENTS($filter: ModelEventFilterInput) {
    listEvents(filter: $filter) {
      items {
        name
      }
    }
  }
`;

const mutation = /* GraphQL */ `
  mutation CREATE_EVENT($input: CreateEventInput!) {
    createEvent(input: $input) {
      id
      name
    }
  }
`;

const codeForcesScrapping = async () => {
  try {
    const browser = await puppeteer.launch({
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
      defaultViewport: chromium.defaultViewport,
      args: [...chromium.args, '--hide-scrollbars', '--disable-web-security'],
    });

    const page = await browser.newPage();

    await page.goto('https://www.codechef.com/contests');
    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    });

    await page.waitForTimeout(5000);

    const evaluate = await page.evaluate(() => {
      const months = {
        Jan: '01',
        Feb: '02',
        Mar: '03',
        Apr: '04',
        May: '05',
        Jun: '06',
        Jul: '07',
        Aug: '08',
        Sep: '09',
        Oct: '10',
        Nov: '11',
        Dec: '12',
      };

      const getDate = givenStr => {
        const details = givenStr.split(' ');
        return (
          details[2] +
          '-' +
          months[details[1]] +
          '-' +
          (details[0].length == 1 ? '0' : '') +
          details[0]
        );
      };

      const getTime = givenStr => {
        const details = givenStr.split(' ');
        return details[1];
      };

      const contestsList = [];
      const contests = document
        .querySelectorAll('._table__container_1c9os_331')[1]
        .querySelector('tbody')
        .querySelectorAll('tr');

      for (let i = 0; i < contests.length; i++) {
        const data = contests[i].querySelectorAll('td');
        const name = data[1].querySelector('span').innerHTML;
        const url = data[1].querySelector('a').href;

        const dateAndTime = data[2].querySelectorAll('p');
        const date = getDate(dateAndTime[0].innerHTML);
        const time = getTime(dateAndTime[1].innerHTML);

        const duration = data[3].querySelector('p').innerHTML;

        contestsList.push({
          name: name,
          date: date,
          eventType: 'contest',
          eventPlatform: 'codeChef',
          url: url,
          duration: duration,
          time: time,
          featured: false,
        });
      }

      return contestsList;
    });

    return evaluate;
  } catch (err) {
    console.log(err);
  }
};

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */

export const handler = async event => {
  const codeForcesData = await codeForcesScrapping();

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
  const previousEvents = {};

  const filter = {
    filter: {
      eventPlatform: {
        eq: 'codeChef',
      },
    },
  };

  const requestToBeSignedForListing = new HttpRequest({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      host: endpoint.host,
    },
    hostname: endpoint.host,
    body: JSON.stringify({query, variables: filter}),
    path: endpoint.pathname,
  });

  console.log(requestToBeSignedForListing);

  const signedForListing = await signer.sign(requestToBeSignedForListing);
  const requestForListing = new Request(endpoint, signedForListing);

  let responseForListing;

  try {
    responseForListing = await fetch(requestForListing);
    const currBody = await responseForListing.json();
    currBody.data.listEvents.items.forEach(data => {
      previousEvents[data.name] = 1;
    });
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
    codeForcesData.map(async data => {
      if (previousEvents[data.name] === undefined) {
        const variables = {
          input: {
            name: data.name,
            date: data.date,
            eventType: data.eventType,
            eventPlatform: data.eventPlatform,
            url: data.url,
            duration: data.duration,
            time: data.time,
            featured: data.featured,
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

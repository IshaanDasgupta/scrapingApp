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
    await page.goto('https://codeforces.com/contests');

    const evaluateForces = await page.evaluate(() => {
      const contestList = document.querySelector('.contestList');
      const tableRows = contestList
        .querySelector('table')
        .querySelector('tbody')
        .querySelectorAll('tr');

      const contests = [];
      for (let i = 1; i < tableRows.length; i++) {
        const collumnData = tableRows[i].querySelectorAll('td');

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

        const getNum = string => {
          let number = '';
          if (string[0] != '0') {
            number += string[0];
          }
          number += string[1];
          return number;
        };

        const getDuration = string => {
          const values = string.split(':');
          let duration = '';
          duration += getNum(values[0]);
          const mininutes = getNum(values[1]);
          if (mininutes != 0) {
            if (mininutes == '15') {
              duration += '.';
              duration += '.25';
            } else if (mininutes == '30') {
              duration += '.';
              duration += '.5';
            } else if (mininutes == '45') {
              duration += '.';
              duration += '.75';
            }
          }
          duration += ' Hr';
          return duration;
        };

        const getDate = string => {
          const values = string.split('/');
          return values[2] + '-' + months[values[0]] + '-' + values[1];
        };

        const name = collumnData[0].innerText;
        const dateAndTime = collumnData[2].children[0].innerText.split(' ');
        const date = getDate(dateAndTime[0]);
        const time = dateAndTime[1].substr(0, 5);
        const duration = getDuration(collumnData[3].innerText);

        contests.push({
          name: name,
          date: date,
          eventType: 'contest',
          eventPlatform: 'codeForces',
          url: 'https://codeforces.com/contests',
          duration: duration,
          time: time,
          featured: false,
        });
      }
      return contests;
    });

    return evaluateForces;
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
        eq: 'codeForces',
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
      console.log(
        'previous data name :\n',
        previousEvents[data.name],
        ' ',
        data.name,
        '\n',
      );
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

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

    await page.goto('https://leetcode.com/contest/');
    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    });

    await page.waitForTimeout(5000);

    const evaluate = await page.evaluate(async () => {
      const getDate = givenStr => {
        if (givenStr == 'Saturday') {
          return getNextSaturday(new Date());
        }
        return getNextSunday(new Date());
      };

      function getNextSaturday(date = new Date()) {
        const dateCopy = new Date(date.getTime());

        const nextSaturday = new Date(
          dateCopy.setDate(
            dateCopy.getDate() + ((7 - dateCopy.getDay() + 6) % 7) + 1,
          ),
        );

        return nextSaturday.toISOString().substring(0, 10);
      }

      function getNextSunday(date = new Date()) {
        const dateCopy = new Date(date.getTime());

        const nextSunday = new Date(
          dateCopy.setDate(
            dateCopy.getDate() + ((7 - dateCopy.getDay()) % 7) + 1,
          ),
        );

        return nextSunday.toISOString().substring(0, 10);
      }

      const getNum = givenStr => {
        let res = 0;
        let factor = 1;
        for (let i = givenStr.length - 1; i >= 0; i--) {
          res += (givenStr[i] - '0') * factor;
          factor *= 10;
        }
        return res;
      };

      const getTime = givenStr => {
        const details = givenStr.split(' ');
        const timeDetails = details[0].split(':');

        return details[1] == 'PM'
          ? (getNum(timeDetails[0]) + 12).toString() + ':' + timeDetails[1]
          : timeDetails[0].length == 1
          ? '0' + details[0]
          : details[0];
      };

      const eventList = [];

      const events = document.querySelector('.swiper-wrapper').children;

      for (let i = 0; i < events.length; i++) {
        const data = events[i].children[0].children[0];

        const url = 'https://leetcode.com/' + data.getAttribute('href');

        const details = data.children[1].children[0].children;

        const name = details[0].querySelector('span').innerText;

        const dateAndTime = details[1].innerText.split(' ');

        const date = getDate(dateAndTime[0]);
        const time = getTime(dateAndTime[1] + ' ' + dateAndTime[2]);

        eventList.push({
          name: name,
          date: date,
          eventType: 'contest',
          eventPlatform: 'leetcode',
          url: url,
          time: time,
          duration: '2 Hr',
          featured: true,
        });
      }

      return eventList;
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
        eq: 'leetcode',
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

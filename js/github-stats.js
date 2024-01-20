import { githubToken } from '../includes/github-api-token.js';
import { js_beautify } from 'js-beautify';

const endpoint = "https://api.github.com/graphql";
const headers = {
	"content-type": "application/json",
    "Authorization": githubToken
};
const graphqlQuery = {
    "query": `query { user(login: "mjones129") {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              contributionCount
              weekday
              date
            }
          }
        }
      }
    }
  }`,
    "variables": {}
};

const options = {
    "method": "POST",
    "headers": headers,
    "body": JSON.stringify(graphqlQuery)
};

export async function listen() {
  const response = await fetch(endpoint, options);
  const data = await response.json();

  console.log(data.data);
  console.log(data.errors);

  let weeks = JSON.stringify(data.data.user.contributionsCollection.contributionCalendar.weeks);

  document.getElementById('code').innerHTML = js_beautify(weeks); 
}

listen();



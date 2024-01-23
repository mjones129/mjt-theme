import { githubToken } from '../includes/github-api-token.js';
import { js_beautify } from 'js-beautify';
import Chart from 'chart.js/auto';

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

  // console.log(`response: ${response}`);
  // console.log(`data: ${data.data}`);
  // console.log(`errors: ${data.errors}`);
  // console.log(`weeks[0]: ${data.data.user.contributionsCollection.contributionCalendar.weeks[0]}`);

  let string = JSON.stringify(data.data.user.contributionsCollection.contributionCalendar.weeks);
  let weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;

  weeks.forEach(element => {
    let days = element.contributionDays;
    days.forEach(day => {
      // console.log(`Day Loop: ${day.contributionCount}`);
      // console.log(`type of day loop: ${typeof(day)}`);
      let count = day.contributionCount;
      // let output = JSON.stringify(day.contributionCount);
    })
    // console.log(`Type of days: ${typeof(days)}`);
    // console.log(`days: ${days}`);
  })

  // document.getElementById('code').innerHTML = js_beautify(output); 

  // console.log(`type of weeks[0]: ${typeof(data.data.user.contributionsCollection.contributionCalendar.weeks[0])}`);
  // console.log(`weeks length: ${weeks.length}`);
      return weeks;
}

// const githubData = listen();
//
// const ctx = document.getElementById('chart');
// new Chart(ctx, {
//     type: 'bar',
//     data: {
//       // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
//       datasets: [{
//         label: '# of Votes',
//         data: githubData[0],
//         borderWidth: 1
//       }]
//     },
//     options: {
//       parsing: {
//         x: {
//         xAxisKey: githubData 
//         }
//       }
//     }
//   });
// const cfg = {
//   type: 'bar',
//}
//
let weeks = await listen();

weeks.forEach(element => {
    let days = element.contributionDays;
    days.forEach(day => {
      console.log(`Day Loop: ${day.contributionCount}`);
      console.log(`type of day loop: ${typeof(day)}`);
      let count = day.contributionCount;
      // document.getElementById('code').innerHTML = js_beautify(day.contributionCount);
      // let output = JSON.stringify(day.contributionCount);
    })
    console.log(`Type of days: ${typeof(days)}`);
    console.log(`days: ${days}`);
  })

new Chart(document.getElementById('chart'),
  {
    type: 'bar',
    datasets: [
      {
        label: 'contribution weeks',
        data: weeks 
      }
    ]
  },
  {
    options: {}
  }
);


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


  let string = JSON.stringify(data.data.user.contributionsCollection.contributionCalendar.weeks);
  let weeks = data.data.user.contributionsCollection.contributionCalendar.weeks;

  weeks.forEach(element => {
    let days = element.contributionDays;
    days.forEach(day => {
      let count = day.contributionCount;
    })
  })

  // document.getElementById('code').innerHTML = js_beautify(output); 

  // console.log(`type of weeks[0]: ${typeof(data.data.user.contributionsCollection.contributionCalendar.weeks[0])}`);
  // console.log(`weeks length: ${weeks.length}`);
      return weeks;
}


let weeks = await listen();

let chartData = [];

weeks.forEach(element => {
    let days = element.contributionDays;
    days.forEach(day => {
      // console.log(`Day Loop: ${day.contributionCount}`);
      // console.log(`type of day loop: ${typeof(day)}`);
      let count = day.contributionCount;
      // let output = JSON.stringify(day.contributionCount);
      chartData.push(count);
    })
    // console.log(`Type of days: ${typeof(days)}`);
    // console.log(`days: ${days}`);
    
  })

console.log(`Chart Data: ${chartData}`);

const ctx = document.getElementById('chart');

  new Chart(ctx, {
  type: 'bar',
    data: {
      labels: chartData,
      datasets: [{
        label: '# of GitHub Commits In The Last Year',
        data: chartData,
        borderWidth: 1,
        backgroundColor: '#fcba03',
        borderColor: '#fcba03'
      }]
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Last 365 Days'
        },
          grid: {
            color: '#3b3b3b'
        }
       },
        y: {
          title: {
            display: true,
            text: 'Number of Commits'
        },
          grid: {
            color: '#3b3b3b'
        }
      }
      } 
    }
  });

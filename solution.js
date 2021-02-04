import { promises as fs } from 'fs';
import bent from 'bent';
const getJSON = bent('json')

const cache = 'data.json';

function saveInitialCache() {
  getJSON('http://localhost:3000/api/top')
    .then(res => fs.writeFile(cache, JSON.stringify(res)));
}

function compare(old, nu) {
  const op = old.reduce((acc, cur) => {})
}

function compareToAPI(fileData) {
  getJSON('http://localhost:3000/api/top')
    .then(live => compare(fileData, live));
}

function main() {
  fs.readFile(cache)
    .then(JSON.parse)
    .then(console.log)
    .catch(() => getJSON('http://localhost:3000/api/top')
      .then(saveInitialCache)
    );
}

main();
import adjectives from './adjectives.js';
import http from 'http';

const hostname = '127.0.0.1';
const port = 3000;

function getRandomSelection(arr, size) {
  const shuffled = arr.slice(0);
  let i = arr.length
  while (i--) {
      const index = Math.floor((i + 1) * Math.random());
      const temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
}

function randInt(n) {
  return Math.floor(Math.random() * n) + 1;
}

function leaderboardFromPlayerPoints(playerPoints) {
  return Object.entries(playerPoints)
    .reduce((acc, cur) => {
      acc.push({
        id: cur[0],
        score: randInt(1000) * cur[1]
      })
      return acc;
    }, []).sort((a, b) => b.score - a.score)
    .map((entry, i) => ({...entry, pos: i + 1}))
}

const getScores = () => {
  const players = getRandomSelection(adjectives, adjectives.length)
    .map(adj => `${adj} player`);

  const playerPoints = players
    .reduce((acc, cur, i) => {
      acc[cur] = players.length - i;
      return acc;
    }, {})

  return () => {
    const leaderboard = leaderboardFromPlayerPoints(playerPoints);

    const improvers = getRandomSelection(players.slice(0, 100), randInt(8));
    const newPlayers = getRandomSelection(players.slice(100), randInt(4));
    for (const player of improvers) {
      const currentRanking = leaderboard.findIndex(entry => entry.id === player) + 1;
      const rankingImprovement = randInt(currentRanking-1);
      const targetRanking = currentRanking - rankingImprovement;
      const scoreToBeat = leaderboard[targetRanking].score;
      const scoreLimit = targetRanking !== 0 ? leaderboard[targetRanking - 1].score : leaderboard[0].score + 10;
      const scoreChange = randInt(scoreLimit - (scoreToBeat - playerPoints[player]));
      playerPoints[player] += scoreChange;
    }

    for (const player of newPlayers) {
      const targetRanking = randInt(100);
      const scoreToBeat = leaderboard[targetRanking - 1].score;
      const scoreLimit = targetRanking !== 1 ? leaderboard[targetRanking - 2].score : leaderboard[0] + 10;
      const score = randInt(scoreLimit - scoreToBeat) + scoreToBeat;
      playerPoints[player] = score;
    }

    return leaderboardFromPlayerPoints(playerPoints).slice(0, 100);
  }
}

const getLeaderboard = getScores();

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.write(JSON.stringify(getLeaderboard()))
  res.end();
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
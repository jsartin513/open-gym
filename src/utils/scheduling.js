function generateRoundRobinSchedule(teamNames) {
  const numTeams = teamNames.length;
  const isOdd = numTeams % 2 !== 0;
  const teamsWithBye = isOdd ? [...teamNames, "Bye"] : teamNames;
  const totalTeams = teamsWithBye.length;
  const rounds = totalTeams - 1;
  const halfSize = Math.floor(totalTeams / 2);

  const matches = [];

  for (let round = 0; round < rounds; round++) {
    for (let i = 0; i < halfSize; i++) {
      const home = teamsWithBye[i];
      const away = teamsWithBye[totalTeams - 1 - i];
      if (home !== "Bye" && away !== "Bye") {
        matches.push({ homeTeam: home, awayTeam: away });
      }
    }
    teamsWithBye.splice(1, 0, teamsWithBye.pop());
  }

  // Generate reverse matches for home and away
  const reverseMatches = matches.map((match) => ({
    homeTeam: match.awayTeam,
    awayTeam: match.homeTeam,
  }));

  return [...matches, ...reverseMatches];
}

function generateRotatingSchedule(teamNames) {
  const numTeams = teamNames.length;
  const rounds = numTeams;
  const matches = [];

  let teams = [...teamNames];
  let sittingTeams = [];

  for (let round = 0; round < rounds; round++) {
    const roundMatches = [];

    // Rotate teams
    const awayTeam = teams.shift();
    const homeTeam = teams[0];
    sittingTeams.push(awayTeam);

    // Create match
    roundMatches.push({ homeTeam, awayTeam });

    // Rotate sitting teams
    if (sittingTeams.length > 1) {
      const nextHomeTeam = sittingTeams.shift();
      teams.push(nextHomeTeam);
    }

    // Add remaining teams back to the list
    teams.push(awayTeam);

    // Add round matches to the schedule
    matches.push(...roundMatches);
  }

  return matches;
}

// Each game has a home team, away team, and a ref.
// Produce some games with refs
function generateGamesWithRefs(teamNames) {
  const numTeams = teamNames.length;
  const rounds = numTeams;
  const games = [];

  let teams = [...teamNames];
  let sittingTeams = [];

  for (let round = 0; round < rounds; round++) {
    const roundGames = [];

    // Rotate teams
    const awayTeam = teams.shift();
    const homeTeam = teams[0];
    const reffingTeam = teams[1];
    sittingTeams.push(awayTeam);

    // Create game
    roundGames.push({ homeTeam, awayTeam, ref: reffingTeam });

    // Rotate sitting teams
    if (sittingTeams.length > 1) {
      const nextReffingTeam = sittingTeams.shift();
      teams.push(nextReffingTeam);
    }

    // Add remaining teams back to the list
    teams.push(awayTeam);
    teams.push(homeTeam);

    // Add round games to the schedule
    games.push(...roundGames);
  }

  return games;
}

// Generate a tournament schedule with a specified number of games per team
// and a specified number of courts available
// Each game has a home team, away team, and a ref. 
// A court hosts one game per round.
// In each round, a team can only be involved in one game.
function generateTournamentSchedule(teamNames){
  const numTeams = teamNames.length;
  const numCourtsAvailable = 3;
  const numGamesPerTeam = 5;
  // Groups of 4 rounds with 3 courts gives us enough combinations to play enough games without repeating teams
  const numRoundsInBlock = 4;

  // The first round has teams 1 and 2 through 5 and 6 playing
  // The second round has teams 7 and 8 through 11 and 12 playing
  // The third round has odd numbered teams matched up against each other
  // 1 and 3, 5 and 7, 9 and 11
  // The fourth round has even numbered teams matched up against each other
  // 2 and 4, 6 and 8, 10 and 12

  const firstRound = [];
  const secondRound = [];
  const thirdRound = [];
  const fourthRound = [];

  let startTeam = 0;
  for (let i = startTeam; i < numCourtsAvailable * 2; i=i+2) {
    const homeTeam = teamNames[i];
    const awayTeam = teamNames[i + 1];
    firstRound.push({ homeTeam, awayTeam });
  }
  console.log(firstRound);

  startTeam = numCourtsAvailable * 2;
  for (let i = startTeam; i < numCourtsAvailable * 4; i=i+2) {
    const homeTeam = teamNames[i];
    const awayTeam = teamNames[i + 1];
    secondRound.push({ homeTeam, awayTeam });
  }
  console.log(secondRound);

  startTeam = 0;
  for (let i = startTeam; i < numCourtsAvailable * 3; i=i+4){
    const homeTeam = teamNames[i];
    const awayTeam = teamNames[i + 2];
    thirdRound.push({ homeTeam, awayTeam });
  }
  console.log(thirdRound)

  startTeam = 1;
  for (let i = startTeam; i <= numCourtsAvailable * 3; i=i+4){
    const homeTeam = teamNames[i];
    const awayTeam = teamNames[i + 2];
    fourthRound.push({ homeTeam, awayTeam });
  }

  console.log(fourthRound)

  // Fifth and sixth rounds



  return [firstRound];

}

export { generateRoundRobinSchedule, generateRotatingSchedule, generateGamesWithRefs, generateTournamentSchedule };
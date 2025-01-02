function generateRoundRobinSchedule(teamNames) {
  const numTeams = teamNames.length;
  const isOdd = numTeams % 2 !== 0;
  const teamsWithBye = isOdd ? [...teamNames, 'Bye'] : teamNames;
  const totalTeams = teamsWithBye.length;
  const rounds = totalTeams - 1;
  const halfSize = Math.floor(totalTeams / 2);

  const matches = [];

  for (let round = 0; round < rounds; round++) {
    for (let i = 0; i < halfSize; i++) {
      const home = teamsWithBye[i];
      const away = teamsWithBye[totalTeams - 1 - i];
      if (home !== 'Bye' && away !== 'Bye') {
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
    const homeTeam = teams[0]
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
function generateGamesWithRefs(teamNames){
  const numTeams = teamNames.length;
  const rounds = numTeams;
  const games = [];

  let teams = [...teamNames];
  let sittingTeams = [];

  for (let round = 0; round < rounds; round++) {
    const roundGames = [];

    // Rotate teams
    const awayTeam = teams.shift();
    const homeTeam = teams[0]
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
    teams.push(homeTeam)

    // Add round games to the schedule
    games.push(...roundGames);
  }

  return games;


}

// A game has a home team, an away team, a reffing team, a court number, and a round number.
// Each team will play numGamesPerTeam games.
// We have numCourts courts available. 
// We'll know how many rounds we need based on the fitting the number of 
// games each plays onto courts
// Each team can only play one game per round.
// Each court can only hold one game per round
function generateMultiCourtSchedule(numTeams, numCourts, numGamesPerTeam) {
  const numGames = numTeams * numGamesPerTeam / 2;
  const rounds = Math.ceil(numGames / numCourts);
  const teamNames = Array.from({ length: numTeams }, (_, i) => `Team ${i + 1}`);
  const schedule = [];

  const allGames = generateRotatingSchedule(teamNames);
  // fit games into rounds by court
  // ensuring that no team can be in two games in the same round
  for (let round = 0; round < rounds; round++) {
    const roundGames = allGames.slice(round * numCourts, (round + 1) * numCourts);
    for (let i = 0; i < roundGames.length; i++) {
      const game = roundGames[i];
      schedule.push({ ...game, court: i + 1, round });
    }
  }

  return schedule;
}

export { generateRoundRobinSchedule, generateRotatingSchedule, generateGamesWithRefs, generateMultiCourtSchedule };
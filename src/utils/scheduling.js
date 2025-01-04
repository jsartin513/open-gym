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

function canTeamPlayThisRound(teamName, gamesInRound)  {
  return gamesInRound.every(game => game.homeTeam !== teamName && game.awayTeam !== teamName && game.ref !== teamName);
}

// A game has a home team, an away team, a reffing team, a court number, and a round number.
// Each team will play numGamesPerTeam games.
// We have numCourts courts available.
// We'll know how many rounds we need based on the fitting the number of
// games each plays onto courts
// Each team can only play one game per round.
// Each court can only hold one game per round
function generateMultiCourtSchedule(teamNames, numCourts, numGamesPerTeam) {
  const allGames = generateGamesWithRefs(teamNames);  // Your existing function
  const numTeams = teamNames.length;
  const totalGamesNeeded = (numTeams * numGamesPerTeam) / 2;
  const games = [];

  for (let round = 1; games.length < totalGamesNeeded; round++) {
    const roundGames = [];
    const teamsPlayingThisRound = new Set();

    for (let court = 1; court <= numCourts && allGames.length > 0; court++) {
      let game = allGames.shift();
      let attempts = 0;

      while (
        attempts < numCourts + 1 &&  // Prevent infinite loop if no valid game is found
        (teamsPlayingThisRound.has(game.homeTeam) ||
          teamsPlayingThisRound.has(game.awayTeam) ||
          teamsPlayingThisRound.has(game.ref))
      ) {
        allGames.push(game); // Put the game back at the end
        game = allGames.shift();
        attempts++;
      }

      if (attempts < allGames.length + 1) { // A valid game was found
        game.court = court;
        game.round = round;
        roundGames.push(game);
        teamsPlayingThisRound.add(game.homeTeam);
        teamsPlayingThisRound.add(game.awayTeam);
        teamsPlayingThisRound.add(game.ref);
      }
    }

    games.push(...roundGames);
  }

  return games;
}

export {
  generateRoundRobinSchedule,
  generateRotatingSchedule,
  generateGamesWithRefs,
  generateMultiCourtSchedule,
};

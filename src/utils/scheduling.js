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
function generateTournamentSchedule(teamNames, numberOfRounds, numCourtsAvailable) {
    if (!numCourtsAvailable) {
        numCourtsAvailable = 3;
    }
    const initialRounds = [];

    // Helper function to generate initial rounds (same as before)
    function generateInitialRound(startTeam, increment) {
        const round = [];
        for (let i = startTeam; round.length < numCourtsAvailable; i += increment) {
            const homeTeam = teamNames[i];
            const awayTeam = teamNames[i + increment / 2];
            if (awayTeam) {
                round.push({ homeTeam, awayTeam });
            }
        }
        return round;
    }

    initialRounds.push(generateInitialRound(0, 2));
    initialRounds.push(generateInitialRound(6, 2));
    initialRounds.push(generateInitialRound(0, 4));
    initialRounds.push(generateInitialRound(1, 4));

    let rounds = [...initialRounds];

    function generateShiftedRound(round, increment) {
        const shiftedRound = [];
        for (let i = 0; i < round.length; i++) {
            const homeTeamIndex = i;
            const awayTeamIndex = (i + increment) % round.length;
          
            const homeTeam = round[homeTeamIndex].homeTeam;
            const awayTeam = round[awayTeamIndex].awayTeam;
            shiftedRound.push({ homeTeam, awayTeam });
        }
        return shiftedRound;
    }

    for (let i = 0; i < numberOfRounds - 4; i++) {
        const round = rounds[i];
        const shiftedRound = generateShiftedRound(round, 1);
        rounds.push(shiftedRound);
    }

    return rounds.slice(0, numberOfRounds);
}




export { generateRoundRobinSchedule, generateRotatingSchedule, generateGamesWithRefs, generateTournamentSchedule };
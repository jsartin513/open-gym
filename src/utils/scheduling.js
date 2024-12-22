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

export { generateRoundRobinSchedule, generateRotatingSchedule };
function generateSchedule(teamNames) {
  const numTeams = teamNames.length;
  const isOdd = numTeams % 2 !== 0;
  const teamsWithBye = isOdd ? [...teamNames, 'Bye'] : teamNames;
  const totalTeams = teamsWithBye.length;
  const rounds = totalTeams - 1;
  const halfSize = totalTeams / 2;

  const schedule = [];
  const backSchedule = [];

  for (let round = 0; round < rounds; round++) {
    const roundMatches = [];
    const backRoundMatches = [];
    for (let i = 0; i < halfSize; i++) {
      const home = teamsWithBye[i];
      const away = teamsWithBye[totalTeams - 1 - i];
      if (home !== 'Bye' && away !== 'Bye') {
        roundMatches.push({ homeTeam: home, awayTeam: away });
        backRoundMatches.push({ homeTeam: away, awayTeam: home });
      }
    }
    schedule.push(...roundMatches);
    backSchedule.push(...backRoundMatches);
    teamsWithBye.splice(1, 0, teamsWithBye.pop());
  }

  return [...schedule, ...backSchedule];
};

export { generateSchedule };
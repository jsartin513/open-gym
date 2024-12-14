const generateSchedule = (teams) => {
    const numTeams = teams.length;
    const rounds = numTeams - 1;
    const halfSize = numTeams / 2;

    const teamIndexes = teams.map((_, i) => i + 1);
    const newSchedule = [];

    for (let round = 0; round < rounds; round++) {
      const roundMatches = [];
      for (let i = 0; i < halfSize; i++) {
        const home = teamIndexes[i];
        const away = teamIndexes[numTeams - 1 - i];
        roundMatches.push({ homeTeam: `Team ${home}`, awayTeam: `Team ${away}` });
      }
      newSchedule.push(...roundMatches);

      // Rotate teams
      teamIndexes.splice(1, 0, teamIndexes.pop());
    }

    const reversedNewSchedule = newSchedule.map(({ homeTeam, awayTeam }) => ({ homeTeam: awayTeam, awayTeam: homeTeam }));

    return newSchedule.concat(reversedNewSchedule);
    
  };

  export { generateSchedule };
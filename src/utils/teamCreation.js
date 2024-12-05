const distributePlayersBySnake = (playersSkillOrdered, numTeams) => {
  const teams = Array.from({ length: numTeams }, () => []);
  let descending = false;
  playersSkillOrdered.forEach((player, index) => {
    const playerTeam = descending
      ? numTeams - (index % numTeams) - 1
      : index % numTeams;
    teams[playerTeam].push(player);
    if (
      (descending && playerTeam === 0) ||
      (!descending && playerTeam === numTeams - 1)
    ) {
      descending = !!!descending;
    }
  });
  return teams;
};

const distributePlayersInOrder = (playersSkillOrdered, numTeams) => {
  const teams = Array.from({ length: numTeams }, () => []);
  playersSkillOrdered.forEach((player, index) => {
    const playerTeam = index % numTeams;
    teams[playerTeam].push(player);
  });
  return teams;
};

export { distributePlayersBySnake, distributePlayersInOrder };

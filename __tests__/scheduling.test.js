import {
  generateRoundRobinSchedule,
  generateRotatingSchedule,
  generateGamesWithRefs,
  generateTournamentSchedule,
} from "../src/utils/scheduling";

const THREE_TEAMS = ["Team 1", "Team 2", "Team 3"];
const FOUR_TEAMS = ["Team 1", "Team 2", "Team 3", "Team 4"];
const FIVE_TEAMS = ["Team 1", "Team 2", "Team 3", "Team 4", "Team 5"];
const SIX_TEAMS = ["Team 1", "Team 2", "Team 3", "Team 4", "Team 5", "Team 6"];
const TWELVE_TEAMS = ["Team 1", "Team 2", "Team 3", "Team 4", "Team 5", "Team 6", "Team 7", "Team 8", "Team 9", "Team 10", "Team 11", "Team 12"];

describe("generateRotatingSchedule", () => {
  test("generates schedule for 4 teams", () => {
    const teams = FOUR_TEAMS;
    const schedule = generateRotatingSchedule(teams);

    const expectedSchedule = [
      { homeTeam: "Team 2", awayTeam: "Team 1" },
      { homeTeam: "Team 3", awayTeam: "Team 2" },
      { homeTeam: "Team 4", awayTeam: "Team 3" },
      { homeTeam: "Team 1", awayTeam: "Team 4" },
    ];

    expect(schedule).toEqual(expectedSchedule);
  });

  test("generates schedule for 3 teams", () => {
    const teams = THREE_TEAMS;
    const schedule = generateRotatingSchedule(teams);

    const expectedSchedule = [
      { homeTeam: "Team 2", awayTeam: "Team 1" },
      { homeTeam: "Team 3", awayTeam: "Team 2" },
      { homeTeam: "Team 1", awayTeam: "Team 3" },
    ];

    expect(schedule).toEqual(expectedSchedule);
  });

  test("generates schedule for 5 teams", () => {
    const teams = FIVE_TEAMS;
    const schedule = generateRotatingSchedule(teams);

    const expectedSchedule = [
      { homeTeam: "Team 2", awayTeam: "Team 1" },
      { homeTeam: "Team 3", awayTeam: "Team 2" },
      { homeTeam: "Team 4", awayTeam: "Team 3" },
      { homeTeam: "Team 5", awayTeam: "Team 4" },
      { homeTeam: "Team 1", awayTeam: "Team 5" },
    ];

    expect(schedule).toEqual(expectedSchedule);
  });
});
describe("generateRoundRobinSchedule", () => {
  test("should generate the correct number of rounds for 4 teams", () => {
    const teams =FOUR_TEAMS;
    const schedule = generateRoundRobinSchedule(teams);
    expect(schedule.length).toBe(12); // 6 matches for 4 teams (3 rounds) + 6 reversed matches
  });

  test("should generate the correct matches for 4 teams", () => {
    const teams =FOUR_TEAMS;
    const schedule = generateRoundRobinSchedule(teams);
    const expectedSchedule = [
      { homeTeam: "Team 1", awayTeam: "Team 4" },
      { homeTeam: "Team 2", awayTeam: "Team 3" },
      { homeTeam: "Team 1", awayTeam: "Team 3" },
      { homeTeam: "Team 4", awayTeam: "Team 2" },
      { homeTeam: "Team 1", awayTeam: "Team 2" },
      { homeTeam: "Team 3", awayTeam: "Team 4" },
      { homeTeam: "Team 4", awayTeam: "Team 1" },
      { homeTeam: "Team 3", awayTeam: "Team 2" },
      { homeTeam: "Team 3", awayTeam: "Team 1" },
      { homeTeam: "Team 2", awayTeam: "Team 4" },
      { homeTeam: "Team 2", awayTeam: "Team 1" },
      { homeTeam: "Team 4", awayTeam: "Team 3" },
    ];
    expect(schedule).toEqual(expectedSchedule);
  });

  test("should generate the correct number of rounds for 6 teams", () => {
    const teams = SIX_TEAMS;
    const schedule = generateRoundRobinSchedule(teams);
    expect(schedule.length).toBe(30); // 15 matches for 6 teams (5 rounds) + 15 reversed matches
  });

  test("should generate the correct matches for 6 teams", () => {
    const teams = SIX_TEAMS;
    const schedule = generateRoundRobinSchedule(teams);
    const expectedSchedule = [
      { homeTeam: "Team 1", awayTeam: "Team 6" },
      { homeTeam: "Team 2", awayTeam: "Team 5" },
      { homeTeam: "Team 3", awayTeam: "Team 4" },
      { homeTeam: "Team 1", awayTeam: "Team 5" },
      { homeTeam: "Team 6", awayTeam: "Team 4" },
      { homeTeam: "Team 2", awayTeam: "Team 3" },
      { homeTeam: "Team 1", awayTeam: "Team 4" },
      { homeTeam: "Team 5", awayTeam: "Team 3" },
      { homeTeam: "Team 6", awayTeam: "Team 2" },
      { homeTeam: "Team 1", awayTeam: "Team 3" },
      { homeTeam: "Team 4", awayTeam: "Team 2" },
      { homeTeam: "Team 5", awayTeam: "Team 6" },
      { homeTeam: "Team 1", awayTeam: "Team 2" },
      { homeTeam: "Team 3", awayTeam: "Team 6" },
      { homeTeam: "Team 4", awayTeam: "Team 5" },
      { homeTeam: "Team 6", awayTeam: "Team 1" },
      { homeTeam: "Team 5", awayTeam: "Team 2" },
      { homeTeam: "Team 4", awayTeam: "Team 3" },
      { homeTeam: "Team 5", awayTeam: "Team 1" },
      { homeTeam: "Team 4", awayTeam: "Team 6" },
      { homeTeam: "Team 3", awayTeam: "Team 2" },
      { homeTeam: "Team 4", awayTeam: "Team 1" },
      { homeTeam: "Team 3", awayTeam: "Team 5" },
      { homeTeam: "Team 2", awayTeam: "Team 6" },
      { homeTeam: "Team 3", awayTeam: "Team 1" },
      { homeTeam: "Team 2", awayTeam: "Team 4" },
      { homeTeam: "Team 6", awayTeam: "Team 5" },
      { homeTeam: "Team 2", awayTeam: "Team 1" },
      { homeTeam: "Team 6", awayTeam: "Team 3" },
      { homeTeam: "Team 5", awayTeam: "Team 4" },
    ];
    expect(schedule).toEqual(expectedSchedule);
  });

  test("should generate the correct number of rounds for 3 teams", () => {
    const teams = THREE_TEAMS;
    const schedule = generateRoundRobinSchedule(teams);
    expect(schedule.length).toBe(6); // 6 matches for 4 teams (3 rounds) + 6 reversed matches
  });

  test("should generate the correct matches 3 teams", () => {
    const teams = THREE_TEAMS;
    const schedule = generateRoundRobinSchedule(teams);
    const expectedSchedule = [
      { homeTeam: "Team 2", awayTeam: "Team 3" },
      { homeTeam: "Team 1", awayTeam: "Team 3" },
      { homeTeam: "Team 1", awayTeam: "Team 2" },
      { homeTeam: "Team 3", awayTeam: "Team 2" },
      { homeTeam: "Team 3", awayTeam: "Team 1" },
      { homeTeam: "Team 2", awayTeam: "Team 1" },
    ];
    expect(schedule).toEqual(expectedSchedule);
  });
});

describe("generateGamesWithRefs", () => {
  test("should generate the correct number of games for 4 teams", () => {
    const games = generateGamesWithRefs(FOUR_TEAMS);
    expect(games.length).toBe(4); // 4 teams * 2 game per team = 4 games
  });
  test("should generate the correct games for 4 teams", () => {
    const games = generateGamesWithRefs(FOUR_TEAMS);
    const expectedGames = [
      { homeTeam: "Team 2", awayTeam: "Team 1", ref: "Team 3" },
      { homeTeam: "Team 3", awayTeam: "Team 2", ref: "Team 4" },
      { homeTeam: "Team 4", awayTeam: "Team 3", ref: "Team 1" },
      { homeTeam: "Team 1", awayTeam: "Team 4", ref: "Team 2" },
    ];
    expect(games).toEqual(expectedGames);
  });

  test("should generate the correct number of games for 6 teams", () => {
    const games = generateGamesWithRefs(SIX_TEAMS);
    expect(games.length).toBe(6); // 6 teams * 2 game per team = 6 games
  });
  test("should generate the correct games for 6 teams", () => {
    const games = generateGamesWithRefs(SIX_TEAMS);
    const expectedGames = [
      { homeTeam: "Team 2", awayTeam: "Team 1", ref: "Team 3" },
      { homeTeam: "Team 3", awayTeam: "Team 2", ref: "Team 4" },
      { homeTeam: "Team 4", awayTeam: "Team 3", ref: "Team 5" },
      { homeTeam: "Team 5", awayTeam: "Team 4", ref: "Team 6" },
      { homeTeam: "Team 6", awayTeam: "Team 5", ref: "Team 1" },
      { homeTeam: "Team 1", awayTeam: "Team 6", ref: "Team 2" },
    ];
    expect(games).toEqual(expectedGames);
  });

  test("should generate the correct number of games for 3 teams", () => {
    const games = generateGamesWithRefs(THREE_TEAMS);
    expect(games.length).toBe(3); // 3 teams * 2 game per team = 3 games
  });
  test("should generate the correct games for 3 teams", () => {
    const games = generateGamesWithRefs(THREE_TEAMS);
    const expectedGames = [
      { homeTeam: "Team 2", awayTeam: "Team 1", ref: "Team 3" },
      { homeTeam: "Team 3", awayTeam: "Team 2", ref: "Team 1" },
      { homeTeam: "Team 1", awayTeam: "Team 3", ref: "Team 2" },
    ];
    expect(games).toEqual(expectedGames);
  });

});
// describe("generateMultiCourtSchedule", () => {
//   test("should generate the correct number of rounds for 3 teams, 1 courts, 2 games per team", () => {
//     const schedule = generateMultiCourtSchedule(THREE_TEAMS, 1, 2);
//     expect(schedule.length).toBe(3); // 3 teams * 2 games per team / 2 teams per game = 3 games
//   });

//   test("should generate the correct matches for 3 teams, 1 courts, 2 games per team", () => {
//     const schedule = generateMultiCourtSchedule(THREE_TEAMS, 1, 2);
//     const expectedSchedule = [
//       { homeTeam: "Team 2", awayTeam: "Team 1", ref: "Team 3", court: 1, round: 1 },
//       { homeTeam: "Team 3", awayTeam: "Team 2", ref: "Team 1", court: 1, round: 2 },
//       { homeTeam: "Team 1", awayTeam: "Team 3", ref: "Team 2", court: 1, round: 3 },
//     ];
//     expect(schedule).toEqual(expectedSchedule);
//   });

//   test("should generate the correct number of rounds for 6 teams, 2 courts, 2 games per team", () => {
//     const schedule = generateMultiCourtSchedule(SIX_TEAMS, 2, 2);
//     expect(schedule.length).toBe(6); // 3 teams * 2 games per team / 2 teams per game = 3 games
//   });

//   test("should generate the correct matches for 6 teams, 2 courts, 2 games per team", () => {
//     const schedule = generateMultiCourtSchedule(SIX_TEAMS, 2, 2);
//     const expectedSchedule = [
//       { homeTeam: "Team 2", awayTeam: "Team 1", ref: "Team 3", court: 1, round: 1 },
//       { homeTeam: "Team 5", awayTeam: "Team 4", ref: "Team 6", court: 2, round: 1 },
//       { homeTeam: "Team 6", awayTeam: "Team 5", ref: "Team 1", court: 1, round: 2 },
//       { homeTeam: "Team 3", awayTeam: "Team 2", ref: "Team 4", court: 2, round: 2 },
//       { homeTeam: "Team 4", awayTeam: "Team 3", ref: "Team 5", court: 1, round: 3 },
//       { homeTeam: "Team 1", awayTeam: "Team 6", ref: "Team 2", court: 2, round: 3 },
//     ];
//     expect(schedule).toEqual(expectedSchedule);
//   });
//   test("should generate the correct number of rounds for 12 teams, 2 courts, 2 games per team", () => {
//     const schedule = generateMultiCourtSchedule(TWELVE_TEAMS, 2, 2);
//     expect(schedule.length).toBe(12); // 12 teams * 2 games per team / 2 teams per game = 12 games
//   });

//   test("should generate the correct number of rounds for 12 teams, 2 courts, 4 games per team", () => {
//     const schedule = generateMultiCourtSchedule(TWELVE_TEAMS, 2, 4);
//     expect(schedule.length).toBe(24); // 12 teams * 4 games per team / 2 teams per game = 24 games
//   });

// });

describe.only("generateTournamentSchedule", () => {
  test("should generate the correct number of rounds for 4 teams, 2 games per team, 3 court2", () => {
    const roundsList = generateTournamentSchedule(TWELVE_TEAMS);
    expect(roundsList.length).toBe(4); // 4 rounds kinda hardcoded
  });

  test("should generate the correct number of games per round (3)", () => {
    const roundsList = generateTournamentSchedule(TWELVE_TEAMS);
    expect(roundsList[0].length).toBe(3); // 3 courts
  }
  );

  test("should generate the correct games for 4 teams, 2 games per team, 3 courts", () => {
    const roundsList = generateTournamentSchedule(TWELVE_TEAMS);
    const expectedRoundsList = [
      [
        { homeTeam: 'Team 1', awayTeam: 'Team 2' },
        { homeTeam: 'Team 3', awayTeam: 'Team 4' },
        { homeTeam: 'Team 5', awayTeam: 'Team 6' }
      ],
      [
        { homeTeam: 'Team 7', awayTeam: 'Team 8' },
        { homeTeam: 'Team 9', awayTeam: 'Team 10' },
        { homeTeam: 'Team 11', awayTeam: 'Team 12' }
      ],
      [
        { homeTeam: 'Team 1', awayTeam: 'Team 3' },
        { homeTeam: 'Team 5', awayTeam: 'Team 7' },
        { homeTeam: 'Team 9', awayTeam: 'Team 11' }
      ],
      [
        { homeTeam: 'Team 2', awayTeam: 'Team 4' },
        { homeTeam: 'Team 6', awayTeam: 'Team 8' },
        { homeTeam: 'Team 10', awayTeam: 'Team 12' }
      ]]
    expect(roundsList).toEqual(expectedRoundsList);
  });

  

});

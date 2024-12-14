import { generateSchedule } from '../src/utils/scheduling';

// FILE: /Users/jessica.sartin/github_development/open-gym/__tests__/scheduling.test.js

describe('generateSchedule', () => {
    test('should generate the correct number of rounds for 4 teams', () => {
        const teams = ['Team 1', 'Team 2', 'Team 3', 'Team 4'];
        const schedule = generateSchedule(teams);
        expect(schedule.length).toBe(12); // 6 matches for 4 teams (3 rounds) + 6 reversed matches
    });

    test('should generate the correct matches for 4 teams', () => {
        const teams = ['Team 1', 'Team 2', 'Team 3', 'Team 4'];
        const schedule = generateSchedule(teams);
        const expectedSchedule = [
            { homeTeam: 'Team 1', awayTeam: 'Team 4' },
            { homeTeam: 'Team 2', awayTeam: 'Team 3' },
            { homeTeam: 'Team 1', awayTeam: 'Team 3' },
            { homeTeam: 'Team 4', awayTeam: 'Team 2' },
            { homeTeam: 'Team 1', awayTeam: 'Team 2' },
            { homeTeam: 'Team 3', awayTeam: 'Team 4' },
            { homeTeam: 'Team 4', awayTeam: 'Team 1' },
            { homeTeam: 'Team 3', awayTeam: 'Team 2' },
            { homeTeam: 'Team 3', awayTeam: 'Team 1' },
            { homeTeam: 'Team 2', awayTeam: 'Team 4' },
            { homeTeam: 'Team 2', awayTeam: 'Team 1' },
            { homeTeam: 'Team 4', awayTeam: 'Team 3' },
        ];
        expect(schedule).toEqual(expectedSchedule);
    });

    test('should generate the correct number of rounds for 6 teams', () => {
        const teams = ['Team 1', 'Team 2', 'Team 3', 'Team 4', 'Team 5', 'Team 6'];
        const schedule = generateSchedule(teams);
        expect(schedule.length).toBe(30); // 15 matches for 6 teams (5 rounds) + 15 reversed matches
    });

    test('should generate the correct matches for 6 teams', () => {
        const teams = ['Team 1', 'Team 2', 'Team 3', 'Team 4', 'Team 5', 'Team 6'];
        const schedule = generateSchedule(teams);
        const expectedSchedule = [
            { homeTeam: 'Team 1', awayTeam: 'Team 6' },
            { homeTeam: 'Team 2', awayTeam: 'Team 5' },
            { homeTeam: 'Team 3', awayTeam: 'Team 4' },
            { homeTeam: 'Team 1', awayTeam: 'Team 5' },
            { homeTeam: 'Team 6', awayTeam: 'Team 4' },
            { homeTeam: 'Team 2', awayTeam: 'Team 3' },
            { homeTeam: 'Team 1', awayTeam: 'Team 4' },
            { homeTeam: 'Team 5', awayTeam: 'Team 3' },
            { homeTeam: 'Team 6', awayTeam: 'Team 2' },
            { homeTeam: 'Team 1', awayTeam: 'Team 3' },
            { homeTeam: 'Team 4', awayTeam: 'Team 2' },
            { homeTeam: 'Team 5', awayTeam: 'Team 6' },
            { homeTeam: 'Team 1', awayTeam: 'Team 2' },
            { homeTeam: 'Team 3', awayTeam: 'Team 6' },
            { homeTeam: 'Team 4', awayTeam: 'Team 5' },
            { homeTeam: 'Team 6', awayTeam: 'Team 1' },
            { homeTeam: 'Team 5', awayTeam: 'Team 2' },
            { homeTeam: 'Team 4', awayTeam: 'Team 3' },
            { homeTeam: 'Team 5', awayTeam: 'Team 1' },
            { homeTeam: 'Team 4', awayTeam: 'Team 6' },
            { homeTeam: 'Team 3', awayTeam: 'Team 2' },
            { homeTeam: 'Team 4', awayTeam: 'Team 1' },
            { homeTeam: 'Team 3', awayTeam: 'Team 5' },
            { homeTeam: 'Team 2', awayTeam: 'Team 6' },
            { homeTeam: 'Team 3', awayTeam: 'Team 1' },
            { homeTeam: 'Team 2', awayTeam: 'Team 4' },
            { homeTeam: 'Team 6', awayTeam: 'Team 5' },
            { homeTeam: 'Team 2', awayTeam: 'Team 1' },
            { homeTeam: 'Team 6', awayTeam: 'Team 3' },
            { homeTeam: 'Team 5', awayTeam: 'Team 4' },
        ];
        expect(schedule).toEqual(expectedSchedule);
    });

    test('should generate the correct number of rounds for 3 teams', () => {
        const teams = ['Team 1', 'Team 2', 'Team 3'];
        const schedule = generateSchedule(teams);
        expect(schedule.length).toBe(6); // 6 matches for 4 teams (3 rounds) + 6 reversed matches
    });

    test('should generate the correct matches 3 teams', () => {
        const teams = ['Team 1', 'Team 2', 'Team 3'];
        const schedule = generateSchedule(teams);
        const expectedSchedule = [
            { homeTeam: 'Team 2', awayTeam: 'Team 3' },
            { homeTeam: 'Team 1', awayTeam: 'Team 3' },
            { homeTeam: 'Team 1', awayTeam: 'Team 2' },
            { homeTeam: 'Team 3', awayTeam: 'Team 2' },
            { homeTeam: 'Team 3', awayTeam: 'Team 1' },
            { homeTeam: 'Team 2', awayTeam: 'Team 1' },
        ];
        expect(schedule).toEqual(expectedSchedule);
    });
});
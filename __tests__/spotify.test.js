import { getSpotifyAccessToken } from '../src/utils/spotify';

// FILE: src/utils/spotify.test.js


global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ access_token: 'mocked_token' }),
    })
);

describe('getSpotifyAccessToken', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('should return access token on successful fetch', async () => {
        const token = await getSpotifyAccessToken();
        expect(token).toBe('mocked_token');
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": expect.any(String),
            },
            body: "grant_type=client_credentials",
        });
    });

    test('should throw an error on fetch failure', async () => {
        fetch.mockImplementationOnce(() => Promise.reject('API is down'));
        await expect(getSpotifyAccessToken()).rejects.toEqual('API is down');
    });
});
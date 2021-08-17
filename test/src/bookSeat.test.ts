import {
    addMovieInfo,
    availableShows,
    bookSeat,
    movieInfo
} from '../../src/bookSeat';
import { BookingData } from '../../src/types';

const currState: BookingData = {
    '19': {
        Morning: { movie: 'Bhuj', tickets: 0 },
        Afternoon: { movie: 'Pirates of the caribbean', tickets: 0 },
        Evening: { movie: 'Bhuj', tickets: 10 },
        Night: { movie: 'Pirates of the caribbean', tickets: 21 }
    },
    '20': {
        Morning: { movie: 'Bhuj', tickets: 12 },
        Afternoon: { movie: 'Pirates of the caribbean', tickets: 14 },
        Evening: { movie: 'Bhuj', tickets: 100 },
        Night: { movie: 'Pirates of the caribbean ', tickets: 22 }
    },
    '21': {
        Morning: { movie: 'Bhuj', tickets: 15 },
        Afternoon: { movie: 'Pirates of the caribbean', tickets: 14 },
        Evening: { movie: 'Bhuj', tickets: 50 },
        Night: { movie: 'Pirates of the caribbean', tickets: 90 }
    }
};

describe('Book Ticket', () => {
    it('should book a seat in Morning', () => {
        const output = bookSeat({ ...currState }, 'Morning', '19');
        expect(output).toEqual({ date: '19', timeSlot: 'Morning', seat: 1 });
    });

    it('should return next seat in date (20) when seats for given date are full', () => {
        const output = bookSeat(
            {
                ...currState,
                '19': {
                    Morning: { movie: 'Bhuj', tickets: 12 },
                    Afternoon: {
                        movie: 'Pirates of the caribbean',
                        tickets: 100
                    },
                    Evening: { movie: 'Bhuj', tickets: 100 },
                    Night: { movie: 'Pirates of the caribbean', tickets: 22 }
                }
            },
            'Afternoon',
            '19'
        );
        expect(output).toEqual({ date: '20', timeSlot: 'Afternoon', seat: 15 });
    });

    it("should return 'No seat available' when seats are full", () => {
        expect(() =>
            bookSeat(
                {
                    ...currState,
                    '21': {
                        Morning: { movie: 'Bhuj', tickets: 100 },
                        Afternoon: {
                            movie: 'Pirates of the caribbean',
                            tickets: 2
                        },
                        Evening: { movie: 'Bhuj', tickets: 100 },
                        Night: {
                            movie: 'Pirates of the caribbean',
                            tickets: 22
                        }
                    }
                },
                'Morning',
                '21'
            )
        ).toThrow('No seats are available');
    });

    it('should book a seat in Afternoon', () => {
        const output = bookSeat(
            {
                ...currState,
                '19': {
                    Morning: { movie: 'Bhuj', tickets: 12 },
                    Afternoon: {
                        movie: 'Pirates of the caribbean',
                        tickets: 2
                    },
                    Evening: { movie: 'Bhuj', tickets: 100 },
                    Night: { movie: 'Pirates of the caribbean', tickets: 22 }
                }
            },
            'Afternoon',
            '19'
        );
        expect(output).toEqual({ date: '19', timeSlot: 'Afternoon', seat: 3 });
    });

    it('should book a seat in Evening', () => {
        const output = bookSeat(
            {
                ...currState,
                '21': {
                    Morning: { movie: 'Bhuj', tickets: 15 },
                    Afternoon: {
                        movie: 'Pirates of the caribbean',
                        tickets: 5
                    },
                    Evening: { movie: 'Bhuj', tickets: 50 },
                    Night: { movie: 'Pirates of the caribbean', tickets: 90 }
                }
            },
            'Evening',
            '21'
        );
        expect(output).toEqual({ date: '21', timeSlot: 'Evening', seat: 51 });
    });

    it('should book a seat in Night', () => {
        const output = bookSeat(
            {
                ...currState,
                '20': {
                    Morning: { movie: 'Bhuj', tickets: 12 },
                    Afternoon: {
                        movie: 'Pirates of the caribbean',
                        tickets: 2
                    },
                    Evening: { movie: 'Bhuj', tickets: 100 },
                    Night: { movie: 'Pirates of the caribbean', tickets: 0 }
                }
            },
            'Night',
            '20'
        );
        expect(output).toEqual({ date: '20', timeSlot: 'Night', seat: 1 });
    });

    it('should get movie info for 19 Morning', () => {
        const output = movieInfo(currState, 'Morning', '19');
        expect(output).toBe('Bhuj');
    });

    it('should add movie to the given timeSlot and date if there is no info for movie', () => {
        const output = addMovieInfo(
            {
                ...currState,
                '20': {
                    Morning: { movie: 'Bhuj', tickets: 12 },
                    Afternoon: {
                        movie: 'Pirates of the caribbean',
                        tickets: 2
                    },
                    Evening: { movie: 'Bhuj', tickets: 100 },
                    Night: { movie: '', tickets: 0 }
                }
            },
            'Night',
            '20',
            'Shawshank Redemption'
        );
        expect(output[20].Night.movie).toBe('Shawshank Redemption');
    });

    it('should add movie to the given timeSlot and date if tickets are not reserved', () => {
        const output = addMovieInfo(
            {
                ...currState,
                '20': {
                    Morning: { movie: 'Bhuj', tickets: 12 },
                    Afternoon: {
                        movie: 'Pirates of the caribbean',
                        tickets: 2
                    },
                    Evening: { movie: 'Bhuj', tickets: 100 },
                    Night: { movie: 'DDLJ', tickets: 0 }
                }
            },
            'Night',
            '20',
            'Shawshank Redemption'
        );
        expect(output[20].Night.movie).toBe('Shawshank Redemption');
    });

    it('should throw error if movie has ticket reserved', () => {
        expect(() =>
            addMovieInfo(
                {
                    ...currState,
                    '20': {
                        Morning: { movie: 'Bhuj', tickets: 12 },
                        Afternoon: {
                            movie: 'Pirates of the caribbean',
                            tickets: 2
                        },
                        Evening: { movie: 'Bhuj', tickets: 100 },
                        Night: { movie: 'DDLJ', tickets: 5 }
                    }
                },
                'Night',
                '20',
                'Shawshank Redemption'
            )
        ).toThrow('Cannot assign movie');
    });

    it('should return list of `Bhuj` movie', () => {
        const output = availableShows(currState, 'Bhuj');
        const expectedOutput = {
            '19': ['Morning', 'Evening'],
            '20': ['Morning'],
            '21': ['Morning', 'Evening']
        };
        expect(output).toEqual(expectedOutput);
    });

    it('should return an empty list of `Bhuj` movie when no seats are available', () => {
        const output = availableShows(
            {
                '19': {
                    Morning: { movie: 'Bhuj', tickets: 100 },
                    Afternoon: {
                        movie: 'Pirates of the caribbean',
                        tickets: 0
                    },
                    Evening: { movie: 'Bhuj', tickets: 100 },
                    Night: { movie: 'Pirates of the caribbean', tickets: 21 }
                },
                '20': {
                    Morning: { movie: 'Bhuj', tickets: 100 },
                    Afternoon: {
                        movie: 'Pirates of the caribbean',
                        tickets: 14
                    },
                    Evening: { movie: 'Bhuj', tickets: 100 },
                    Night: { movie: 'Pirates of the caribbean ', tickets: 22 }
                },
                '21': {
                    Morning: { movie: 'Bhuj', tickets: 100 },
                    Afternoon: {
                        movie: 'Pirates of the caribbean',
                        tickets: 14
                    },
                    Evening: { movie: 'Bhuj', tickets: 100 },
                    Night: { movie: 'Pirates of the caribbean', tickets: 90 }
                }
            },
            'Bhuj'
        );
        const expectedOutput = {};
        expect(output).toEqual(expectedOutput);
    });

    it('should return an empty list of `ABC` movie when no such movie is available', () => {
        const output = availableShows(
            {
                '19': {
                    Morning: { movie: 'Bhuj', tickets: 100 },
                    Afternoon: {
                        movie: 'Pirates of the caribbean',
                        tickets: 0
                    },
                    Evening: { movie: 'Bhuj', tickets: 100 },
                    Night: { movie: 'Pirates of the caribbean', tickets: 21 }
                },
                '20': {
                    Morning: { movie: 'Bhuj', tickets: 100 },
                    Afternoon: {
                        movie: 'Pirates of the caribbean',
                        tickets: 14
                    },
                    Evening: { movie: 'Bhuj', tickets: 100 },
                    Night: { movie: 'Pirates of the caribbean ', tickets: 22 }
                },
                '21': {
                    Morning: { movie: 'Bhuj', tickets: 100 },
                    Afternoon: {
                        movie: 'Pirates of the caribbean',
                        tickets: 14
                    },
                    Evening: { movie: 'Bhuj', tickets: 100 },
                    Night: { movie: 'Pirates of the caribbean', tickets: 90 }
                }
            },
            'ABC'
        );
        const expectedOutput = {};
        expect(output).toEqual(expectedOutput);
    });
});

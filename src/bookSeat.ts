import { MAX_SEATS } from './constants';
import { AvailableDate, BookingData, SeatDetail, TimeSlot } from './types';

const getTickets = (
    data: BookingData,
    date: AvailableDate,
    timeSlot: TimeSlot
) => (data[date][timeSlot].tickets);

const getMovie = (
    data: BookingData,
    date: AvailableDate,
    timeSlot: TimeSlot
) => (data[date][timeSlot].movie);

export const bookSeat = (
    bookingData: BookingData,
    timeSlot: TimeSlot,
    date: AvailableDate
): SeatDetail => {
    const seatDetail = {
        date,
        timeSlot,
        seat: getTickets(bookingData, date, timeSlot) + 1
    };
    if (getTickets(bookingData, date, timeSlot) >= MAX_SEATS) {
        const suggestedDate = nextSuggestion(bookingData, timeSlot, date);
        if (!suggestedDate) throw new Error('No seats are available');
        seatDetail.date = suggestedDate;
        seatDetail.seat = getTickets(bookingData, suggestedDate, timeSlot) + 1;
    }
    return seatDetail;
};

const nextSuggestion = (
    bookingData: BookingData,
    timeSlot: TimeSlot,
    date: AvailableDate
): AvailableDate | undefined =>
    Object.keys(bookingData).find((key) => {
        const currDate = key as AvailableDate;
        return getTickets(bookingData, currDate, timeSlot) < MAX_SEATS && currDate > date;
    }) as AvailableDate | undefined;

export const movieInfo = (
    bookingData: BookingData,
    timeSlot: TimeSlot,
    date: AvailableDate
): string => getMovie(bookingData, date, timeSlot);

export const addMovieInfo = (
    bookingData: BookingData,
    timeSlot: TimeSlot,
    date: AvailableDate,
    movieName: string
): BookingData => {
    if (getTickets(bookingData, date, timeSlot) > 0)
        throw new Error('Cannot assign movie');

    const updatedBookingData = { ...bookingData };
    updatedBookingData[date][timeSlot].movie = movieName;
    return updatedBookingData;
};

export const availableShows = (bookingData: BookingData, movieName: string) => {
    const availableSlots: any = {};
    Object.keys(bookingData).map(date => {
        const timings = Object.keys(bookingData[date as AvailableDate]).filter(timeSlot => {
            const movie = getMovie(bookingData, date as AvailableDate, timeSlot as TimeSlot);
            const tickets = getTickets(bookingData, date as AvailableDate, timeSlot as TimeSlot);
            return movie === movieName && tickets < MAX_SEATS;
        })
        timings.length > 0 && (availableSlots[date] = timings);
    })
    return availableSlots;
}

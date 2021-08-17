export type TimeSlot = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

export type AvailableDate = '19' | '20' | '21';

export type SeatsInTimeSlot = {
    [key in TimeSlot]: { movie: string | ''; tickets: number };
};

export type BookingData = { [key in AvailableDate]: SeatsInTimeSlot };

export type SeatDetail = {
    seat: number;
    timeSlot: TimeSlot;
    date: AvailableDate;
};

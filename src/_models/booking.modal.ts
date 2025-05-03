
export interface Booking {
    bookingId:number;
    movieId: number;
    movieName: string;
    genre: string;
    posterImageUrl: string;
    showDate: string;
    showTime: string;
    totalPrice:number;
    quantity: number;
    numberOfTickets: number;
    userId: number;
    userName: string;
    showId?: number;
  }
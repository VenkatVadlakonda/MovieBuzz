export interface BookingsHistory{
    bookingId:number
    userId:number
    movieId:number
    Username:string
    Quantity:number
    date:any
    movieName:string
    genre:string
    imageURL:string
    time:string
    totalPrice:number
}

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
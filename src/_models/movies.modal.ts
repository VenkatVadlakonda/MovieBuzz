

export interface Movies{

    MovieID:number,
    MovieName:string ,
    Genre: string,
    AgeRestriction: number,
    Duration: number,
    Description:string,
    Price:number,
    PosterImageURL:string,
    TrailerURL: string,
    IsActive: boolean,
    showDate:any,
    showTime: string[],
    CreatedOn:any,
    AvailableSeats:number
}

export interface MovieAPI {
    movieId?: number;
    movieName: string;
    genre: string;
    ageRestriction: number;
    duration: number;
    description: string;
    price: number;
    posterImageUrl: string;
    trailerUrl: string;
    isActive: boolean;
    showTime:ShowTime[]
  }
  
  export interface ShowTime {
    showId: number;
    movieId?: number;
    showTime: string;    
    showDate: string;    
    availableSeats: number;
    


   
    movieName: string;
    genre: string;
    ageRestriction: number;
    duration: number;
    description: string;
    price: number;      
    posterImageUrl: string;
    trailerUrl: string;
    isActive: boolean;
  }
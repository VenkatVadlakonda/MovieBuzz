
export interface Movies {
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
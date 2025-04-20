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
    showDate:Date,
    showTime: string[],
    CreatedOn:Date,
    AvailableSeats:number

}
export interface Comment {
    id?: string  ;
    text: string;
    createdAt?: Date;
    postId :  string; 
    userId : string ;
}
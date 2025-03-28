export interface Report {
    id?: string  ;
    text: string;
    createdAt?: Date;
    postId :  string; 
    userId : string ;
    status : Status; 
    reason : string ; 
    
}


  enum Status {
    Pending = "Pending",   // 0
    Approved = "Approved", // 1
    Rejected = "Rejected", // 2
  }
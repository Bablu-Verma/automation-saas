export interface IUser {
    _id: string;
    name: string;
    email: string;
    role:string;
    status:string;
    profile:{
        company?:string;
        phoneNumber?:string;
        address?:string;
    }
}
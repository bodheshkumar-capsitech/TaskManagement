export interface LoginRequest
{
    onLogin : (email:string,password:string) => void;
}
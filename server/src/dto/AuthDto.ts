export interface RegisterUserDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: string;
    password: string;
    confirmPassword: string;
    preferences: string[];
  }
  
  export interface LoginUserDto {
    identifier: string; 
    password: string;
  }
  
  export interface ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
  }
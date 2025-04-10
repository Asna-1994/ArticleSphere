

export interface User { 
    _id? : string
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: Date;
    password: string;
    preferences: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface registerData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dob: Date | string;
    password: string;
    preferences: string[];
  }

  export interface Category {
    _id: string;
    categoryName: string;
  }
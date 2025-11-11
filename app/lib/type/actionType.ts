export interface UpdateAndAddState {
  errors?: {
    id?: string[];
    title?: string[];
    body?: string[];
  };
  message?: string;
}

export interface loginState {
  errors?: {
    email?: string[];
    password?: string[];
  };
  message?: string;
}

export interface registerState {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };
  message?: string;
}

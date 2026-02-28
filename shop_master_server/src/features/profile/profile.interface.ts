export interface IUpdateProfileInput {
  name?: string;
  phone?: string;
  address?: string;
}

export interface IChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
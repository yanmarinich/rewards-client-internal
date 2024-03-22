export interface IUser {
  id: number; //  1,
  email: string; //  "ch3ll0v3k@yandex.com",
  isEmailVerified: boolean; //  false,
  phone: string; //  "",
  firstName: string; //  "",
  middleName: string; //  "",
  lastName: string; //  "",
  phoneCountryCode: string; //  "",
  isPhoneVerified: boolean; //  false,
  roleId: number; //  4,
  role: {
    id: number;
    role: string;
  }
}
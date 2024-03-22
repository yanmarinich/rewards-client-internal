// import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';

import { IUser } from "../../types/interfaces/user";

const state: IUser = {
  id: 0,
  email: '',
  isEmailVerified: false,
  phone: "",
  firstName: "",
  middleName: "",
  lastName: "",
  phoneCountryCode: "",
  isPhoneVerified: false,
  roleId: 0,
  role: {
    id: 0,
    role: '',
  }
};

export interface IUserState {
  _user: IUser;
  set: (user: IUser) => void;
  get: () => IUser;
  // setToken: (user: string) => void;
  // getToken: () => string;
}

const store = create(
  persist<IUserState>(
    (set, get) => ({
      _user: state,
      set: (user: IUser) => {
        set(produce((state) => {
          state._user = user;
        }));
      },
      get: (): IUser => (get()._user),

      // setToken: (token: string) => {
      //   set(produce((state) => {
      //     state._user.token = token;
      //   }));
      // },

      // getToken: (): string => (get()._user.token),
    }),
    {
      name: 'persist-store-user',
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);


// const store = create<IUserState>((set, get) => ({
//   user: state,
//   set: (_user: IUser) => {
//     set((state) => ({
//       user: {
//         ...state.user,
//         ..._user,
//       }
//     }));
//   },
//   get: (): IUser => (get().user),
// }));


export default store;

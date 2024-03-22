// import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';

import { IApi } from "../../types/interfaces/api";

const initialState: IApi = {
  httpBase: "",
  wsBase: "",
  lang: "en",
};

const state: IApi = {
  httpBase: "",
  wsBase: "",
  lang: "en",
};

export interface IApiState {
  _api: IApi;
  set: (data: IApi) => void;
  get: () => IApi;
  reset: () => boolean;
  setLang: (lang: string) => void;
  getLang: () => string;
}

const store = create(
  persist<IApiState>(
    (set, get) => ({
      _api: state,
      set: (data: IApi) => {
        set(produce((state) => {
          state._api = data;
        }));
      },
      get: (): IApi => (get()._api),

      reset: () => {
        set(produce((state) => {
          state._api = {
            ...initialState,
          };
        }));
        return true;
      },
      setLang: (lang: string) => {
        set(produce((state) => {
          state._api.lang = lang;
        }));
      },
      getLang: () => (get()._api.lang),

    }),
    {
      name: 'persist-store-api',
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
);

export default store;

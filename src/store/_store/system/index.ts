// import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { produce } from 'immer';

import { ISystem } from "../../types/interfaces/system";

export interface ISysytemState {
  _system: ISystem;
  set: (system: ISystem) => void;
  get: () => ISystem;
  setLoader: (value: string) => void;
}

const state: ISystem = {
  loader: '',
};

const store = create<ISysytemState>((set, get) => ({
  _system: state,
  set: (system: ISystem) => {
    set(produce((state) => {
      state._system = {
        ...state._system,
        ...system,
      };
    }));
  },
  get: (): ISystem => {
    return get()._system;
  },
  setLoader: (value: string) => {
    set(produce((state) => {
      state._system.loader = value
    }));
  },
}));

export default store;

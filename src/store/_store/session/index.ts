// import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { ISession } from "@app/store/types/interfaces/session";

import { Address, EProtocol } from "@app/contracts";
import { IChainInfo } from "@app/hooks/useSmart";
import { ISCConfig } from "@app/config/interfaces";

const initialState: ISession = {
  chainId: 421614,
  protocolName: EProtocol.arbitrumTestnet,
  isInited: false,
  selectedContract: -1,
  smartConfig: {
    proxy: { address: '' as Address },
    accessControl: { address: '' as Address },
    erc20: { address: '' as Address },
    impl: { address: '' as Address },
    isInited: false,
  },
};

const state: ISession = {
  chainId: 421614,
  protocolName: EProtocol.arbitrumTestnet,
  isInited: false,
  selectedContract: -1,
  smartConfig: {
    proxy: { address: '' as Address },
    accessControl: { address: '' as Address },
    erc20: { address: '' as Address },
    impl: { address: '' as Address },
    isInited: false,
  },
}

export interface ISessionState {
  _session: ISession;
  set: (data: ISession) => void;
  get: () => ISession;
  setChainInfo: (chainInfo: IChainInfo) => void;
  getChainInfo: () => IChainInfo;
  setSmartConfig: (cfg: ISCConfig) => void;
  getSmartConfig: () => ISCConfig;
  setSelectedContract: (index: number) => void;
  getSelectedContract: () => number;
  reset: () => boolean;
}

const store = create(
  persist<ISessionState>(
    (set, get) => ({
      _session: state,
      set: (data: ISession) => {
        set(produce((state) => {
          state._session = data;
        }));
      },
      get: (): ISession => (get()._session),
      setChainInfo: (chainInfo: IChainInfo) => {
        set(produce((state) => {
          state._session = {
            ...state._session,
            chainId: chainInfo.chainId,
            protocolName: chainInfo.protocolName,
            isInited: true,
          }
        }));
      },
      getChainInfo: (): IChainInfo => {
        // return get()._session;
        const ses = get()._session;
        const chainInfo: IChainInfo = {
          chainId: ses.chainId,
          protocolName: ses.protocolName,
          isInited: ses.isInited,
        };
        return chainInfo;
      },
      setSelectedContract: (index: number) => {
        set(produce((state) => {
          state._session = {
            ...state._session,
            selectedContract: index,
          }
        }));
      },
      getSelectedContract: (): number => {
        return get()._session.selectedContract;
      },
      setSmartConfig: (smartConfig: ISCConfig) => {
        set(produce((state) => {
          state._session = {
            ...state._session,
            smartConfig,
          }
        }));
      },
      getSmartConfig: (): ISCConfig => {
        return get()._session.smartConfig;
      },
      reset: () => {
        set(produce((state) => {
          state._session = {
            ...initialState,
          };
        }));
        return true;
      },
    }),
    {
      name: 'persist-store-session',
    }
  )
);

export default store;

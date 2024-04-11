// import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';
import { produce } from 'immer';
import { IContributorsState, ISession } from "@app/store/types/interfaces/session";

import { Address, EProtocol } from "@app/contracts";
import { IChainInfo } from "@app/hooks/useSmart";
import { ISCConfig } from "@app/config/interfaces";

const initialState: ISession = {
  chainId: 421614,
  protocolName: EProtocol.arbitrumTestnet,
  isInited: false,
  selectedContract: -1,
  selectedTargetCommuntyTokenContract: null,
  isSelectedTargetCommuntyTokenContractValid: false,
  contributorsState: {
    lastContributorId: 0,
    subViewId: 0,
  } as IContributorsState,
  smartConfig: {
    proxy: { address: '' as Address },
    accessControl: { address: '' as Address },
    erc20: { address: '' as Address },
    impl: { address: '' as Address },
    communityFactory: { address: '' as Address },
    communityAddress: { address: '' as Address },
    contributorsAddress: { address: '' as Address },
    isInited: false,
  },
};

const state: ISession = {
  chainId: 421614,
  protocolName: EProtocol.arbitrumTestnet,
  isInited: false,
  selectedContract: -1,
  selectedTargetCommuntyTokenContract: null,
  isSelectedTargetCommuntyTokenContractValid: false,
  contributorsState: {
    lastContributorId: 0,
    subViewId: 0,
  } as IContributorsState,
  smartConfig: {
    proxy: { address: '' as Address },
    accessControl: { address: '' as Address },
    erc20: { address: '' as Address },
    impl: { address: '' as Address },
    communityFactory: { address: '' as Address },
    communityAddress: { address: '' as Address },
    contributorsAddress: { address: '' as Address },
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

  setTargetCommuntyTokenContract: (address: Address | null) => void;
  getTargetCommuntyTokenContract: () => Address | null;

  setIsSelectedTargetCommuntyTokenContractValid: (value: boolean) => void;
  getIsSelectedTargetCommuntyTokenContractValid: () => boolean | null;

  setContributorsState: (state: IContributorsState) => void;
  getContributorsState: () => IContributorsState;

  reset: () => boolean;
}

const store = create(
  persist<ISessionState>(
    (set, get) => ({
      _session: state,
      get: (): ISession => (get()._session),
      set: (data: ISession) => {
        set(produce((state) => {
          state._session = {
            ...state._session,
            ...data,
          };
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

      getSelectedContract: (): number => {
        return get()._session.selectedContract;
      },
      setSelectedContract: (index: number) => {
        set(produce((state) => {
          state._session = {
            ...state._session,
            selectedContract: index,
          }
        }));
      },

      getSmartConfig: (): ISCConfig => {
        return get()._session.smartConfig;
      },
      setSmartConfig: (smartConfig: ISCConfig) => {
        set(produce((state) => {
          state._session = {
            ...state._session,
            smartConfig,
          }
        }));
      },

      getTargetCommuntyTokenContract: (): Address | null => {
        return get()._session.selectedTargetCommuntyTokenContract;
      },
      setTargetCommuntyTokenContract: (selectedTargetCommuntyTokenContract: Address | null): void => {
        set(produce((state) => {
          state._session = {
            ...state._session,
            selectedTargetCommuntyTokenContract,
          };
        }));
      },


      getIsSelectedTargetCommuntyTokenContractValid: (): boolean => {
        return get()._session.isSelectedTargetCommuntyTokenContractValid;
      },
      setIsSelectedTargetCommuntyTokenContractValid: (isSelectedTargetCommuntyTokenContractValid: boolean): void => {
        set(produce((state) => {
          state._session = {
            ...state._session,
            isSelectedTargetCommuntyTokenContractValid,
          };
        }));
      },

      getContributorsState: (): IContributorsState => {
        return get()._session.contributorsState;
      },
      setContributorsState: (contributorsState: IContributorsState): void => {
        set(produce((state) => {
          state._session = {
            ...state._session,
            contributorsState: {
              ...state._session.contributorsState,
              lastContributorId: contributorsState.lastContributorId,
              subViewId: contributorsState.subViewId,
            },
          };
        }));
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

import { ISCConfig } from "@app/config/interfaces";
import {
  Address,
  EProtocol,
  // EAbis,
} from "@app/hooks/useSmart";

export interface IContributorsState {
  lastContributorId: number;
  subViewId: number;
};

export interface ISession {
  chainId: number;
  protocolName: EProtocol;
  isInited: boolean;
  selectedContract: number;
  selectedTargetCommuntyTokenContract: Address | null;
  isSelectedTargetCommuntyTokenContractValid: boolean;
  contributorsState: IContributorsState,
  smartConfig: ISCConfig;
}
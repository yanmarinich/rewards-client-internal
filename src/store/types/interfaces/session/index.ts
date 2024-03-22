import { ISCConfig } from "../../../../config/interfaces";
import {
  EAbis,
  Address,
  EProtocol,
} from "../../../../hooks/useSmart";

export interface ISession {
  chainId: number;
  protocolName: EProtocol;
  isInited: boolean;
  selectedContract: number;
  smartConfig: ISCConfig;
}
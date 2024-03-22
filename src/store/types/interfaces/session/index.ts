import { ISCConfig } from "@app/config/interfaces";
import {
  // EAbis,
  // Address,
  EProtocol,
} from "@app/hooks/useSmart";

export interface ISession {
  chainId: number;
  protocolName: EProtocol;
  isInited: boolean;
  selectedContract: number;
  smartConfig: ISCConfig;
}
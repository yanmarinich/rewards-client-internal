import { Address } from "@app/contracts";


export interface ISCConfig {
  proxy: {
    address: Address,
  },
  impl: {
    address: Address,
  },
  erc20: {
    address: Address,
  },
  accessControl: {
    address: Address,
  },
  isInited: boolean;
}


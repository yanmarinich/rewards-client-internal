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
  communityFactory: {
    address: Address,
  },
  communityAddress: {
    address: Address,
  },
  isInited: boolean;
}


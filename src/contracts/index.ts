import { Config } from 'wagmi'

import proxy from "./abis/proxy.json";
import erc20 from "./abis/ERC20.json";
import accessControl from "./abis/accessControl.json";

export type Address = `0x${string}`;
export interface IAbi { [key: string]: any }
export interface IConfig extends Config { }

export enum EAccessControlRole {
  admin = '0x0000000000000000000000000000000000000000000000000000000000000000',
}

export enum EAbis {
  proxy = 'proxy',
  erc20 = 'erc20',
  accessControl = 'accessControl',
}

export enum EProtocol {
  arbitrumTestnet = 'arbitrumTestnet',
  arbitrum = 'arbitrum',
  fantomTestnet = 'fantomTestnet',
  fantom = 'fantom',
}

export interface IRes {
  success: boolean;
  message: string;
  data?: any;
}

export interface IUseSmartSmartProps {
  address?: Address;
  functionName: string;
  args?: any[];
  account?: Address | undefined;
  config?: IConfig;
  chainId?: number;
}

export interface ISmartContractParams extends IUseSmartSmartProps {
  abi: IAbi[];
}

export const abis = {
  [EAbis.proxy]: proxy,
  [EAbis.erc20]: erc20,
  [EAbis.accessControl]: accessControl,
};

export const getAbiByName = (abiName: EAbis): IAbi[] | undefined => {
  return abis[abiName];
}

export const res = (success: boolean, message: string, data?: any): IRes => {
  return { success, message, data };
}

import { Config } from 'wagmi'

import proxy from "./abis/proxy.json";
import erc20 from "./abis/ERC20.json";
import accessControl from "./abis/accessControl.json";

import config from '@app/config';

export type Address = `0x${string}`;
export interface IAbi { [key: string]: any }
export interface IConfig extends Config { }

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
  args?: string[];
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

// config.SC.arbitrumTestnet[ EAbis.accessControl ];

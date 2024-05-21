import { Config } from 'wagmi'

import proxy from "./abis/proxy.json";
import erc20 from "./abis/ERC20.json";
import accessControl from "./abis/accessControl.json";
import communityFactory from "./abis/communityFactory.json";
import communityAddress from "./abis/communityAddress.json";
import contributorsAddress from "./abis/contributorsAddress.json";

export type Address = `0x${string}`;
export interface IAbi { [key: string]: any }
export interface IConfig extends Config { }

export type Role = `0x${string}`;

export enum EAccessControlRole {
  none = '0x1000000000000000000000000000000000000000000000000000000000000000',
  admin = '0x0000000000000000000000000000000000000000000000000000000000000000',
  manager = '0x0000000000000000000000000000000000000000000000000000000000000001',
}

export enum EAccessControlRoleName {
  none = 'No Role',
  admin = 'Admin',
  manager = 'Manager',
}

export interface IAcccessControlRoles {
  uint256: EAccessControlRole;
  name: EAccessControlRoleName;
}

export const accessControlRols: IAcccessControlRoles[] = [
  { uint256: EAccessControlRole.none, name: EAccessControlRoleName.none },
  { uint256: EAccessControlRole.admin, name: EAccessControlRoleName.admin },
  { uint256: EAccessControlRole.manager, name: EAccessControlRoleName.manager },
];

export enum EAbis {
  proxy = 'proxy',
  erc20 = 'erc20',
  accessControl = 'accessControl',
  communityFactory = 'communityFactory',
  communityAddress = 'communityAddress',
  contributorsAddress = 'contributorsAddress',
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
  [EAbis.communityFactory]: communityFactory,
  [EAbis.communityAddress]: communityAddress,
  [EAbis.contributorsAddress]: contributorsAddress,
};

export const getAbiByName = (abiName: EAbis): IAbi[] | undefined => {
  return abis[abiName];
}

export const res = (success: boolean, message: string, data?: any): IRes => {
  return { success, message, data };
}

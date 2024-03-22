import { useReadContract, useWriteContract } from 'wagmi'
// import { type UseReadContractReturnType } from 'wagmi'

import "@app/utils/prototype";

import tval from "@app/utils/tval";
import config from "@app/config";
import { ids } from "@app/providers/wagmi/config";

export { EAbis, EProtocol, type Address } from '@app/contracts';

import {
  ISmartContractParams,
  IUseSmartSmartProps,
  getAbiByName,
  EAbis,
  IRes,
  res,
  EProtocol,
  Address
} from '@app/contracts';

export interface IBasicReadContractRes {
  // custom:props
  success: boolean;
  message: string;
  // contract:call
  error?: string;
  status?: string;
  isError?: boolean;
  isSuccess?: boolean;
  isPending?: boolean;
  data?: any;
}

export interface IChainInfo {
  chainId: number;
  protocolName: EProtocol;
  isInited: boolean;
}

export const getProtocolNameByChainId = (chainId: number): EProtocol | undefined => {
  const name = ids[chainId];
  return ((name in EProtocol) ? name : undefined) as EProtocol;
}

export const isSupportedProtocol = (
  protocol: EProtocol,
  abiName?: EAbis,
): boolean => {

  if (!(protocol in EProtocol))
    return false; // res(false, `Not supported: (protocol: ${protocol})`);

  if (!tval.isObject(config.SC[protocol]))
    return false; // res(false, `Config is missing: (protocol: ${protocol})`);

  const protocolConfig = config.SC[protocol];

  if (!protocolConfig.isInited)
    return false; // res(false, `Envs are not initialized: (protocol: ${protocol})`);

  if (abiName) {
    if (!(abiName in config.SC[protocol]))
      return false; // res(false, `Unknown: (protocol: ${protocol})`);
  }

  return true;

}


export interface IGetReadSmartRes extends IRes {
  data?: ISmartContractParams;
}

export const useReadSmartProps = (
  protocol: EProtocol,
  abiName: EAbis,
  { address, account, functionName, args }: IUseSmartSmartProps
): IGetReadSmartRes => {

  if (!(protocol in EProtocol))
    return res(false, `Not supported: (protocol: ${protocol})`);

  if (!tval.isObject(config.SC[protocol]))
    return res(false, `Config is missing: (protocol: ${protocol})`);

  const protocolConfig = config.SC[protocol];

  if (!protocolConfig.isInited)
    return res(false, `Envs are not initialized: (protocol: ${protocol})`);

  if (!(abiName in EAbis))
    return res(false, "Unknown ABI...");

  if (!(abiName in config.SC[protocol]))
    return res(false, `Unknown: (protocol: ${protocol})`);

  // smart-contract address
  address = address || config.SC[protocol][abiName]?.address;

  const abi = getAbiByName(abiName);
  if (tval.isUndefined(abi))
    return res(false, `#abi: ${abiName}, not found`);

  const params: ISmartContractParams = {
    abi,
    address,
    functionName,
    args,
    account,
  };

  return res(true, "success", params);

}


export const useReadSmart = (
  protocol: EProtocol,
  abiName: EAbis,
  { address, account, functionName, args }: IUseSmartSmartProps
): IRes => {
  const propsRes = useReadSmartProps(protocol, abiName, { address, account, functionName, args })
  if (!propsRes.success) return propsRes;
  const params = propsRes.data;
  const execRes = useReadContract(params);
  return res(true, "success", execRes);
}

export interface IGetWriteSmartRes extends IRes {
  data?: ISmartContractParams;
}

export const getWriteSmartProps = (
  protocol: EProtocol,
  abiName: EAbis,
  { address, account, functionName, args }: IUseSmartSmartProps
): IGetWriteSmartRes => {

  if (!(protocol in EProtocol))
    return res(false, `Not supported: (protocol: ${protocol})`);

  if (!tval.isObject(config.SC[protocol]))
    return res(false, `Config is missing: (protocol: ${protocol})`);

  const protocolConfig = config.SC[protocol];

  if (!protocolConfig.isInited)
    return res(false, `Envs are not initialized: (protocol: ${protocol})`);

  if (!(abiName in EAbis))
    return res(false, "Unknown ABI...");

  if (!(abiName in config.SC[protocol]))
    return res(false, `Unknown: (protocol: ${protocol})`);

  // smart-contract address
  address = address || config.SC[protocol][abiName]?.address;

  const abi = getAbiByName(abiName);
  if (tval.isUndefined(abi))
    return res(false, `#abi: ${abiName}, not found`);

  const params: ISmartContractParams = {
    abi,
    address,
    functionName,
    args,
    account,
  };

  return res(true, "success", params);

}

export interface IContractItem {
  display: string;
  addres: Address;
  abiName: EAbis;
}


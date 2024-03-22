import { useReadContract, useWriteContract } from 'wagmi'
import { type UseReadContractReturnType } from 'wagmi'
// import { type UseReadContractParameters } from 'wagmi'

import tval from "@app/utils/tval";
import {
  ISmartContractParams,
  IUseSmartSmartProps,
  getAbiByName
} from '@app/contracts';

export const useAccessControlSmart = ({ address, account, functionName, args }: IUseSmartSmartProps): any => {

  const abi = getAbiByName('accessControl');

  if (tval.isUndefined(abi)) return false;

  const params: ISmartContractParams = {
    abi,
    address, //  '0x6b175474e89094c44da98b954eedeac495271d0f',
    functionName,
    args,
    account,
  };

  // if (tval.isString(functionName) && functionName.length)
  //   params.functionName = functionName;

  // if (tval.isString(account) && account.length)
  //   params.account = account;
  // console.log({ params });

  return useWriteContract(params);

}



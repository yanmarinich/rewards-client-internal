
import { useReadContract } from "wagmi";

import config from "@app/config";
import store from '@app/store';
import crypto from "@app/utils/crypto";

import {
  Address, EAbis, IBasicReadContractRes,
  IChainInfo, useReadSmartProps,
} from "./../useSmart";

export interface IUseAllowedToDepositRes extends IBasicReadContractRes {
  allowed: number;
}

const useAllowedToWithdraw = (chainInfo: IChainInfo, abiName: EAbis, address: Address): IUseAllowedToDepositRes => {

  try {

    const propsRes = useReadSmartProps(chainInfo.protocolName, abiName, {
      functionName: 'balanceOf',
      args: [address as Address],
    });

    const isSysError = !propsRes.success;
    const sysError = propsRes.message;

    if (isSysError)
      return { success: false, message: sysError, allowed: 0 };

    const params = propsRes.data
    const res = useReadContract(params);
    const { error, status, isError, isSuccess, isPending, } = res;
    const data: bigint | undefined = res.data as bigint;

    const message = error ? error.message.split('\n')[0] : '';
    const success = (!isError && !message && typeof data === "bigint");
    const allowed = (success ? +(+crypto.fromWei(data)).toFixed(8) : 0);
    return { success, message, allowed, isPending, status };
  } catch (e: any) {
    return { success: false, message: e.message, allowed: 0 };
  }
}

export default useAllowedToWithdraw;
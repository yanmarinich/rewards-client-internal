
import { useReadContract } from "wagmi";
import crypto from "@app/utils/crypto";

import {
  Address, EAbis, IBasicReadContractRes,
  IChainInfo, useReadSmartProps,
} from "./../useSmart";

export interface IUseBalanceOfRes extends IBasicReadContractRes {
  balance: number;
}

const useBalanceOf = (chainInfo: IChainInfo, abiName: EAbis, address: Address, targetContract?: Address): IUseBalanceOfRes => {

  try {

    const propsRes = useReadSmartProps(chainInfo.protocolName, abiName, {
      functionName: 'balanceOf',
      args: [address as Address],
      ...(targetContract ? { address: targetContract } : {}),
    });

    const isSysError = !propsRes.success;
    const sysError = propsRes.message;

    if (isSysError)
      return { success: false, message: sysError, balance: 0 };

    const params = propsRes.data
    const res = useReadContract(params);
    const { error, status, isError, isSuccess, isPending, } = res;
    const data: bigint | undefined = res.data as bigint;

    const message = error ? error.message.split('\n')[0] : '';
    const success = (!isError && !message && typeof data === "bigint");
    const balance = (success ? +(+crypto.fromWei(data)).toFixed(8) : 0);
    return { success, message, balance, isPending, status };
  } catch (e: any) {
    return { success: false, message: e.message, balance: 0 };
  }
}

export default useBalanceOf;
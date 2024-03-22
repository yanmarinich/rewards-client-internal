
import { useReadContract } from "wagmi";
import store from '@app/store';
import crypto from "@app/utils/crypto";

import {
  Address, EAbis, IBasicReadContractRes,
  IChainInfo, useReadSmartProps,
} from "./../useSmart";
import { ISCConfig } from "@app/config/interfaces";

export interface IUseAllowanceRes extends IBasicReadContractRes {
  allowance: number;
}

const useAllowance = (chainInfo: IChainInfo, abiName: EAbis, address: Address): IUseAllowanceRes => {

  try {

    const cfg: ISCConfig = store.session((state) => (state.getSmartConfig()));

    const propsRes = useReadSmartProps(chainInfo.protocolName, abiName, {
      functionName: 'allowance',
      args: [
        address as Address,
        cfg.proxy.address,
      ],
    });

    const isSysError = !propsRes.success;
    const sysError = propsRes.message;

    if (isSysError)
      return { success: false, message: sysError, allowance: 0 };

    const params = propsRes.data
    const res = useReadContract(params);
    const { error, status, isError, isSuccess, isPending, } = res;
    const data: bigint | undefined = res.data as bigint;

    const message = error ? error.message.split('\n')[0] : '';
    const success = (!isError && !message && typeof data === "bigint");
    const allowance = (success ? +crypto.fromWei(data) : 0);

    return { success, message, allowance, isPending, status };
  } catch (e: any) {
    return { success: false, message: e.message, allowance: 0 };
  }
}

export default useAllowance;

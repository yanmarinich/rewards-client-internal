
import { useReadContract } from "wagmi";
import store from '@app/store';
import crypto from "@app/utils/crypto";

import {
  Address, EAbis, IBasicReadContractRes,
  IChainInfo, useReadSmartProps,
} from "./../useSmart";
import { ISCConfig } from "@app/config/interfaces";

export interface IValidatedContributionCountRes extends IBasicReadContractRes {
  amount: number;
}

const useValidatedContributionCount = (chainInfo: IChainInfo, abiName: EAbis): IValidatedContributionCountRes => {

  try {

    const cfg: ISCConfig = store.session((state) => (state.getSmartConfig()));

    const propsRes = useReadSmartProps(chainInfo.protocolName, abiName, {
      functionName: 'validatedContributionCount',
      args: [],
    });

    const isSysError = !propsRes.success;
    const sysError = propsRes.message;

    if (isSysError)
      return { success: false, message: sysError, amount: 0 };

    const params = propsRes.data
    const res = useReadContract(params);
    const { error, status, isError, isSuccess, isPending, } = res;
    const data: bigint | undefined = res.data as bigint;

    const message = error ? error.message.split('\n')[0] : '';
    const success = (!isError && !message && typeof data === "bigint");
    const amount = (success ? Math.floor(+crypto.fromWei(data)) : 0);

    return { success, message, amount, isPending, isError, isSuccess, status };
  } catch (e: any) {
    return { success: false, message: e.message, amount: 0 };
  }
}

export default useValidatedContributionCount;


import { useReadContract } from "wagmi";
import store from '@app/store';
import crypto from "@app/utils/crypto";

import {
  Address, EAbis, IBasicReadContractRes,
  IChainInfo, useReadSmartProps,
} from "./../useSmart";
import { ISCConfig } from "@app/config/interfaces";

export interface IUseBalancesRes extends IBasicReadContractRes {
  balance: number;
}

const useBalances = (chainInfo: IChainInfo, abiName: EAbis, admin: Address, token: Address): IUseBalancesRes => {

  try {

    const cfg: ISCConfig = store.session((state) => (state.getSmartConfig()));

    const propsRes = useReadSmartProps(chainInfo.protocolName, abiName, {
      functionName: 'balances',
      args: [
        admin as Address,
        token as Address,
        // cfg.proxy.address,
      ],
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
    const balance = (success ? +crypto.fromWei(data) : 0);

    return { success, message, balance, isPending, status };
  } catch (e: any) {
    return { success: false, message: e.message, balance: 0 };
  }
}

export default useBalances;

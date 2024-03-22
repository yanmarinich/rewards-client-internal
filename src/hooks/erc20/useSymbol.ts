
import { useReadContract } from "wagmi";

import config from "@app/config";
import store from '@app/store';
import crypto from "@app/utils/crypto";

import {
  Address, EAbis, IBasicReadContractRes,
  IChainInfo, useReadSmartProps,
} from "./../useSmart";
import { ISCConfig } from "@app/config/interfaces";

export interface IUseSymbolRes extends IBasicReadContractRes {
  symbol: string;
}

const useSymbol = (chainInfo: IChainInfo, abiName: EAbis): IUseSymbolRes => {

  try {

    // const cfg: ISCConfig = store.session((state) => (state.getSmartConfig()));

    const propsRes = useReadSmartProps(chainInfo.protocolName, abiName, {
      functionName: 'symbol',
      // args: [
      //   address as Address,
      //   cfg.proxy.address,
      // ],
    });

    const isSysError = !propsRes.success;
    const sysError = propsRes.message;

    if (isSysError)
      return { success: false, message: sysError, symbol: "n/a" };

    const params = propsRes.data
    const res = useReadContract(params);
    const { error, status, isError, isSuccess, isPending, } = res;
    const data: bigint | undefined = res.data as bigint;

    const message = error ? error.message.split('\n')[0] : '';
    const success = (!isError && !message && (typeof data === "string"));
    const symbol = (success ? data : "n/a");

    return { success, message, symbol, isPending, status };
  } catch (e: any) {
    return { success: false, message: e.message, symbol: "n/a" };
  }
}

export default useSymbol;

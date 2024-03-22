
import { useReadContract } from "wagmi";

import {
  EAbis, IBasicReadContractRes,
  IChainInfo, useReadSmartProps,
} from "./../useSmart";
export interface IUseSymbolRes extends IBasicReadContractRes {
  symbol: string;
}

const useSymbol = (chainInfo: IChainInfo, abiName: EAbis): IUseSymbolRes => {

  try {

    const propsRes = useReadSmartProps(chainInfo.protocolName, abiName, {
      functionName: 'symbol',
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

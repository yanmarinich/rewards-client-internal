
import { useReadContract } from "wagmi";
import tval from "@app/utils/tval";

import {
  Address, EAbis, IBasicReadContractRes,
  IChainInfo, useReadSmartProps,
} from "./../useSmart";
import { EAccessControlRole } from "@app/contracts";

export interface IUseAllowanceRes extends IBasicReadContractRes {
  hasRole: boolean;
}

const useHasAdminRole = (chainInfo: IChainInfo, abiName: EAbis, address: Address): IUseAllowanceRes => {

  try {

    const propsRes = useReadSmartProps(chainInfo.protocolName, abiName, {
      functionName: 'hasRole',
      args: [
        EAccessControlRole.admin,
        address as Address,
      ],
    });

    const isSysError = !propsRes.success;
    const sysError = propsRes.message;

    if (isSysError)
      return { success: false, message: sysError, hasRole: false };

    const params = propsRes.data
    const res = useReadContract(params);
    const { error, status, isError, isSuccess, isPending, } = res;

    const data: boolean | undefined = res.data as boolean;

    const message = error ? error.message.split('\n')[0] : '';
    const success = (!isError && !message && tval.isBoolean(data));
    const hasRole = (success ? data : false);

    return { success, message, hasRole, isPending, status };
  } catch (e: any) {
    return { success: false, message: e.message, hasRole: false };
  }
}

export default useHasAdminRole;

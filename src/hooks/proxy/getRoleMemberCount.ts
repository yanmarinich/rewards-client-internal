
import { useReadContract } from "wagmi";
import crypto from "@app/utils/crypto";

export { type Role } from "@app/contracts";

import {
  Address, EAbis, IBasicReadContractRes,
  IChainInfo, useReadSmartProps,
} from "@app/hooks/useSmart";

import { type Role } from "@app/contracts";

export interface IUseGetRoleMemberCountRes extends IBasicReadContractRes {
  count: number;
}

const useGetRoleMemberCount = (
  chainInfo: IChainInfo,
  abiName: EAbis,
  role: Role
): IUseGetRoleMemberCountRes => {

  try {

    const propsRes = useReadSmartProps(chainInfo.protocolName, abiName, {
      functionName: 'getRoleMemberCount',
      args: [
        role
      ],
    });

    const isSysError = !propsRes.success;
    const sysError = propsRes.message;

    if (isSysError)
      return { success: false, message: sysError, count: 0 };

    const params = propsRes.data
    const res = useReadContract(params);

    const { error, status, isError, isSuccess, isPending } = res;
    const data: bigint | undefined = res.data as bigint;
    const message = error ? error.message.split('\n')[0] : '';
    const success = (!isError && !message && typeof data === "bigint");
    const count = (success ? +(+data.toString()).toFixed(8) : 0);

    return { success, message, count, isPending, status, isError, isSuccess };
  } catch (e: any) {
    return { success: false, message: e.message, count: 0 };
  }
}

export default useGetRoleMemberCount;
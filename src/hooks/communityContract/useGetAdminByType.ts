
import { useReadContract } from "wagmi";
import tval from "@app/utils/tval";
import crypto from "@app/utils/crypto";

import {
  Address, EAbis, IBasicReadContractRes,
  IChainInfo, useReadSmartProps,
} from "./../useSmart";
import { EAccessControlRole } from "@app/contracts";

export interface IUseGetAdminByType extends IBasicReadContractRes {
  address: Address | null;
}

export enum EAdminType {
  foundationAdmin = 'foundationAdmin',
  rewardsAdmin = 'rewardsAdmin',
  treasuryAdmin = 'treasuryAdmin',
  validationsAdmin = 'validationsAdmin',
}

export const adminTypeView = {
  [EAdminType.foundationAdmin]: 'Foundation Admin',
  [EAdminType.rewardsAdmin]: 'Rewards Admin',
  [EAdminType.treasuryAdmin]: 'Treasury Admin',
  [EAdminType.validationsAdmin]: 'Validations Admin',
}

const useGetAdminByType = (chainInfo: IChainInfo, abiName: EAbis, adminType: EAdminType): IUseGetAdminByType => {

  try {

    if (!(adminType in EAdminType)) {
      return { success: false, message: "Selected Admin-Type is not supported", address: null };
    }

    const propsRes = useReadSmartProps(chainInfo.protocolName, abiName, {
      functionName: adminType,
      args: [],
    });

    const isSysError = !propsRes.success;
    const sysError = propsRes.message;

    if (isSysError)
      return { success: false, message: sysError, address: null };

    const params = propsRes.data
    const res = useReadContract(params);
    const { error, status, isError, isSuccess, isPending, } = res;

    const data: boolean | undefined = res.data as boolean;

    const message = error ? error.message.split('\n')[0] : '';
    const success = (!isError && !message && tval.isString(data) && crypto.isAddress(data));
    const address = (success ? data : null);

    return { success, message, address, status, isError, isSuccess, isPending };
  } catch (e: any) {
    return { success: false, message: e.message, address: null };
  }
}

export default useGetAdminByType;

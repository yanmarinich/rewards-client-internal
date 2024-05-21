// import { ethers, AbiCoder } from "ethers";
import { useReadContract } from "wagmi";

import crypto from "@app/utils/crypto";

import {
  Address, EAbis, IBasicReadContractRes,
  IChainInfo, useReadSmartProps,
} from "./../useSmart";
import tval from "@app/utils/tval";
// import { ISCConfig } from "@app/config/interfaces";

export interface IValidatorReward {
  validator: Address;
  reward: number;
}

export interface IGetValidatedContribution {
  contributionId: number;
  metadataIdentifier: string;
  validatorAddress: Address;
  addressChain: Address;
  token: Address;
  reward: number;
  validatorRewards: IValidatorReward[];
}

export interface IGetValidatedContributionRes extends IBasicReadContractRes {
  data: IGetValidatedContribution | null;
}

const getValidatedContribution = (chainInfo: IChainInfo, abiName: EAbis, _id: number): IGetValidatedContributionRes => {

  try {

    // const cfg: ISCConfig = store.session((state) => (state.getSmartConfig()));
    const propsRes = useReadSmartProps(chainInfo.protocolName, abiName, {
      functionName: 'getValidatedContribution',
      args: [
        _id
      ],
    });

    const isSysError = !propsRes.success;
    const sysError = propsRes.message;

    if (isSysError)
      return { success: false, message: sysError, data: null };

    const params = propsRes.data
    const res = useReadContract(params);
    const { error, status, isError, isSuccess, isPending, } = res;
    const rawData: any[] | null = res.data as any[] | null;

    // const decodeRes = AbiCoder.defaultAbiCoder().decode(
    //   ['bytes4', 'uint32', 'bytes32', 'uint256', 'address', 'uint256', 'uint256'],
    //   Buffer.from(rawData, 'hex'),
    // );

    if (!tval.isArray(rawData))
      throw Error("No contribution data found");

    const result: IGetValidatedContribution = {
      contributionId: (+rawData[0].toString()) as number,
      metadataIdentifier: rawData[1].toString() as string,
      validatorAddress: rawData[2].toString() as Address,
      addressChain: rawData[3].toString() as Address,
      token: rawData[4].toString() as Address,
      reward: +crypto.fromWei(rawData[5], 18) as number,
      validatorRewards: (rawData[6] || [])
        .filter((v: IValidatorReward): boolean => {
          return !!(v?.validator && v?.reward);
        })
        .map((v: IValidatorReward): IValidatorReward => {
          return {
            validator: v.validator.toString() as Address,
            reward: +crypto.fromWei(v.reward.toString(), 18) as number,
          };
        })
    };

    if (!result?.token)
      throw Error("No contribution data found");

    const message = error ? error.message.split('\n')[0] : '';
    const success = (!message && tval.isString(result?.token));

    // {
    //   "result": {
    //     "contributionId": 1,
    //     "metadataIdentifier": "meta",
    //     "validatorAddress": "0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79",
    //     "addressChain": "0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79",
    //     "token": "0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79",
    //     "reward": 10,
    //     "validatorRewards": [
    //       {
    //         "validator": "0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79",
    //         "reward": 10
    //       }
    //     ]
    //   }
    // }

    return { success, message, isPending, isError, isSuccess, status, data: result };
  } catch (e: any) {
    return { success: false, message: e.message, data: null };
  }

}

export default getValidatedContribution;

import React, { FC, useRef, useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { getChains } from '@wagmi/core'
import { Chain } from "viem";

import { ICommonProps } from "../../interfaces";
import { Address, EAbis, useReadSmartProps } from "@app/hooks/useSmart";

import crypto from "@app/utils/crypto";
import * as Alert from "@app/utils/swal";
import tval from "@app/utils/tval";
import store from '@app/store';

import {
  IGetValidatedContribution,
  IValidatorReward
} from "@app/hooks/contributors/useGetValidatedContribution";

import AppRow from "@app/components/Layout/AppRow";
import ContinueButton from "@app/components/Layout/ContinueButton";
import Symbol from "@app/components/common/app/Symbol";

import useSymbol from "@app/hooks/erc20/useSymbol";
import useHasAdminRole from "@app/hooks/accessControl/useHasAdminRole";

import wagmiConfig from "@app/providers/wagmi/config";
import { EAccessControlRole, EAccessControlRoleName, ISmartContractParams } from "@app/contracts";
import { getTxErrorMessage } from "@app/contracts/utils";
import { accessControlRols, IAcccessControlRoles } from "@app/contracts/";
import useRolesManager from "@app/hooks/proxy/getRoleMemberCount";
import { InlineLoader } from "@app/components/common/app/InlineLoader";
// import AccessRoleSelector from "./AccessRoleSelector";

// _contribution_id (uint256) =>  0
// _metadata_identifier (string) =>  meta
// _validator_address (string) =>  0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79
// _address_chain (string) =>  0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79
// _token (string) =>  0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79
// _reward (uint256) =>  10000000000000000000
// _validator_addresses (address[]) =>  [0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79]
// _validator_rewards (uint256[]) =>  [10000000000000000000]

enum EInputType {
  text = 'text',
  number = 'number',
}

enum EInputSubType {
  address = 'address',
  number = 'number',
  string = 'string',
}

interface IInput {
  key: string;
  label: string;
  type: EInputType;
  subType: EInputSubType;
  ref?: React.RefObject<HTMLInputElement>;
};

// prettier-ignore
const inputs: IInput[] = [
  {
    key: 'contributionId', label: 'Contribution Id',
    type: EInputType.number, subType: EInputSubType.number
  },
  {
    key: 'metadataIdentifier', label: 'Metadata Identifier',
    type: EInputType.text, subType: EInputSubType.string
  },
  {
    key: 'validatorAddress', label: 'Validator Address',
    type: EInputType.text, subType: EInputSubType.address
  },
  {
    key: 'addressChain', label: 'Address Chain',
    type: EInputType.text, subType: EInputSubType.address
  },
  {
    key: 'token', label: 'Token',
    type: EInputType.text, subType: EInputSubType.address
  },
  {
    key: 'reward', label: 'Reward',
    type: EInputType.number, subType: EInputSubType.number
  },
];

const RolesManager: FC<ICommonProps> = ({
  chainInfo,
  abiName,
  symbol = '',
  onUpdateRequired
}) => {

  const setLoader = store.system((state) => (state.setLoader));
  const { writeContractAsync, writeContract } = useWriteContract();
  const { address, isConnecting, isDisconnected } = useAccount();

  const chains = getChains(wagmiConfig);
  const mChain = chains.find((chain: Chain) => (chain.id === chainInfo.chainId));
  const blockExplorerUrl = mChain?.blockExplorers?.default?.url || "";
  const blockExplorerName = mChain?.blockExplorers?.default?.name || "";

  const [validatedContribution, setValidatedContribution]
    = useState<IGetValidatedContribution>({
      contributionId: 0,
      metadataIdentifier: '',
      validatorAddress: '' as Address,
      addressChain: '' as Address,
      token: '' as Address,
      reward: 0,
      validatorRewards: [
        {
          validator: '' as Address,
          reward: 0
        }
      ],
    });

  // const [validatorRewards, setValidatorRewards] = useState<IValidatorReward[]>([])

  const onContinue = async () => {

    for (const inp of inputs) {
      const subType = inp.subType;
      const key = inp.key as keyof typeof validatedContribution;
      const value = validatedContribution[key];
      console.log(`${key}: (subType: ${subType}) => ${value}`);

      switch (subType) {
        case EInputSubType.address: {
          if (!crypto.isAddress(value as Address))
            return Alert.toast.error(`Provided valid: ${inp.label}`);
          break;
        }
        case EInputSubType.number: {
          if (!tval.isNumber(value) || value <= 0)
            return Alert.toast.error(`Provided valid: ${inp.label}`);
          break;
        }
        case EInputSubType.string: {
          break;
        }
      }

    }

    for (const validatorReward of validatedContribution.validatorRewards) {
      if (!crypto.isAddress(validatorReward.validator as Address))
        return Alert.toast.error(`Validator-adddress address is required`);
      if (!tval.isNumber(validatorReward.reward) || validatorReward.reward <= 0)
        return Alert.toast.error(`Validator-reward amount is not valid`);
    }

    console.json({ validatedContribution });

    // {
    //   "validatedContribution": {
    //     "contributionId": 12,
    //     "metadataIdentifier": "text",
    //     "validatorAddress": "0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79",
    //     "addressChain": "0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79",
    //     "token": "0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79",
    //     "reward": 1221,
    //     "validatorRewards": [
    //       {
    //         "validator": "0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79",
    //         "reward": 12
    //       }
    //     ]
    //   }
    // }

    // const validatorRewards: any[] = [];
    // validatedContribution.validatorRewards
    //   .forEach((validatorReward: IValidatorReward, index: number) => {
    //     validatorRewards.push({ key: 'Validator', value: crypto.toShortAddress(validatorReward.validator) });
    //     validatorRewards.push({ key: 'Redward', value: validatorReward.reward });
    //   });

    const table = Alert.createDialogTable(
      `Are you sure you continue ? `,
      [
        { key: 'ID', value: `${validatedContribution.contributionId}` },
        { key: 'Meta', value: `${validatedContribution.metadataIdentifier}` },
        { key: 'Validator-Address', value: crypto.toShortAddress(validatedContribution.validatorAddress as Address) },
        { key: 'Address-Chain', value: crypto.toShortAddress(validatedContribution.addressChain as Address) },
        { key: 'Token', value: crypto.toShortAddress(validatedContribution.token as Address) },
        { key: 'Reward', value: validatedContribution.reward.toString() },
        { key: '-------', value: '-------' },
        ...validatedContribution.validatorRewards
          .map((validatorReward: IValidatorReward, index: number) => {
            return {
              key: 'Validator',
              value: `${crypto.toShortAddress(validatorReward.validator)}: (${(+validatorReward.reward).toFixed(2)})`,
            };
          }),
      ]
    );

    const q = await Alert.confirm({
      title: `Confirm ?`,
      html: table
    });

    if (!q)
      return Alert.toast.success('Aborting...');

    const callData: any = [
      // crypto.toWei(validatedContribution.contributionId, 18).toString(),
      // crypto.toWei(validatedContribution.contributionId, 18).toString(),
      validatedContribution.contributionId,
      validatedContribution.metadataIdentifier || "",
      validatedContribution.validatorAddress,
      validatedContribution.addressChain,
      validatedContribution.token,
      crypto.toWei(validatedContribution.reward, 18).toString(),
      // _validator_addresses (address[])
      validatedContribution.validatorRewards.map((validatorReward: IValidatorReward) => (
        validatorReward.validator
      )),
      // _validator_rewards (uint256[])
      validatedContribution.validatorRewards.map((validatorReward: IValidatorReward) => (
        crypto.toWei(validatorReward.reward, 18).toString()
      )),
    ];

    // "callData": [
    //   "12000000000000000000",
    //   "0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79",
    //   "0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79",
    //   "0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79",
    //   "1221000000000000000000",
    //   [
    //     "0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79",
    //     "0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79",
    //     "0xE9339Bc14A5a5348Ca1ac5478e986725743D6C79"
    //   ],
    //   [
    //     "12000000000000000000",
    //     "123230000000000000000",
    //     "3434440000000000000000"
    //   ]
    // ]

    const propsRes = useReadSmartProps(chainInfo.protocolName, abiName, {
      functionName: 'addValidatedContribution',
      args: callData,
    });

    if (!propsRes.success) {
      setLoader("");
      Alert.alert.error(propsRes.message);
      return;
    }

    let isConfirmed = false;
    try {
      const timeout = setTimeout(() => {
        if (!isConfirmed) {
          setLoader("");
          Alert.alert.error("Failed: Transaction confirmation timeout . Please try again");
        }
      }, (60 * 1000));

      setLoader("Please approve transaction in your wallet");

      const params: any = propsRes.data as ISmartContractParams;
      writeContract(params);
      const mTxHash = await writeContractAsync(params);
      clearTimeout(timeout);
      isConfirmed = true;
      setLoader("");

      if (blockExplorerUrl) {
        const url = `${blockExplorerUrl}/tx/${mTxHash}`;
        await Alert.onTransactionSuccess(url, blockExplorerName);
      } else {
        await Alert.alert.success("Transaction has been completed successfully");
      }

      if (tval.isFunction(onUpdateRequired))
        onUpdateRequired();

    } catch (e: any) {
      isConfirmed = true;
      const message = getTxErrorMessage(e.message);
      Alert.alert.error(message);
      console.log(message);
      setLoader("");
    }

  }

  const addValidatorRewardRow = () => {

    validatedContribution.validatorRewards.push({
      validator: '' as Address,
      reward: 0 as number,
    });

    setValidatedContribution({
      ...validatedContribution,
    });

  }

  const removeValidatorRewardRow = (index: number) => {
    validatedContribution.validatorRewards.splice(index, 1);
    setValidatedContribution({
      ...validatedContribution,
    });
  }

  return (
    <>

      <AppRow withLine={true}>
        Add or Update Contributor:
      </AppRow>

      <AppRow withLine={true}>

        <div className="input-main-wrapper">

          <div className="pd-10">
            Main Contributor information:
          </div>

          {inputs.map((inp: IInput, index: number) => {
            const key = inp.key as keyof typeof validatedContribution;
            const value = validatedContribution[key];
            return (
              <div
                key={`inp-${index}`}
                className="pd-10"
              >
                <div className="pd-10">{inp.label}</div>
                <input
                  className="input-main"
                  type={inp.type}
                  // ref={inp.ref}
                  value={value as string | number}
                  onChange={(e) => {
                    const value = inp.subType === EInputSubType.number
                      ? (+e.target.value)
                      : e.target.value;

                    setValidatedContribution({
                      ...validatedContribution,
                      [key]: value || "",
                    })
                  }}
                />
              </div>
            )
          })}

          <AppRow withLine={true}>
            Validator-Rewards
          </AppRow>

          <div className="pd-30">
            {
              validatedContribution.validatorRewards
                .map((validatorReward: IValidatorReward, index: number) => {
                  const { validator, reward } = validatorReward;
                  return (
                    <div
                      key={`validator-reward-${index}`}
                      style={{ background: '#555', borderRadius: '5px', marginBottom: '20px' }}

                    >
                      <div className="pd-10">
                        <div className="pd-10">{'Validator Address'}</div>
                        <input
                          className="input-main"
                          type={'text'}
                          value={validator as string | number}
                          placeholder="Validator Address"
                          onChange={(e) => {
                            const value = e.target.value;
                            const validatorRewards = [
                              ...validatedContribution.validatorRewards,
                            ];
                            validatorRewards[index].validator = value as Address;
                            setValidatedContribution({
                              ...validatedContribution,
                              validatorRewards,
                            });
                          }}
                        />
                      </div>
                      <div className="pd-10">
                        <div className="pd-10">{'Validator reward'}</div>
                        <input
                          className="input-main"
                          type={'number'}
                          value={reward as string | number}
                          placeholder="Validator Reward"
                          onChange={(e) => {
                            const value = (+e.target.value) || "";
                            const validatorRewards = [
                              ...validatedContribution.validatorRewards,
                            ];
                            validatorRewards[index].reward = value as number;
                            setValidatedContribution({
                              ...validatedContribution,
                              validatorRewards,
                            });
                          }}
                        />
                      </div>


                      {/* validatedContribution.validatorRewards.length === 1 && (
                        <div className="pd-10">
                          <ContinueButton
                            text="Add Validator Reward"
                            // disabled={(!!roleMessage || !hasRole)}
                            onContinue={addValidatorRewardRow}
                          />
                        </div>
                      ) */}

                      {index > 0 && (
                        <div className="pd-10">
                          <ContinueButton
                            text="Remove Validator Reward"
                            // disabled={(!!roleMessage || !hasRole)}
                            onContinue={() => {
                              removeValidatorRewardRow(index);
                            }}
                          />
                        </div>
                      )}

                    </div>

                  )
                })
            }
          </div>

          <div className="pd-0">
            <ContinueButton
              text="Add Validator Reward"
              // disabled={(!!roleMessage || !hasRole)}
              onContinue={addValidatorRewardRow}
            />

          </div>

          <div className="pd-30">
            <ContinueButton
              text="Add Contributor"
              // disabled={(!!roleMessage || !hasRole)}
              onContinue={onContinue}
            />
          </div>

        </div>

      </AppRow >

    </>
  )

}

export default RolesManager;
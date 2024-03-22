import React, { FC, useRef } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { Chain } from "wagmi/chains";
import { getChains } from '@wagmi/core'

import "./index.scss";
import { ICommonProps } from "../../interfaces";
import { Address, getWriteSmartProps, IContractItem } from "@app/hooks/useSmart";
import wagmiConfig, { ids } from "@app/providers/wagmi/config";
import { getTxErrorMessage } from "@app/contracts/utils";

import * as Alert from "@app/utils/swal";
import tval from "@app/utils/tval";
import store from '@app/store';
import crypto from "@app/utils/crypto";
import { ISCConfig } from "@app/config/interfaces";
import { EAbis, ISmartContractParams } from "@app/contracts";

import useBalanceOf from "@app/hooks/erc20/useBalanceOf";
import { useContractConfig } from "@app/hooks/useContractConfig";

import AppRow from "@app/components/Layout/AppRow";
import ContinueButton from "@app/components/Layout/ContinueButton";

const IncreaseAllowance: FC<ICommonProps> = ({
  chainInfo, abiName, symbol = '', onUpdateRequired
}) => {

  const setLoader = store.system((state) => (state.setLoader));

  const inputRef = useRef<HTMLInputElement>(null);

  const { address, isConnecting, isDisconnected } = useAccount();
  const selectedContract: number = store.session((state) => (state.getSelectedContract()));
  const cfg: ISCConfig = store.session((state) => (state.getSmartConfig()));
  const contracts: IContractItem[] = useContractConfig(chainInfo).contracts;
  const chains = getChains(wagmiConfig);
  const mChain = chains.find((chain: Chain) => (chain.id === chainInfo.chainId));
  const blockExplorerUrl = mChain?.blockExplorers?.default?.url || "";
  const blockExplorerName = mChain?.blockExplorers?.default?.name || "";

  const { success, message, balance, isPending, isError } = useBalanceOf(
    chainInfo,
    abiName,
    address as Address
  );

  const {
    writeContract,
    writeContractAsync,
  } = useWriteContract();

  const onContinue = async () => {

    const allowance = Math.abs(+(inputRef?.current?.value || 0));

    if (!tval.isPosNumber(allowance))
      return Alert.toast.error(`Amount can't be (0) zero`);

    // if (balance < allowance)
    //   return Alert.toast.error(`Insufficient funds, balance:  ${balance}`);

    // const q = await Alert.confirm({
    //   title: "Approve Allowance",
    //   text: `Are you sure you want approve ${allowance} ?`
    // });

    // if (!q)
    //   return Alert.toast.success('Aborting...');

    const amount = crypto.toWei(allowance, 18).toString()
    const propsRes = getWriteSmartProps(chainInfo.protocolName, abiName, {
      functionName: 'approve',
      args: [
        cfg.proxy.address,
        amount,
      ],
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

      setLoader("Please approve transaction on your mobile wallet");

      const params: any = propsRes.data as ISmartContractParams;
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

  return (
    <AppRow withLine={true}>
      <div className="pd-10">
        Increase Allowance (Amount to Deposit) to:
        <br />
        {contracts[selectedContract].display}
        <br />
        {crypto.toShortAddress(cfg.proxy.address)}
      </div>

      <div className="pd-30">
        <input
          key={`allowance-input`}
          type="text"
          className="input-main"
          placeholder="Provide required amount"
          ref={inputRef}
        />
      </div>

      <div className="pd-10">
        <ContinueButton
          onContinue={onContinue}
          text="Approve Allowance"
          disabled={isPending}
        />
      </div>

    </AppRow>
  )

}

export default IncreaseAllowance;

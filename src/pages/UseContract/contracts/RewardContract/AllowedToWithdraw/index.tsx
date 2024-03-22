import React, { useEffect, FC, useState, useRef } from "react";
import { getChainId, getChains } from '@wagmi/core'
import { Chain } from "viem";

import { ICommonProps } from "../../interfaces";
import { Address, EAbis, IContractItem, useReadSmartProps } from "@app/hooks/useSmart";
import { useAccount, useWriteContract } from "wagmi";

import wagmiConfig, { ids } from "@app/providers/wagmi/config";

import { ISCConfig } from "@app/config/interfaces";
import { ISmartContractParams } from "@app/contracts";

import crypto from "@app/utils/crypto";
import * as Alert from "@app/utils/swal";
import tval from "@app/utils/tval";
import store from '@app/store';
// import config from "@app/config";

import AppRow from "@app/components/Layout/AppRow";
import { InlineLoader } from "@app/components/common/app/InlineLoader";
import Symbol from "@app/components/common/app/Symbol";

// import useAllowance from "@app/hooks/erc20/allowance";
import useSymbol from "@app/hooks/erc20/useSymbol";

import useAllowedToWithdraw from "@app/hooks/proxy/useAllowedToWithdraw";
import ContinueButton from "@app/components/Layout/ContinueButton";
import { useContractConfig } from "@app/hooks/useContractConfig";


const AllowedToWithdraw: FC<ICommonProps> = ({
  chainInfo,
  abiName,
  symbol = '',
  onUpdateRequired
}) => {

  const setLoader = store.system((state) => (state.setLoader));

  const { writeContractAsync, writeContract } = useWriteContract();

  // const chainInfo: IChainInfo = store.session((state) => (state.getChainInfo()));
  const { address, isConnecting, isDisconnected } = useAccount();

  const inputRef = useRef<HTMLInputElement>(null);

  const chains = getChains(wagmiConfig);
  const mChain = chains.find((chain: Chain) => (chain.id === chainInfo.chainId));
  const contracts: IContractItem[] = useContractConfig(chainInfo).contracts;
  const selectedContract: number = store.session((state) => (state.getSelectedContract()));
  const contract: IContractItem = contracts[selectedContract];
  const blockExplorerUrl = mChain?.blockExplorers?.default?.url || "";
  const blockExplorerName = mChain?.blockExplorers?.default?.name || "";

  // abiName = EAbis.erc20; // USE ERC20

  const symbolRes = useSymbol(chainInfo, EAbis.erc20);
  symbol = symbolRes.symbol;

  const { success, message, allowed, isPending } = useAllowedToWithdraw(
    chainInfo,
    abiName,
    address as Address
  );

  const setMax = () => {
    const input = inputRef?.current;
    if (input)
      input.value = allowed.toString();
  }

  const onContinue = async () => {

    const amountUInt: number = Math.abs(+(inputRef?.current?.value || 0));
    if (!tval.isPosNumber(amountUInt)) {
      return Alert.toast.error("Amount can't be (0) zero");
    }

    if (amountUInt > allowed)
      return Alert.toast.error(`Requested amount exceeds available: ${allowed}`);

    const amountBn = crypto.toWei(amountUInt, 18);
    const amount = amountBn.toString();

    const q = await Alert.confirm({
      title: "Withdraw",
      text: `Are you sure you want withdraw ${amountUInt} ?`
    });

    if (!q)
      return Alert.toast.success('Aborting...');

    const propsRes = useReadSmartProps(chainInfo.protocolName, abiName, {
      functionName: 'withdraw',
      args: [amount],
    });


    if (!propsRes.success) {
      setLoader("");
      Alert.alert.error(propsRes.message);
      return;
    }

    // let isConfirmed = false;
    try {
      // setTimeout(() => {
      //   if (!isConfirmed)
      //     throw new Error("Failed to confirm transaction. Please try again");
      // }, (10 * 1000));

      setLoader("Please approve transaction on your mobile wallet");

      const params: any = propsRes.data as ISmartContractParams;
      // const res = writeContract(params); // , {
      // console.log(res);

      const mTxHash = await writeContractAsync(params, {
        onError: (error) => {
          console.log(`error`, error)
        },
        onSuccess: async (hash) => {
          console.log(`hash`, hash)
        }
      });

      console.log({ mTxHash });
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
      const msgs = e.message.split('\n');
      // const message = msgs[0]
      Alert.alert.error(`${msgs[0]} ${msgs[1] ?? ""}`);
      console.log(msgs);
      setLoader("");
    }

  }

  return (
    <AppRow withLine={true}>

      <div className="pd-10">
        Allowed amount to withdraw
        {/*
        <br/>
        {crypto.toShortAddress(address)}
        */}
      </div>

      <div className="pd-10">
        {!success && (message)}
        {isPending && (<InlineLoader title="Updating..." />)}

        {success && (<Symbol symbol={symbol} value={allowed} />)}
      </div>

      <div className="pd-30">

        <input
          key={`allowance-input`}
          type="text"
          className="input-main"
          placeholder="Provide required amount"
          ref={inputRef}
        />

        <button
          disabled={isPending}
          className="system-btn system-btn-mini"
          onClick={() => { setMax() }}
        >
          MAX
        </button>

      </div>

      <div className="pd-10">
        <ContinueButton
          onContinue={onContinue}
          text="Withdraw"
          disabled={isPending}
        />
      </div>

    </AppRow>
  )

}

export default AllowedToWithdraw;

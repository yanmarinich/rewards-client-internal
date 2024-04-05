import React, { FC, useRef } from "react";
import { useWriteContract } from "wagmi";
import { getChains } from '@wagmi/core'
import { Chain } from "viem";

import { ICommonProps } from "@app/pages/UseContract/contracts/interfaces";
import { Address, EAbis, useReadSmartProps } from "@app/hooks/useSmart";

import crypto from "@app/utils/crypto";
import * as Alert from "@app/utils/swal";
import tval from "@app/utils/tval";
import store from '@app/store';

import AppRow from "@app/components/Layout/AppRow";
import ContinueButton from "@app/components/Layout/ContinueButton";
import Symbol from "@app/components/common/app/Symbol";

import wagmiConfig from "@app/providers/wagmi/config";
import { ISmartContractParams } from "@app/contracts";
import { getTxErrorMessage } from "@app/contracts/utils";

interface ITransferProps extends ICommonProps {
  currentAccountAddress: Address;
  tokenBalance: number;
  rewardBalance: number
  symbol: string;
}

const Transfer: FC<ITransferProps> = ({
  chainInfo,
  currentAccountAddress,
  tokenBalance,
  rewardBalance,
  symbol,
  onUpdateRequired,
}) => {

  const inputAmountRef = useRef<HTMLInputElement>(null);
  const inputAddressRef = useRef<HTMLInputElement>(null);

  const setLoader = store.system((state) => (state.setLoader));
  const { writeContractAsync, writeContract } = useWriteContract();

  const chains = getChains(wagmiConfig);
  const mChain = chains.find((chain: Chain) => (chain.id === chainInfo.chainId));
  const blockExplorerUrl = mChain?.blockExplorers?.default?.url || "";
  const blockExplorerName = mChain?.blockExplorers?.default?.name || "";

  const targetTokenContractAddress
    = store.session((state) => (state.getTargetCommuntyTokenContract()));

  const disabled = (+rewardBalance) === (0);

  const setMax = () => {
    const input = inputAmountRef?.current;
    if (input)
      input.value = rewardBalance.toString();
  }

  const setToOwnAddress = () => {
    const input = inputAddressRef?.current;
    if (input)
      input.value = currentAccountAddress;
  }

  const onContinue = async () => {

    const targetAddress: string = (inputAddressRef?.current?.value || "").trim();

    if (!crypto.isAddress(targetAddress))
      return Alert.toast.error(`Provided address is not valid`);

    const amountUInt: number = Math.abs(+(inputAmountRef?.current?.value || 0));
    if (!tval.isPosNumber(amountUInt))
      return Alert.toast.error("Amount can't be (0) zero");

    if (amountUInt > rewardBalance)
      return Alert.toast.error(`Requested amount exceeds available: ${rewardBalance}`);

    const amountBn = crypto.toWei(amountUInt, 18);
    const amount = amountBn.toString();

    const table = Alert.createDialogTable(
      "Are you sure you want Transfer ? ",
      [
        { key: 'Amount', value: `<b>${symbol}</b> ${amountUInt}` },
        { key: 'Token', value: `<b>${symbol}</b> ${crypto.toShortAddress(targetTokenContractAddress as Address)}` },
        { key: 'To', value: crypto.toShortAddress(targetAddress as Address) },
      ]
    );

    const q = await Alert.confirm({
      title: "Transfer",
      html: table
    });

    if (!q)
      return Alert.toast.success('Aborting...');

    // write: transfer( address: _to, address: _token, uint256: _amount ): void
    const propsRes = useReadSmartProps(chainInfo.protocolName, EAbis.communityAddress, {
      functionName: 'transfer',
      args: [
        targetAddress,
        targetTokenContractAddress,
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

      setLoader("Please approve transaction in your wallet");
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

      <div className="pd-30">
        Transfer {<Symbol symbol={symbol} />}
      </div>

      <div className="pd-30">

        <input
          key={`address-input`}
          type="text"
          className="input-main"
          placeholder="Transfer to Address"
          ref={inputAddressRef}
        />
        <button
          disabled={disabled}
          className="system-btn system-btn-mini"
          onClick={() => { setToOwnAddress() }}
        >
          Own
        </button>
      </div>

      <div className="pd-30">
        <input
          key={`amount-input`}
          type="text"
          className="input-main"
          placeholder="Provide required amount"
          ref={inputAmountRef}
        />

        <button
          disabled={disabled}
          className="system-btn system-btn-mini"
          onClick={() => { setMax() }}
        >
          MAX
        </button>

      </div>

      <div className="pd-10">
        <ContinueButton
          onContinue={onContinue}
          text={`Transfer ${symbol}`}
          disabled={disabled}
        />
      </div>

    </AppRow>
  )

}


export default Transfer;
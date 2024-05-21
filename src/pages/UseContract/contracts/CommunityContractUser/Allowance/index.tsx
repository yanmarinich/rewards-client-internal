import React, { FC, useRef } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { getChains } from '@wagmi/core'
import { Chain } from "viem";

import "./index.scss";
import { ICommonProps } from "../../interfaces";

import crypto from "@app/utils/crypto";
import * as Alert from "@app/utils/swal";
import tval from "@app/utils/tval";
import store from '@app/store';
import wagmiConfig from "@app/providers/wagmi/config";
import { ISmartContractParams } from "@app/contracts";
import { getTxErrorMessage } from "@app/contracts/utils";

import AppRow from "@app/components/Layout/AppRow";
import { InlineLoader } from "@app/components/common/app/InlineLoader";
import Symbol from "@app/components/common/app/Symbol";
import useAllowance from "@app/hooks/erc20/allowance";
import useSymbol from "@app/hooks/erc20/useSymbol";
import { Address, EAbis, useReadSmartProps } from "@app/hooks/useSmart";
import { ISCConfig } from "@app/config/interfaces";
import ContinueButton from "@app/components/Layout/ContinueButton";

const Allowance: FC<ICommonProps> = ({
  chainInfo, abiName, symbol = '', onUpdateRequired
}) => {

  const inputRef = useRef<HTMLInputElement>(null);
  const setLoader = store.system((state) => (state.setLoader));
  const { writeContractAsync, writeContract } = useWriteContract();

  const { address } = useAccount();

  const targetTokenContractAddress
    = store.session((state) => (state.getTargetCommuntyTokenContract()));

  const chains = getChains(wagmiConfig);
  const mChain = chains.find((chain: Chain) => (chain.id === chainInfo.chainId));
  const blockExplorerUrl = mChain?.blockExplorers?.default?.url || "";
  const blockExplorerName = mChain?.blockExplorers?.default?.name || "";

  const cfg: ISCConfig = store.session((state) => (state.getSmartConfig()));

  const symbolRes = useSymbol(
    chainInfo,
    abiName,
    targetTokenContractAddress as Address
  );

  symbol = symbolRes.symbol;

  const { success, message, allowance, isPending } = useAllowance(
    chainInfo,
    abiName,
    address as Address,
    cfg.communityAddress.address as Address,
    targetTokenContractAddress as Address
  );

  const setMax = () => {
    const input = inputRef?.current;
    if (input)
      input.value = allowance.toString();
  }

  const onContinue = async () => {

    const amountUInt: number = Math.abs(+(inputRef?.current?.value || 0));
    if (!tval.isPosNumber(amountUInt)) {
      return Alert.toast.error("Amount can't be (0) zero");
    }

    if (amountUInt > allowance)
      return Alert.toast.error(`Requested amount exceeds available: ${allowance}`);

    const amountBn = crypto.toWei(amountUInt, 18);
    const amount = amountBn.toString();

    const table = Alert.createDialogTable(
      "Are you sure you want deposit ? ",
      [
        { key: 'Amount', value: `<b>${symbol}</b> ${amountUInt}` },
        { key: 'Token', value: `<b>${symbol}</b> ${crypto.toShortAddress(targetTokenContractAddress as Address)}` },
        { key: 'To', value: crypto.toShortAddress(cfg.communityAddress.address as Address) },
      ]
    );

    const q = await Alert.confirm({
      title: "Deposit?",
      html: table
    });

    if (!q)
      return Alert.toast.success('Aborting...');

    const propsRes = useReadSmartProps(chainInfo.protocolName, EAbis.communityAddress, {
      functionName: 'deposit',
      args: [
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

      <div className="pd-20">
        <div className="pd-10">
          Allowed amount to deposit
        </div>
        <div className="pd-10">
          {!success && (message)}
          {isPending && (<InlineLoader title="Updating..." />)}
          {success && (<Symbol symbol={symbol} value={allowance} />)}
        </div>
      </div>

      <div className="pd-20">
        <div className="pd-30">
          <input
            key={`deposit-input`}
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
            text="Deposit"
            disabled={isPending}
          />
        </div>
      </div>

    </AppRow>
  )

}

export default Allowance;

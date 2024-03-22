import React, { FC, useRef } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { getChains } from '@wagmi/core'
import { Chain } from "viem";

import { ICommonProps } from "../../interfaces";
import { Address, EAbis, useReadSmartProps } from "@app/hooks/useSmart";

import crypto from "@app/utils/crypto";
import * as Alert from "@app/utils/swal";
import tval from "@app/utils/tval";
import store from '@app/store';

import AppRow from "@app/components/Layout/AppRow";
import ContinueButton from "@app/components/Layout/ContinueButton";
import Symbol from "@app/components/common/app/Symbol";

import useSymbol from "@app/hooks/erc20/useSymbol";
import useHasAdminRole from "@app/hooks/accessControl/useHasAdminRole";

import wagmiConfig from "@app/providers/wagmi/config";
import { ISmartContractParams } from "@app/contracts";
import { getTxErrorMessage } from "@app/contracts/utils";

const Reward: FC<ICommonProps> = ({
  chainInfo,
  abiName,
  symbol = '',
  onUpdateRequired
}) => {

  const addressRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);

  const setLoader = store.system((state) => (state.setLoader));
  const { writeContractAsync, writeContract } = useWriteContract();
  const { address, isConnecting, isDisconnected } = useAccount();

  const chains = getChains(wagmiConfig);
  const mChain = chains.find((chain: Chain) => (chain.id === chainInfo.chainId));
  const blockExplorerUrl = mChain?.blockExplorers?.default?.url || "";
  const blockExplorerName = mChain?.blockExplorers?.default?.name || "";

  const {
    success, message, hasRole
  } = useHasAdminRole(
    chainInfo,
    EAbis.accessControl,
    address as Address
  );

  const symbolRes = useSymbol(chainInfo, EAbis.erc20);
  symbol = symbolRes.symbol;

  const onContinue = async () => {

    const address: string = (addressRef?.current?.value || "").trim();
    if (!crypto.isAddress(address))
      return Alert.toast.error("Destination adddress is not valid");

    const amountUInt: number = Math.abs(+(amountRef?.current?.value || 0));
    if (!tval.isPosNumber(amountUInt))
      return Alert.toast.error("Amount can't be (0) zero");

    const note: string = (noteRef?.current?.value || "").trim();

    const amountBn = crypto.toWei(amountUInt, 18);
    const amount = amountBn.toString();

    const table = Alert.createDialogTable(
      "Are you sure you want create reward ? ",
      [
        { key: 'Amount', value: `${amountUInt}` },
        { key: 'Address', value: crypto.toShortAddress(address as Address) },
        { key: 'Note', value: (!!note.length ? note : 'Empty note') },
      ]
    );

    const q = await Alert.confirm({
      title: "Confirm Reward",
      html: table
    });

    if (!q)
      return Alert.toast.success('Aborting...');

    const propsRes = useReadSmartProps(chainInfo.protocolName, abiName, {
      functionName: 'reward',
      args: [
        address,
        amount,
        note,
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


  return (
    <>
      <AppRow withLine={true}>
        <div className="pd-10">
          <div>Current Account: </div>
          <div>{address}</div>
          {
            (message || !hasRole)
              ? <b className="red">{message || "You are not in the Admin group"}</b>
              : <b className="green">{"You are Administrator"}</b>
          }
        </div>

      </AppRow>


      <AppRow withLine={true}>
        <div className="pd-10">
          Reward <Symbol symbol={symbol} /> Token Holder
        </div>

        <div className="input-main-wrapper">
          <div className="input-main-lable">Destination Addreess</div>
          <input
            key={`target-address-input`}
            type="text"
            className="input-main"
            placeholder="Destionation Address"
            defaultValue={"0x417fff1315774037da11ed348e82A3a6912875B8"}
            ref={addressRef}
          />
        </div>

        <div className="input-main-wrapper">
          <div className="input-main-lable">Reward Amount</div>
          <input
            key={`target-amount-input`}
            type="text"
            className="input-main"
            placeholder="Destionation Address"
            defaultValue={"0.25"}
            ref={amountRef}
          />
        </div>

        <div className="input-main-wrapper">
          <div className="input-main-lable">Reward Note</div>
          <input
            key={`target-note-input`}
            type="text"
            className="input-main"
            placeholder="Reward Note"
            defaultValue={""}
            ref={noteRef}
          />
        </div>

        <div className="pd-10">
          <ContinueButton
            onContinue={onContinue}
            text="Reward"
            disabled={!(success && hasRole)}
          />
        </div>

      </AppRow>
    </>
  )

}

export default Reward;

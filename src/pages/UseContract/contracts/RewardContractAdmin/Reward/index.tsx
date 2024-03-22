import React, { useEffect, FC, useState, useRef } from "react";
import { useAccount, useWriteContract } from "wagmi";
import { getChainId, getChains } from '@wagmi/core'
import { Chain } from "viem";

import { ICommonProps } from "../../interfaces";
import { Address, EAbis, IContractItem, useReadSmartProps } from "@app/hooks/useSmart";

// import config from "@app/config";
import { ISCConfig } from "@app/config/interfaces";
import crypto from "@app/utils/crypto";
import * as Alert from "@app/utils/swal";
import tval from "@app/utils/tval";
import store from '@app/store';
// import config from "@app/config";

import AppRow from "@app/components/Layout/AppRow";
import { InlineLoader } from "@app/components/common/app/InlineLoader";
import ContinueButton from "@app/components/Layout/ContinueButton";
import Symbol from "@app/components/common/app/Symbol";

import { useContractConfig } from "@app/hooks/useContractConfig";
// import useAllowance from "@app/hooks/erc20/allowance";
import useSymbol from "@app/hooks/erc20/useSymbol";
import useHasAdminRole from "@app/hooks/accessControl/useHasAdminRole";

import wagmiConfig from "@app/providers/wagmi/config";
import { ISmartContractParams } from "@app/contracts";


const Reward: FC<ICommonProps> = ({
  chainInfo,
  abiName,
  symbol = '',
  onUpdateRequired
}) => {

  const addressRef = useRef<HTMLInputElement>(null);
  const amountRef = useRef<HTMLInputElement>(null);
  const noteRef = useRef<HTMLInputElement>(null);

  // const [isPending, setItPending] = useState<boolean>(false);
  const setLoader = store.system((state) => (state.setLoader));
  const { writeContractAsync, writeContract } = useWriteContract();
  const { address, isConnecting, isDisconnected } = useAccount();
  // const chainInfo: IChainInfo = store.session((state) => (state.getChainInfo()));

  const chains = getChains(wagmiConfig);
  const mChain = chains.find((chain: Chain) => (chain.id === chainInfo.chainId));
  const contracts: IContractItem[] = useContractConfig(chainInfo).contracts;
  const selectedContract: number = store.session((state) => (state.getSelectedContract()));
  const contract: IContractItem = contracts[selectedContract];
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
    // if (!tval.isString(note))
    //   return Alert.toast.error("Reward note is not valid string");

    const amountBn = crypto.toWei(amountUInt, 18);
    const amount = amountBn.toString();

    const q = await Alert.confirm({
      title: "Confirm Reward",
      html: `
        <h4>Are you sure you want create reward ? </h4>
        <table style="width: 100%;">
          <tbody>
            <tr>
              <td style="width: 50%;" class="text-right">Amount:</td>
              <td class="text-left"><b>${amountUInt}</b></td>
            </tr>
            <tr>
              <td style="width: 50%;" class="text-right">Address:</td>
              <td class="text-left"><b>${crypto.toShortAddress(address as Address)}</b></td>
            </tr>
            <tr>
              <td style="width: 50%;" class="text-right">Note:</td>
              <td class="text-left"><b>${!!note.length ? note : 'Empty note'}</b></td>
            </tr>
          </tbody>
        </table>
      `
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
      setTimeout(() => {
        if (!isConfirmed)
          setLoader("");
        Alert.alert.error("Failed: Transaction confirmation timeout . Please try again");
      }, (60 * 1000));

      setLoader("Please approve transaction on your mobile wallet");

      const params: any = propsRes.data as ISmartContractParams;

      const mTxHash = await writeContractAsync(params);
      isConfirmed = true;

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
      isConfirmed = true;
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
        Reward <Symbol symbol={symbol} /> Token Holder
        {/*
        <br />
        {crypto.toShortAddress(address)}
        */}
      </div>

      {/*
      <div className="pd-10">
        {!success && (message)}
        {isPending && (<InlineLoader title="Updating..." />)}
        {success && (<Symbol symbol={symbol} value={allowance} />)}
      </div>
      */}

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
        {message || !hasRole ? <b className="red">{message || "You are not in the Admin group"}</b> : <i>&nbsp;</i>}
      </div>

      <div className="pd-10">
        <ContinueButton
          onContinue={onContinue}
          text="Reward"
          disabled={!(success && hasRole)}
        />
      </div>

    </AppRow>
  )

}

export default Reward;

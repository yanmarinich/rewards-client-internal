import React, { FC, useRef } from "react";
import { useAccount } from "wagmi";
import { getChains } from '@wagmi/core'
import { Chain } from "viem";

import { ICommonProps } from "../../interfaces";
import { Address, EAbis } from "@app/hooks/useSmart";

import crypto from "@app/utils/crypto";
import * as Alert from "@app/utils/swal";
import store from '@app/store';

import AppRow from "@app/components/Layout/AppRow";
import ContinueButton from "@app/components/Layout/ContinueButton";
import Symbol from "@app/components/common/app/Symbol";

import useSymbol from "@app/hooks/erc20/useSymbol";

import wagmiConfig from "@app/providers/wagmi/config";
import { InlineLoader } from "@app/components/common/app/InlineLoader";

const SelectTokenContract: FC<ICommonProps> = ({
  chainInfo,
  abiName,
  // symbol = '',
  onUpdateRequired
}) => {

  const targetTokenAddressRef = useRef<HTMLInputElement>(null);

  const targetTokenContractAddress
    = store.session((state) => (state.getTargetCommuntyTokenContract()));

  const setTargetCommuntyTokenContract
    = store.session((state) => (state.setTargetCommuntyTokenContract));

  const { address, isConnecting, isDisconnected } = useAccount();
  const chains = getChains(wagmiConfig);

  const {
    symbol,
    success,
    isPending,
    message: _message
  } = useSymbol(
    chainInfo,
    EAbis.erc20,
    targetTokenContractAddress
  );

  const isValidERC20Contract
    = !(!!`${_message}`.match(/the contract function "symbol" returned/i));

  const message = !isValidERC20Contract
    ? 'Providerd Address is not ERC20 Token'
    : _message;

  const onContinue = async () => {

    const address: Address = (targetTokenAddressRef?.current?.value || "").trim() as Address;
    if (!crypto.isAddress(address))
      return Alert.toast.error("Destination contract adddress is not valid");

    if (targetTokenContractAddress === address)
      return Alert.toast.error("Destination contract adddress has been already set");

    setTargetCommuntyTokenContract(address);

  }

  return (
    <>
      <AppRow withLine={true}>
        <div className="pd-10">
          <div>Current Account: </div>
          <div>{address}</div>
        </div>
      </AppRow>

      <AppRow withLine={true}>

        <div className="pd-10">
          {!success && (message)}
          {isPending && (<InlineLoader title="Updating..." />)}
          {success && (<Symbol symbol={symbol} value={''} />)}
        </div>

        <div className="input-main-wrapper">
          <div className="input-main-lable">Set token address to interact with</div>
          <input
            key={`target-token-contract-address-input`}
            type="text"
            className="input-main"
            placeholder="Set token address to interact with"
            defaultValue={targetTokenContractAddress || ""}
            ref={targetTokenAddressRef}
          />
        </div>

        <div className="pd-10">
          <ContinueButton
            onContinue={onContinue}
            text="Set Contract"
          />
        </div>

      </AppRow>
    </>
  )

}

export default SelectTokenContract;

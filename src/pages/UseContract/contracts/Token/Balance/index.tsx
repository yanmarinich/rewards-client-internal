import React, { useEffect, FC, useState } from "react";
import { ICommonProps } from "../../interfaces";
import { Address, useReadSmart, useReadSmartProps } from "@app/hooks/useSmart";
import { useAccount, useReadContract } from "wagmi";

import config from "@app/config";
import store from '@app/store';
import crypto from "@app/utils/crypto";
import AppRow from "@app/components/Layout/AppRow";
import { InlineLoader } from "@app/components/common/app/InlineLoader";
import Symbol from "@app/components/common/app/Symbol";

import useSymbol from "@app/hooks/erc20/useSymbol";
import useBalanceOf from "@app/hooks/erc20/useBalanceOf";

const Balance: FC<ICommonProps> = ({ chainInfo, abiName, symbol = '' }) => {

  // const chainInfo: IChainInfo = store.session((state) => (state.getChainInfo()));
  const { address, isConnecting, isDisconnected } = useAccount();

  const symbolRes = useSymbol(chainInfo, abiName);
  symbol = symbolRes.symbol;

  const { success, message, balance, isPending } = useBalanceOf(
    chainInfo,
    abiName,
    address as Address
  );

  return (
    <AppRow withLine={true}>
      <div className="pd-10">
        Account Balance: {crypto.toShortAddress(address)}
      </div>
      <div className="pd-10">
        {(!success && message) ? message : ''}
        {isPending && (<InlineLoader title="Updating..." />)}
        {success && (<Symbol symbol={symbol} value={balance} />)}
      </div>
    </AppRow>
  )

}

export default Balance;

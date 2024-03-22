import React, { FC } from "react";
import { useAccount } from "wagmi";

import "./index.scss";
import { ICommonProps } from "../../interfaces";

import crypto from "@app/utils/crypto";
import AppRow from "@app/components/Layout/AppRow";
import { InlineLoader } from "@app/components/common/app/InlineLoader";
import Symbol from "@app/components/common/app/Symbol";

import { Address } from "@app/hooks/useSmart";
import useSymbol from "@app/hooks/erc20/useSymbol";
import useBalanceOf from "@app/hooks/erc20/useBalanceOf";

const Balance: FC<ICommonProps> = ({ chainInfo, abiName, symbol = '' }) => {

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

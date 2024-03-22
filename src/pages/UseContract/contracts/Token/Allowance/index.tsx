import React, { useEffect, FC, useState } from "react";
import { ICommonProps } from "../../interfaces";
import { Address } from "@app/hooks/useSmart";
import { useAccount } from "wagmi";

import { ISCConfig } from "@app/config/interfaces";
import crypto from "@app/utils/crypto";
import AppRow from "@app/components/Layout/AppRow";
import { InlineLoader } from "@app/components/common/app/InlineLoader";
import Symbol from "@app/components/common/app/Symbol";
import useAllowance from "@app/hooks/erc20/allowance";
import useSymbol from "@app/hooks/erc20/useSymbol";

// import config from "@app/config";
// import store from '@app/store';

const Allowance: FC<ICommonProps> = ({ chainInfo, abiName, symbol = '' }) => {

  // const chainInfo: IChainInfo = store.session((state) => (state.getChainInfo()));
  const { address, isConnecting, isDisconnected } = useAccount();

  const symbolRes = useSymbol(chainInfo, abiName);
  symbol = symbolRes.symbol;

  const { success, message, allowance, isPending } = useAllowance(
    chainInfo,
    abiName,
    address as Address
  );

  return (
    <AppRow withLine={true}>
      <div className="pd-10">
        Allowed amount to deposit
        {/*
        <br />
        {crypto.toShortAddress(address)}
        */}
      </div>
      <div className="pd-10">
        {!success && (message)}
        {isPending && (<InlineLoader title="Updating..." />)}
        {success && (<Symbol symbol={symbol} value={allowance} />)}
      </div>
    </AppRow>
  )

}

export default Allowance;

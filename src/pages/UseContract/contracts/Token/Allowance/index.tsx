import React, { FC } from "react";
import { useAccount } from "wagmi";

import "./index.scss";
import { ICommonProps } from "../../interfaces";

import AppRow from "@app/components/Layout/AppRow";
import { InlineLoader } from "@app/components/common/app/InlineLoader";
import Symbol from "@app/components/common/app/Symbol";
import useAllowance from "@app/hooks/erc20/allowance";
import useSymbol from "@app/hooks/erc20/useSymbol";
import { Address } from "@app/hooks/useSmart";

const Allowance: FC<ICommonProps> = ({ chainInfo, abiName, symbol = '' }) => {

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

import React, { FC } from "react";

import "./index.scss";

export interface ISymbol {
  symbol: string;
  value?: any
}

const Symbol: FC<ISymbol> = ({ symbol, value }) => {

  const showValue = typeof value === "number";
  const amount = (+value).toFixed(6)

  return (
    <div className="symbol-wrapper">
      <span className="symbol-symbol">
        {symbol}
      </span>
      {showValue && (
        <span className="symbol-value">
          {amount}
        </span>
      )}
    </div>
  )
}

export default Symbol;
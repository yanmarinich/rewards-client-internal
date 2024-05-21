import React, { FC } from "react";

import "./index.scss";

export interface ISymbol {
  symbol: string;
  value?: any
  toFixed?: number;
}

const Symbol: FC<ISymbol> = ({ symbol, value, toFixed = 6 }) => {

  const showValue = typeof value === "number";
  const amount = (+value).toFixed(toFixed);

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
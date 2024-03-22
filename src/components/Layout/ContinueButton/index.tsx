import React, { useEffect, FC } from "react";

import tval from "../../../utils/tval";
import { IAppProps } from "../../../interfaces/app.interfaces"

import "./index.scss";

export interface IContinueButton extends IAppProps {
  text?: string;
  onContinue(): void;
  disabled?: boolean;
}

const ContinueButton: FC<IContinueButton> = ({
  onContinue,
  text = "Contiue",
  disabled = false
}: IContinueButton) => {

  // useEffect(() => {}, []);

  return (
    <button
      disabled={disabled}
      className="system-btn"
      onClick={() => {
        if (tval.isFunction(onContinue)) {
          onContinue();
        }
      }}
    >
      {text || "Continue"}
    </button>
  );

};

export default ContinueButton;

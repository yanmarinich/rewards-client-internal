import React, { FC } from "react";

import tval from "@app/utils/tval";
import { IAppProps } from "@app/interfaces/app.interfaces"
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

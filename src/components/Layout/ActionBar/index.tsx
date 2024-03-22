import React, { useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";

import "./index.scss";
import "@app/utils/prototype";

export interface IActionBarProps {
  disabled: boolean;
  onAction: string;
  text?: string
}

const ActionBar: FC<IActionBarProps> = ({ text, disabled, onAction }) => {

  const navigate = useNavigate();

  return (
    <div className="action-bar-wrapper">
      <div className="item">
        <button
          title="Back"
          disabled={disabled}
          onClick={() => {
            navigate(onAction);
          }}
        >
          {text || <span>&lt; Back</span>}
        </button>
      </div>

    </div>
  );
};

export default ActionBar;

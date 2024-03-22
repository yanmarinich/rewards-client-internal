import React, { useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";

import "./index.scss";
import "../../../utils/prototype";
// import * as Alert from "../../../utils/swal";
// import config from "../../../config";

export interface IActionBarProps {
  disabled: boolean;
  onAction: string;
}

const ActionBar: FC<IActionBarProps> = ({ disabled, onAction }) => {

  // useEffect(() => {}, []);
  const navigate = useNavigate();

  return (
    <div className="action-bar-wrapper">
      <div className="item">
        <button
          title="Back"
          disabled={disabled}
          onClick={() => {
            // window.location.href = onAction;
            navigate(onAction);
          }}
        >
          &lt; Back
        </button>
      </div>

    </div>
  );
};

export default ActionBar;

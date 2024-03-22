import React, { FC, useEffect } from "react";

import "@app/utils/prototype";
import { ConnectKitButton } from "connectkit";
import crypto from "@app/utils/crypto";

import "./index.scss";

const ConnectButton: FC = () => {

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
        // console.log({ isConnected, isConnecting });
        return (
          <button
            onClick={show}
            className="system-btn-width custom-connect-button"
            style={{}}
          >
            <div
              style={{ fontFamily: (isConnected ? 'monospace' : ''), fontSize: '0.85rem' }}
            >
              {isConnected ? crypto.toShortAddress(address) : "Connect"}
            </div>
          </button>
        );
      }}
    </ConnectKitButton.Custom>

  );

};


export default ConnectButton;

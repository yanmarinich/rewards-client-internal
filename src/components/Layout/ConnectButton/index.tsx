import React, { useEffect } from "react";

import { ConnectKitButton } from "connectkit";
// import { useChains, ChainIcon, useChainIsSupported } from "connectkit";
// import { useAccount, useSwitchChain, useDisconnect } from "wagmi";

import "./index.scss";
import "@app/utils/prototype";

import crypto from "@app/utils/crypto";

// import * as Alert from "@app/utils/swal";
// import config from "@app/config";
// import store from '@app/store';

const ConnectButton = () => {

  // const setLoader = store.system((state) => (state.setLoader));
  // const { address, isConnecting, isDisconnected } = useAccount();
  // const { disconnect } = useDisconnect();
  // const isConnected = ((isConnecting || !isDisconnected) && address);


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

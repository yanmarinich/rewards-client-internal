import React, { useEffect } from "react";
import { useChains, ChainIcon, ConnectKitButton, useChainIsSupported } from "connectkit";
import { useAccount, useSwitchChain, useDisconnect } from "wagmi";

import "./index.scss";
import "../../../utils/prototype";

import * as Alert from "../../../utils/swal";
import config from "../../../config";
import store from '../../../store';

import ConnectButton from "../ConnectButton";

const TopBar = () => {

  const setLoader = store.system((state) => (state.setLoader));

  const { address, isConnecting, isDisconnected } = useAccount();
  const { disconnect: _disconnect } = useDisconnect();

  const isConnected = ((isConnecting || !isDisconnected) && address);

  const disconnect = (): void => {
    setLoader("Processing...");
    setTimeout(() => {
      _disconnect();
      setTimeout(() => {
        setLoader("");
      }, 1000);
    }, 500);
  }

  // useEffect(() => {}, []);

  return (
    <div className="top-bar-wrapper">

      <div className="item hide-on-sm">
        <a
          title="Home"
          href="/"
          className="logo"
        >
          {config.appName}
        </a>
      </div>

      <div className="item">
        {isConnected && (
          <button
            onClick={() => { disconnect() }}
          >
            Disconnect
          </button>
        )}
        {!isConnected && (
          <ConnectButton />
        )}

        {/*
        {!isConnected && (
          <ConnectKitButton
            showBalance={true}
            showAvatar={false}
          />
        )}
        */}

      </div>

    </div>

  );

};


export default TopBar;

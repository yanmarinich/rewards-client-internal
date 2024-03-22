import React, { useEffect, useState } from "react";
import { useChains, ChainIcon, ConnectKitButton, useChainIsSupported } from "connectkit";
import { useAccount, useSwitchChain, useDisconnect } from "wagmi";

import "./index.scss";
import "@app/utils/prototype";

import * as Alert from "@app/utils/swal";
import config from "@app/config";
import store from '@app/store';

import ConnectButton from "../ConnectButton";

const TopBar = () => {

  const setLoader = store.system((state) => (state.setLoader));

  const { address, isConnecting, isDisconnected } = useAccount();
  const { disconnect: _disconnect } = useDisconnect();

  const [end, setOnEnd] = useState<boolean>(false);

  const isConnected = ((isConnecting || !isDisconnected) && address);

  const disconnect = (): void => {
    setLoader("Processing...");
    setTimeout(() => {
      _disconnect();
      setOnEnd(true);
      // setTimeout(() => {
      //   setLoader("");
      // }, 1000);
    }, 500);
  }

  useEffect(() => {
    if (end) {
      setTimeout(() => {
        setLoader("");
      }, 1000);
    }
  }, [end]);

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

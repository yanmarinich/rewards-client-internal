import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useSwitchChain, useDisconnect } from "wagmi";

import store from "@app/store";

export const useGoAndConnect = () => {

  const setLoader = store.system((state) => (state.setLoader));

  // const chainIsSupported = useChainIsSupported(chainId);
  const { address, isConnecting, isDisconnected } = useAccount();
  const navigate = useNavigate();

  if ((!isConnecting || isDisconnected) && !address) {
    setTimeout(() => {
      console.log(`redirect: /`);
      navigate('/');
    }, (50));
  }

}
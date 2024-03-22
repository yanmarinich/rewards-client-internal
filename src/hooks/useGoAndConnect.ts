import React from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";

export const useGoAndConnect = () => {

  const { address, isConnecting, isDisconnected } = useAccount();
  const navigate = useNavigate();

  if ((!isConnecting || isDisconnected) && !address) {
    setTimeout(() => {
      navigate('/');
    }, (50));
  }

}
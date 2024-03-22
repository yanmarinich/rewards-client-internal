import React, { useEffect, FC, useState } from "react";

import { Chain } from "wagmi/chains";
import { getChainId, getChains } from '@wagmi/core'
// import { useReadContract, useWriteContract, UseReadContractReturnType } from 'wagmi'
// import { useAccount, useSwitchChain, useDisconnect } from "wagmi";
// import { useChains, ChainIcon, ConnectKitButton, useChainIsSupported } from "connectkit";

import "./index.scss";

import "@app/utils/prototype";
import * as Alert from "@app/utils/swal";

import wagmiConfig, { ids } from "@app/providers/wagmi/config";

// import crypto from "@app/utils/crypto";
// import config from "@app/config";
// import { IRes } from "@app/utils/http";
// import tval from "@app/utils/tval";
// import getParams from "@app/utils/params";
// import { connectSocialProfileRequest } from "@app/utils/api";

import store from '@app/store';

import {
  EAbis,
  IChainInfo,
  IContractItem,
  // useReadSmart,
  // useReadSmartProps,
  // EAbis,
  // Address,
  // getProtocolNameByChainId,
  // EProtocol,
  // isSupportedProtocol,
  // getWriteSmartProps
} from "@app/hooks/useSmart";

import { IAppProps } from "@app/interfaces/app.interfaces";
import { ISCConfig } from "@app/config/interfaces";

// import Balance from "../Token/Balance";
// import AllowedToDeposit from "./AllowedToDeposit";
import Reward from "./Reward";

import { useContractConfig } from "@app/hooks/useContractConfig";

const RewardContractAdmin: FC<IAppProps> = (props: IAppProps) => {

  const [stateId, setStateId] = useState<number>(0);

  const chainInfo: IChainInfo = store.session((state) => (state.getChainInfo()));
  const selectedContract: number = store.session((state) => (state.getSelectedContract()));
  // const setSelectedContract = store.session((state) => (state.setSelectedContract));

  const chains = getChains(wagmiConfig);
  const mChain = chains.find((chain: Chain) => (chain.id === chainInfo.chainId));
  // const { chains: _chains, switchChain } = useSwitchChain()
  // const blockExplorerUrl = mChain?.blockExplorers?.default?.url || "";
  // const blockExplorerName = mChain?.blockExplorers?.default?.name || "";

  // const cfg: ISCConfig = store.session((state) => (state.getSmartConfig()));
  // const setSmartConfig = store.session((state) => (state.setSmartConfig));
  // const cfg: ISCConfig = config.SC[chainInfo.protocolName];

  // const isContractSelected = (selectedContract !== -1);

  const contracts: IContractItem[] = useContractConfig(chainInfo).contracts;

  const contract = contracts[selectedContract];

  const onContinue = () => { }

  const onUpdateRequired = () => {
    setStateId(Date.now());
  }

  useEffect(() => {
    if (selectedContract === -1) {
      return;
    }

    if (!stateId) {
      setStateId(Date.now());
    }

  }, [selectedContract, stateId]);


  return (
    <div key={`state-${stateId}`}>

      <Reward
        chainInfo={chainInfo}
        abiName={contract.abiName}
        contracts={contracts}
      />

      {/*
      <Balance
        chainInfo={chainInfo}
        // abiName={contract.abiName}
        abiName={EAbis.erc20}
        contracts={contracts}
      />

      <AllowedToDeposit
        chainInfo={chainInfo}
        abiName={contract.abiName}
        onUpdateRequired={onUpdateRequired}
      />

      <AllowedToWithdraw
        chainInfo={chainInfo}
        abiName={contract.abiName}
        onUpdateRequired={onUpdateRequired}
      />
      */}

    </div>
  );
};

export default RewardContractAdmin;

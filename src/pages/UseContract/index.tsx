import React, { useEffect, FC, useState } from "react";
import { useNavigate } from "react-router-dom";

// import { useReadContract, useWriteContract, UseReadContractReturnType } from 'wagmi'
// import { useAccount, useSwitchChain, useDisconnect } from "wagmi";
import { Chain } from "wagmi/chains";
import { getChainId, getChains } from '@wagmi/core'

import "./index.scss";

import "@app/utils/prototype";
import * as Alert from "@app/utils/swal";

// import { ISCConfig } from "@app/config/interfaces";
// import Loader from "@app/components/Loader";
// import config from "@app/config";

import wagmiConfig, { ids } from "@app/providers/wagmi/config";

// import crypto from "@app/utils/crypto";
// import { IRes } from "@app/utils/http";
// import tval from "@app/utils/tval";
// import getParams from "@app/utils/params";
// import { connectSocialProfileRequest } from "@app/utils/api";

import store from '@app/store';

import {
  IChainInfo,
  IContractItem,
  // useReadSmart,
  // EAbis,
  // Address,
  // getProtocolNameByChainId,
  // EProtocol,
  // isSupportedProtocol,
  // getWriteSmartProps
} from "@app/hooks/useSmart";

import { useGoAndConnect } from "@app/hooks/useGoAndConnect";
import { useContractConfig } from "@app/hooks/useContractConfig";

import ActionBar from "@app/components/Layout/ActionBar";
import AppRoot from "@app/components/Layout/AppRoot";
import AppRowTitle from "@app/components/Layout/AppRowTitle";
import AppRow from "@app/components/Layout/AppRow";
import FooterShowChainInfo from "@app/components/common/FooterShowChainInfo";
// import ConnectButton from "@app/components/Layout/ConnectButton";
// import ContinueButton from "@app/components/Layout/ContinueButton";

import { IAppProps } from "@app/interfaces/app.interfaces";

import ContractToken from "./contracts/Token";
import RewardContract from "./contracts/RewardContract";

const UserContract: FC<IAppProps> = (props: IAppProps) => {

  useGoAndConnect();

  // const setLoader = store.system((state) => (state.setLoader));
  const navigate = useNavigate();

  const chainInfo: IChainInfo = store.session((state) => (state.getChainInfo()));

  const selectedContract: number = store.session((state) => (state.getSelectedContract()));
  // const setSelectedContract = store.session((state) => (state.setSelectedContract));

  // const smartConfig: ISCConfig = store.session((state) => (state.getSmartConfig()));
  // const setSmartConfig = store.session((state) => (state.setSmartConfig));
  // const chainIsSupported = useChainIsSupported(chainId);

  const chains = getChains(wagmiConfig);
  const mChain = chains.find((chain: Chain) => (chain.id === chainInfo.chainId));

  const blockExplorerUrl = mChain?.blockExplorers?.default?.url || "";
  const blockExplorerName = mChain?.blockExplorers?.default?.name || "";

  // const { chains: _chains, switchChain } = useSwitchChain()
  // const cfg: ISCConfig = config.SC[chainInfo.protocolName];

  const isContractSelected = (selectedContract !== -1);

  const contracts: IContractItem[] = useContractConfig(chainInfo).contracts;

  const onContinue = () => { }

  const redirectWithMessage = async () => {
    await Alert.alert.error("Please select Smart-Contract");
    navigate("/select-contract");
  }

  useEffect(() => {
    if (selectedContract === -1) {
      redirectWithMessage();
      return;
    }
  }, [selectedContract]);

  const SmartContracts = [
    ContractToken,
    RewardContract,
  ];

  const ContractWrapperNotFound = () => {
    return (
      <AppRow withLine={true}>
        <h4>Contract wrapper not found</h4>
      </AppRow>
    )
  }

  const RenderComponent = () => {
    const Smart = SmartContracts[selectedContract];
    return Smart
      ? <Smart />
      : <ContractWrapperNotFound />

  }

  return (
    <>

      <ActionBar disabled={false} onAction="/select-contract" />

      <AppRoot>

        <AppRowTitle>
          {isContractSelected && (
            <span>
              {mChain?.name}: {contracts[selectedContract].display}
            </span>
          )}
        </AppRowTitle>

        <RenderComponent />

        <AppRow withLine={true}>
          <FooterShowChainInfo {...chainInfo} />
        </AppRow>

      </AppRoot>
    </>
  );
};

export default UserContract;

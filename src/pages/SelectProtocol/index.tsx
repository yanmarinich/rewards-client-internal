import React, { useEffect, FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChains, ChainIcon, ConnectKitButton, useChainIsSupported } from "connectkit";
import { useAccount, useSwitchChain, useDisconnect } from "wagmi";
import { getChainId } from '@wagmi/core'

import "./index.scss";

import "@app/utils/prototype";
import * as Alert from "@app/utils/swal";

import { ISCConfig } from "@app/config/interfaces";

import { IRes } from "@app/utils/http";
import tval from "@app/utils/tval";
import config from "@app/config";
import crypto from "@app/utils/crypto";
import wagmiConfig, { ids } from "@app/providers/wagmi/config";

import store from '@app/store';

import {
  useReadSmart,
  EAbis,
  Address,
  getProtocolNameByChainId,
  EProtocol,
  isSupportedProtocol,
  IChainInfo,
} from "@app/hooks/useSmart";

import { useGoAndConnect } from "@app/hooks/useGoAndConnect";

import ActionBar from "@app/components/Layout/ActionBar";
import AppRoot from "@app/components/Layout/AppRoot";
import AppRowTitle from "@app/components/Layout/AppRowTitle";
import AppRow from "@app/components/Layout/AppRow";
import ConnectButton from "@app/components/Layout/ConnectButton";
import ContinueButton from "@app/components/Layout/ContinueButton";

import FooterShowChainInfo from "@app/components/common/FooterShowChainInfo";

import { IAppProps } from "@app/interfaces/app.interfaces";

const SelectProtocol: FC<IAppProps> = (props: IAppProps) => {

  useGoAndConnect();

  const navigate = useNavigate();
  const setLoader = store.system((state) => (state.setLoader));

  const chainInfo: IChainInfo = store.session((state) => (state.getChainInfo()));
  const setChainInfo = store.session((state) => (state.setChainInfo));

  // const chainIsSupported = useChainIsSupported(chainId);
  const { address, isConnecting, isDisconnected } = useAccount();

  const chains = useChains();
  const { chains: _chains, switchChain } = useSwitchChain()

  // const balanceOfRes = useReadSmart(chainInfo.protocolName, EAbis.erc20, {
  //   functionName: 'balanceOf',
  //   args: [address as Address],
  // });

  const [isPrtocolSelected, setPrtocolSelected] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);

  const selectProtocol = (chainId: number) => {

    // const chainIsSupported = useChainIsSupported(chainId);
    // if (!chainIsSupported)
    //   Alert.toast.error(`Unsupported chain selected: (chain-id: ${chainId})`);

    if (chainId === chainInfo.chainId) {
      Alert.toast.success(`Selected Protocol: ${chainInfo.protocolName}`);
      console.log(`#same chain-id. aborting...`);
      return;
    }

    setLoader("Processing....");

    const protocolName = getProtocolNameByChainId(chainId);
    if (tval.isUndefined(protocolName))
      Alert.toast.error(`Unsupported protocol selected: (chain-id: ${chainId})`);

    const isSupportedProtocolRes = isSupportedProtocol(protocolName as EProtocol);
    if (!isSupportedProtocolRes) {
      Alert.toast.error(`Unsupported: (protocol: ${protocolName})`);
      setLoader("");
      return;
    }

    const isInited = (!!chainId && !!protocolName);
    if (!isInited) {
      Alert.toast.error(`Protocol is not inited: (protocol: ${protocolName}})`);
      setLoader("");
      return;
    }

    setChainInfo({
      chainId,
      protocolName,
      isInited,
    });

    switchChain({ chainId });
    Alert.toast.success(`Selected Protocol: ${protocolName}`);
    setLoader("");
  }

  const onContinue = () => {
    if (!isPrtocolSelected) {
      return Alert.toast.success(`Please selected protocol`);
    }
    console.log(`redirect: /select-contract`);
    return navigate('/select-contract');
  }

  useEffect(() => {
    const chainId = getChainId(wagmiConfig);
    const protocolName = getProtocolNameByChainId(chainId);

    const isInited = (!!chainId && !!protocolName);
    if (isInited) {
      // console.log({ chainId, protocolName });
      // session.chainInfo.set({
      //   chainId,
      //   protocolName,
      //   isInited,
      // });
    }

  }, [chainInfo.chainId, chainInfo.protocolName,]);

  useEffect(() => {
    if (chainInfo.isInited) {
      setPrtocolSelected(true);
    }
  }, [chainInfo.chainId, chainInfo.protocolName, chainInfo.isInited]);

  return (
    <>

      <ActionBar disabled={false} onAction="/select-contract" />

      <AppRoot>

        <AppRowTitle>
          Select dApp Blockchain Protocol:
        </AppRowTitle>

        <AppRow withLine={true}>
          <div className="supported-chain-wrapper">
            {chains.map((chain) => {
              return (
                <div
                  key={chain.id}
                  className="supported-chain-item"
                >
                  <button
                    onClick={() => selectProtocol(chain.id)}
                    style={{ ...(chainInfo.chainId === chain.id ? { borderColor: "red" } : {}) }}
                  >
                    <div className="chain-icon">
                      <ChainIcon id={chain.id} />
                    </div>
                    <span>
                      {chain.name}
                    </span>
                  </button>
                </div>
              )
            })}
          </div>
        </AppRow>

        <AppRow withLine={true}>
          <ContinueButton onContinue={onContinue} />
        </AppRow>

        <AppRow withLine={true}>
          <FooterShowChainInfo {...chainInfo} />
        </AppRow>

      </AppRoot>

    </>

  );
};

export default SelectProtocol;

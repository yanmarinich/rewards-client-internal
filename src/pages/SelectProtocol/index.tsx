import React, { useEffect, FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChains, ChainIcon } from "connectkit";
import { useSwitchChain } from "wagmi";

import "@app/utils/prototype";
import "./index.scss";

import { IAppProps } from "@app/interfaces/app.interfaces";
import * as Alert from "@app/utils/swal";
import tval from "@app/utils/tval";
import store from '@app/store';

import {
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
import ContinueButton from "@app/components/Layout/ContinueButton";
import FooterShowChainInfo from "@app/components/common/FooterShowChainInfo";

const SelectProtocol: FC<IAppProps> = (props: IAppProps) => {

  useGoAndConnect();

  const navigate = useNavigate();
  const setLoader = store.system((state) => (state.setLoader));

  const chainInfo: IChainInfo = store.session((state) => (state.getChainInfo()));
  const setChainInfo = store.session((state) => (state.setChainInfo));
  const chains = useChains();
  const { chains: _chains, switchChain } = useSwitchChain()
  const [isPrtocolSelected, setPrtocolSelected] = useState<boolean>(false);

  const selectProtocol = (chainId: number) => {

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

    setChainInfo({ chainId, protocolName, isInited });
    switchChain({ chainId });
    Alert.toast.success(`Selected Protocol: ${protocolName}`);
    setLoader("");
  }

  const onContinue = () => {
    if (!isPrtocolSelected) {
      return Alert.toast.success(`Please selected protocol`);
    }
    return navigate('/select-contract');
  }

  useEffect(() => {
    // if (chainInfo.isInited) {
    setPrtocolSelected(true);
    // }
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

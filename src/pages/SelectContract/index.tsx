import React, { useEffect, FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getChains } from '@wagmi/core'
import { useAccount } from "wagmi";

import "./index.scss";

import "@app/utils/prototype";
import * as Alert from "@app/utils/swal";

import { ISCConfig } from "@app/config/interfaces";
import config from "@app/config";
// import crypto from "@app/utils/crypto";
import wagmiConfig, { ids } from "@app/providers/wagmi/config";
import store from '@app/store';

import {
  EAbis,
  IChainInfo,
  IContractItem,
  // useReadSmart,
  // Address,
  // getProtocolNameByChainId,
  // EProtocol,
  // isSupportedProtocol,
  // getWriteSmartProps
} from "@app/hooks/useSmart";

import { useGoAndConnect } from "@app/hooks/useGoAndConnect";

import ActionBar from "@app/components/Layout/ActionBar";
import AppRoot from "@app/components/Layout/AppRoot";
import AppRowTitle from "@app/components/Layout/AppRowTitle";
import AppRow from "@app/components/Layout/AppRow";
import ContinueButton from "@app/components/Layout/ContinueButton";

import FooterShowChainInfo from "@app/components/common/FooterShowChainInfo";

import { IAppProps } from "@app/interfaces/app.interfaces";
import { useContractConfig } from "@app/hooks/useContractConfig";

const SelectContract: FC<IAppProps> = (props: IAppProps) => {

  useGoAndConnect();

  // const { address, isConnecting, isDisconnected } = useAccount();
  // const setLoader = store.system((state) => (state.setLoader));

  const navigate = useNavigate();

  const chainInfo: IChainInfo = store.session((state) => (state.getChainInfo()));
  // const setChainInfo = store.session((state) => (state.setChainInfo));

  const selectedContract: number = store.session((state) => (state.getSelectedContract()));
  const setSelectedContract = store.session((state) => (state.setSelectedContract));

  const smartConfig: ISCConfig = store.session((state) => (state.getSmartConfig()));
  const setSmartConfig = store.session((state) => (state.setSmartConfig));

  // const chainIsSupported = useChainIsSupported(chainId);
  // const mChain = chains.find((chain: Chain) => (chain.id === chainInfo.chainId));
  // const { chains: _chains, switchChain } = useSwitchChain()
  // const chains = getChains(wagmiConfig);

  const cfg: ISCConfig = config.SC[chainInfo.protocolName];
  const contracts: IContractItem[] = useContractConfig(chainInfo).contracts;

  const selectContract = (index: number) => {

    if (!contracts[index]) {
      return Alert.toast.error(`Failed to selected contract`);
    }

    setSmartConfig(cfg);
    setSelectedContract(index);
  }

  const onContinue = () => {
    if (selectedContract === -1)
      return Alert.toast.success(`Please selected contract`);

    if (!smartConfig.isInited)
      return Alert.toast.success(`Selected contract is nit initialized`);

    const contract: IContractItem = contracts[selectedContract];
    // const path = `/use-contract/?type=${contract.abiName}`;
    const path = `/use-contract`;
    console.log(`redirect: ${path}`);
    navigate(path);
    return;
  }

  return (
    <>

      <ActionBar disabled={false} onAction="/select-protocol" />

      <AppRoot>

        <AppRowTitle>
          Select dApp Smart-Contract:
        </AppRowTitle>

        <AppRow withLine={true}>
          <div className="supported-chain-wrapper">
            {contracts.map((contract: IContractItem, index: number) => {
              return (
                <div
                  key={index}
                  className="supported-chain-item"
                >
                  <button
                    onClick={() => selectContract(index)}
                    style={{ ...(index === selectedContract ? { borderColor: "red" } : {}) }}
                  >
                    <span>
                      {contract.display}
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

export default SelectContract;

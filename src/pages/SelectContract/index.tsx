import React, { FC } from "react";
import "./index.scss";

import { useNavigate } from "react-router-dom";

import "@app/utils/prototype";
import { IAppProps } from "@app/interfaces/app.interfaces";
import * as Alert from "@app/utils/swal";
import { ISCConfig } from "@app/config/interfaces";
import config from "@app/config";
import store from '@app/store';

import {
  IChainInfo,
  IContractItem,
} from "@app/hooks/useSmart";

import { useGoAndConnect } from "@app/hooks/useGoAndConnect";
import { useContractConfig } from "@app/hooks/useContractConfig";

import ActionBar from "@app/components/Layout/ActionBar";
import AppRoot from "@app/components/Layout/AppRoot";
import AppRowTitle from "@app/components/Layout/AppRowTitle";
import AppRow from "@app/components/Layout/AppRow";
import ContinueButton from "@app/components/Layout/ContinueButton";
import FooterShowChainInfo from "@app/components/common/FooterShowChainInfo";


const SelectContract: FC<IAppProps> = (props: IAppProps) => {

  useGoAndConnect();

  const navigate = useNavigate();

  const chainInfo: IChainInfo = store.session((state) => (state.getChainInfo()));
  const selectedContract: number = store.session((state) => (state.getSelectedContract()));
  const setSelectedContract = store.session((state) => (state.setSelectedContract));
  const smartConfig: ISCConfig = store.session((state) => (state.getSmartConfig()));
  const setSmartConfig = store.session((state) => (state.setSmartConfig));
  const cfg: ISCConfig = config.SC[chainInfo.protocolName];
  const contracts: IContractItem[] = useContractConfig(chainInfo).contracts;

  const selectContract = (index: number) => {

    if (!contracts[index])
      return Alert.toast.error(`Failed to selected contract`);

    setSmartConfig(cfg);
    setSelectedContract(index);
  }

  const onContinue = () => {
    if (selectedContract === -1)
      return Alert.toast.success(`Please selected contract`);

    if (!smartConfig.isInited)
      return Alert.toast.success(`Selected contract is nit initialized`);

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

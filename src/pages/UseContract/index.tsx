import React, { useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";
import { Chain } from "wagmi/chains";
import { getChains } from '@wagmi/core'

import "./index.scss";
import "@app/utils/prototype";
import { IAppProps } from "@app/interfaces/app.interfaces";

import * as Alert from "@app/utils/swal";
import wagmiConfig, { ids } from "@app/providers/wagmi/config";
import store from '@app/store';

import { IChainInfo, IContractItem } from "@app/hooks/useSmart";
import { useGoAndConnect } from "@app/hooks/useGoAndConnect";
import { useContractConfig } from "@app/hooks/useContractConfig";

import ActionBar from "@app/components/Layout/ActionBar";
import AppRoot from "@app/components/Layout/AppRoot";
import AppRowTitle from "@app/components/Layout/AppRowTitle";
import AppRow from "@app/components/Layout/AppRow";
import FooterShowChainInfo from "@app/components/common/FooterShowChainInfo";

import ContractToken from "./contracts/Token";
import RewardContractUser from "./contracts/RewardContractUser";
import RewardContractAdmin from "./contracts/RewardContractAdmin";
import AccessControl from "./contracts/AccessControl";

const UserContract: FC<IAppProps> = (props: IAppProps) => {

  useGoAndConnect();

  const navigate = useNavigate();

  const chainInfo: IChainInfo = store.session((state) => (state.getChainInfo()));
  const selectedContract: number = store.session((state) => (state.getSelectedContract()));
  const chains = getChains(wagmiConfig);
  const mChain = chains.find((chain: Chain) => (chain.id === chainInfo.chainId));
  const isContractSelected = (selectedContract !== -1);
  const contracts: IContractItem[] = useContractConfig(chainInfo).contracts;

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
    RewardContractUser,
    RewardContractAdmin,
    AccessControl,
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

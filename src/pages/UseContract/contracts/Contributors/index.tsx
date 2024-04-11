import React, { useEffect, FC, useState } from "react";

import "./index.scss";
import "@app/utils/prototype";
import { IAppProps } from "@app/interfaces/app.interfaces";
import store from '@app/store';
import { IChainInfo, IContractItem } from "@app/hooks/useSmart";
import { useContractConfig } from "@app/hooks/useContractConfig";

import { ICommonProps } from "../interfaces";
import AppRow from "@app/components/Layout/AppRow";

import ViewManager from "./ViewManager";
import WriteManager from "./WriteManager";
import { IContributorsState } from "@app/store/types/interfaces/session";


const actions: React.FC<ICommonProps>[] = [
  ViewManager,
  WriteManager,
];

interface ISubViewAppProps extends ICommonProps {
  subViewId: number;
}

const RenderSubView: FC<ISubViewAppProps> = ({ chainInfo, abiName, contracts, subViewId }) => {
  const SubView = actions[subViewId];
  return (
    <SubView
      chainInfo={chainInfo}
      abiName={abiName}
      contracts={contracts}
    />
  );
}

const Contributors: FC<IAppProps> = (props: IAppProps) => {

  const chainInfo: IChainInfo = store.session((state) => (state.getChainInfo()));
  const selectedContract: number = store.session((state) => (state.getSelectedContract()));
  const contributorsState: IContributorsState = store.session((state) => (state.getContributorsState()));
  const setContributorState = store.session((state) => (state.setContributorsState));

  const [stateId, setStateId] = useState<number>(0);

  const contracts: IContractItem[] = useContractConfig(chainInfo).contracts;
  const contract = contracts[selectedContract];

  const onUpdateRequired = () => { setStateId(Date.now()); }

  const setSubViewId = (id: number) => {
    setContributorState({
      ...contributorsState,
      subViewId: id
    });
  }

  useEffect(() => {
    if (selectedContract === -1) return;
    if (!stateId) setStateId(Date.now());
  }, [selectedContract, stateId]);


  return (
    <div key={`state-${stateId}`}>

      <AppRow withLine={false}>
        <button
          className={`system-btn h-m-10 ${contributorsState.subViewId === 0 && 'system-btn-active'}`}
          onClick={() => { setSubViewId(0) }}
        >
          View
        </button>
        <button
          className={`system-btn h-m-10 ${contributorsState.subViewId === 1 && 'system-btn-active'}`}
          onClick={() => { setSubViewId(1) }}
        >
          Manage
        </button>
      </AppRow>

      <RenderSubView
        subViewId={contributorsState.subViewId}
        chainInfo={chainInfo}
        abiName={contract.abiName}
        contracts={contracts}
        onUpdateRequired={onUpdateRequired}
      />
    </div>
  );
};

export default Contributors;

import React, { useEffect, FC, useState } from "react";

import "./index.scss";
import "@app/utils/prototype";
import { IAppProps } from "@app/interfaces/app.interfaces";
import store from '@app/store';
import { IChainInfo, IContractItem } from "@app/hooks/useSmart";
import { useContractConfig } from "@app/hooks/useContractConfig";

// import Balance from "./Balance";
// import Allowance from "./Allowance";
// import IncreaseAllowance from "./IncreaseAllowance";

import { ICommonProps } from "../interfaces";
import AppRow from "@app/components/Layout/AppRow";

import ViewManager from "./ViewManager";
import WriteManager from "./WriteManager";


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

  const [subViewId, setSubViewId] = useState<number>(0);

  const [stateId, setStateId] = useState<number>(0);
  const chainInfo: IChainInfo = store.session((state) => (state.getChainInfo()));
  const selectedContract: number = store.session((state) => (state.getSelectedContract()));
  const contracts: IContractItem[] = useContractConfig(chainInfo).contracts;
  const contract = contracts[selectedContract];


  const onUpdateRequired = () => {
    setStateId(Date.now());
  }

  useEffect(() => {
    if (selectedContract === -1) return;
    if (!stateId) setStateId(Date.now());
  }, [selectedContract, stateId]);


  return (
    <div key={`state-${stateId}`}>

      <AppRow withLine={false}>
        <button
          className={`system-btn h-m-10 ${subViewId === 0 && 'system-btn-active'}`}
          onClick={() => { setSubViewId(0) }}
        >
          View
        </button>
        <button
          className={`system-btn h-m-10 ${subViewId === 1 && 'system-btn-active'}`}
          onClick={() => { setSubViewId(1) }}
        >
          Manage
        </button>
      </AppRow>

      <RenderSubView
        subViewId={subViewId}
        chainInfo={chainInfo}
        abiName={contract.abiName}
        contracts={contracts}
      />
    </div>
  );
};

export default Contributors;

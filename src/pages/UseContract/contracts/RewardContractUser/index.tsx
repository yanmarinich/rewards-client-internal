import React, { useEffect, FC, useState } from "react";

import "./index.scss";
import "@app/utils/prototype";
import { IAppProps } from "@app/interfaces/app.interfaces";

import store from '@app/store';

import { EAbis, IChainInfo, IContractItem } from "@app/hooks/useSmart";
import { useContractConfig } from "@app/hooks/useContractConfig";

import AllowedToDeposit from "./AllowedToDeposit";
import AllowedToWithdraw from "./AllowedToWithdraw";
import Balance from "../Token/Balance";


const RewardContractUser: FC<IAppProps> = (props: IAppProps) => {

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

      <Balance
        chainInfo={chainInfo}
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

    </div>
  );
};

export default RewardContractUser;

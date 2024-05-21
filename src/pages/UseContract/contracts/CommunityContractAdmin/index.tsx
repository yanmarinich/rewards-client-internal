import React, { useEffect, FC, useState } from "react";

import "./index.scss";
import "@app/utils/prototype";
import { IAppProps } from "@app/interfaces/app.interfaces";

import store from '@app/store';

import { Address, EAbis, IChainInfo, IContractItem } from "@app/hooks/useSmart";
import { useContractConfig } from "@app/hooks/useContractConfig";

import SelectTokenContract from "./SelectTokenContract";
import ShowAdmins from "./ShowAdmins";

const CommunityContractAdmin: FC<IAppProps> = (props: IAppProps) => {

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

      <SelectTokenContract
        chainInfo={chainInfo}
        abiName={contract.abiName}
        contracts={contracts}
        onUpdateRequired={onUpdateRequired}
      />

      <ShowAdmins
        chainInfo={chainInfo}
        abiName={EAbis.erc20}
        contracts={contracts}
      />

    </div>
  );
};

export default CommunityContractAdmin;

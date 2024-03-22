
import "@app/utils/prototype";

import tval from "@app/utils/tval";
import config from "@app/config";
import { EAbis, IRes } from "@app/contracts";
import { IChainInfo, IContractItem } from "./useSmart";
import { ISCConfig } from "@app/config/interfaces";


export interface IUseContractConfigRes extends IRes {
  contracts: IContractItem[];
}

export const useContractConfig = (chainInfo: IChainInfo): IUseContractConfigRes => {
  const contracts: IContractItem[] = [];

  try {
    const cfg: ISCConfig = config.SC[chainInfo.protocolName] || {};

    contracts.push(
      { display: 'Thrive-Coin', addres: cfg?.erc20?.address, abiName: EAbis.erc20 }
    );
    contracts.push(
      { display: 'Reward Contract', addres: cfg?.proxy?.address, abiName: EAbis.proxy }
    );
    contracts.push(
      { display: 'Access-Control', addres: cfg?.accessControl?.address, abiName: EAbis.accessControl }
    );

    const success = !!(cfg?.erc20?.address);
    const message = success ? "success" : "Failed to get contracts";
    return { success, message, contracts };

  } catch (e: any) {
    console.error(`#useContractConfig: ${e.message}`);
    return { success: false, message: e.message, contracts };

  }

}



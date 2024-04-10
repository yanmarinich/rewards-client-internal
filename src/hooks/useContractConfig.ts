import "@app/utils/prototype";

import config from "@app/config";
import { EAbis, IRes } from "@app/contracts";
import { IChainInfo, IContractItem } from "./useSmart";
import { ISCConfig } from "@app/config/interfaces";

export interface IUseContractConfigRes extends IRes {
  contracts: IContractItem[];
}

export const useContractConfig = (chainInfo: IChainInfo): IUseContractConfigRes => {

  try {

    const cfg: ISCConfig = config.SC[chainInfo.protocolName] || {};

    const contracts: IContractItem[] = [
      { display: 'Thrive-Coin', addres: cfg?.erc20?.address, abiName: EAbis.erc20 },
      { display: 'Reward Contract (User)', addres: cfg?.proxy?.address, abiName: EAbis.proxy },
      { display: 'Reward Contract (Admin)', addres: cfg?.proxy?.address, abiName: EAbis.proxy },
      { display: 'Access-Control', addres: cfg?.accessControl?.address, abiName: EAbis.accessControl },
      // ---------------------
      // { display: 'Community-Factory', addres: cfg?.communityFactory?.address, abiName: EAbis.communityFactory },
      { display: 'Community-Contract (User)', addres: cfg?.communityAddress?.address, abiName: EAbis.communityAddress },
      { display: 'Community-Contract (Admin)', addres: cfg?.communityAddress?.address, abiName: EAbis.communityAddress },
      // ---------------------
      { display: 'Contributors', addres: cfg?.contributorsAddress.address, abiName: EAbis.contributorsAddress },
    ];

    const success = !!(cfg?.erc20?.address);
    const message = success ? "success" : "Failed to get contracts";
    return { success, message, contracts };

  } catch (e: any) {
    console.error(`#useContractConfig: ${e.message}`);
    return { success: false, message: e.message, contracts: [] };

  }

}



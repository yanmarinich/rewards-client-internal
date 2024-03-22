import { WagmiProvider, createConfig, http, Config } from 'wagmi';
import { getDefaultConfig } from 'connectkit';

import config from "@app/config";

import {
  // mainnet, 
  arbitrum,
  fantom,
  fantomTestnet,
  // polygon, 
  // polygonMumbai,
  Chain,
} from "wagmi/chains";

import arbitrumTestnet from "./custom-protocols/arbitrum-testnet";

export interface IIDs { [key: number]: string }

export const ids: IIDs = {
  [arbitrumTestnet.id]: "arbitrumTestnet",
  [arbitrum.id]: "arbitrum",
  [fantomTestnet.id]: "fantomTestnet",
  [fantom.id]: "fantom",
};

const wagmiConfig: Config = createConfig(
  getDefaultConfig({
    chains: [
      arbitrum,
      arbitrumTestnet,
      fantom,
      fantomTestnet,
      // polygon,
      // mainnet,
    ],
    transports: {
      [arbitrumTestnet.id]: http(arbitrumTestnet.rpcUrls.default.http[0]),
      [arbitrum.id]: http(arbitrum.rpcUrls.default.http[0]),
      [fantomTestnet.id]: http(fantomTestnet.rpcUrls.default.http[0]),
      [fantom.id]: http(fantom.rpcUrls.default.http[0]),
    },
    appName: config.appName,
    walletConnectProjectId: config.walletConnectProjectId,
  })
);

export default wagmiConfig;
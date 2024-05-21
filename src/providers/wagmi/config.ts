import { WagmiProvider, createConfig, http, Config } from 'wagmi';
import { getDefaultConfig } from 'connectkit';

import config from "@app/config";

import {
  // arbitrum,
  // fantom,
  // fantomTestnet,
  // polygon,
  // polygonMumbai as polygonTestnet,
  // Chain,
} from "wagmi/chains";

import arbitrumTestnet from "./custom-protocols/arbitrum-testnet";

export interface IIDs { [key: number]: string }

export const ids: IIDs = {
  [arbitrumTestnet.id]: "arbitrumTestnet",
  // [arbitrum.id]: "arbitrum",
  // [fantomTestnet.id]: "fantomTestnet",
  // [fantom.id]: "fantom",
  // [polygon.id]: "polygon",
  // [polygonTestnet.id]: "polygonTestnet",
};

const wagmiConfig: Config = createConfig(
  getDefaultConfig({
    chains: [
      arbitrumTestnet,
      // arbitrum,
      // fantomTestnet,
      // fantom,
      // polygon,
      // polygonTestnet,
    ],
    transports: {
      [arbitrumTestnet.id]: http(arbitrumTestnet.rpcUrls.default.http[0]),
      // [arbitrum.id]: http(arbitrum.rpcUrls.default.http[0]),
      // [fantomTestnet.id]: http(fantomTestnet.rpcUrls.default.http[0]),
      // [fantom.id]: http(fantom.rpcUrls.default.http[0]),
      // [polygon.id]: http(polygon.rpcUrls.default.http[0]),
      // [polygonTestnet.id]: http(polygonTestnet.rpcUrls.default.http[0]),
    },
    appName: config.appName,
    walletConnectProjectId: config.walletConnectProjectId,
  })
);

export default wagmiConfig;
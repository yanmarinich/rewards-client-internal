import { initSmartContractEnvs } from "./init-smart-contract-envs";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const walletConnectProjectId = import.meta.env.VITE_API_WALLET_CONNECT_PROJECT_ID;
const appName = import.meta.env.VITE_API_APP_NAME || 'ConnectKit CRA demo';

const arbitrumTestnet = initSmartContractEnvs('ARBITRUM', 'TESTNET');
const arbitrum = initSmartContractEnvs('ARBITRUM', 'MAINNET');

const fantom = initSmartContractEnvs('FANTOM', 'TESTNET');
const fantomTestnet = initSmartContractEnvs('FANTOM', 'TESTNET');

export default {
  baseUrl,
  walletConnectProjectId,
  appName,
  SC: {
    arbitrum,
    arbitrumTestnet,
    fantom,
    fantomTestnet,
  }
};


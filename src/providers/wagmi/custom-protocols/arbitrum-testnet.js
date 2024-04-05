import { defineChain } from 'viem'
import config from "@app/config";

const arbitrumTestnet = /*#__PURE__*/ defineChain({
  id: 421614,
  name: 'Arbitrum Sepolia',
  nativeCurrency: {
    name: 'Arbitrum Sepolia Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [
        // Testnet (Sepolia)	JSON-RPC over HTTPS
        `https://arbitrum-sepolia.infura.io/v3/${config.infuraApiKey}`,

        'https://public.stackup.sh/api/v1/node/arbitrum-sepolia', // sometimes: hit request-limit  

        'https://arbitrum-sepolia.blockpi.network/v1/rpc/public ',
        'https://sepolia-rollup.arbitrum.io/rpc', // sometimes error

        // Testnet (Sepolia)	JSON-RPC over WebSocket
        // 'wss://arbitrum-sepolia.infura.io/ws/v3/<API-KEY>',

      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Arbiscan (sepolia)',
      url: 'https://sepolia.arbiscan.io',
      apiUrl: 'https://api-sepolia.arbiscan.io/api',
    },
  },
  // contracts: {
  //   multicall3: {
  //     address: '0xca11bde05977b3631167028862be2a173976ca11',
  //     blockCreated: 81930,
  //   },
  // },
  testnet: true,
});

export default arbitrumTestnet;

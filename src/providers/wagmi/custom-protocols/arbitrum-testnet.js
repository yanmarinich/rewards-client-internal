import { defineChain } from 'viem'

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
        'https://public.stackup.sh/api/v1/node/arbitrum-sepolia',
        'https://sepolia-rollup.arbitrum.io/rpc',
        'https://arbitrum-sepolia.blockpi.network/v1/rpc/public ',
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
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 81930,
    },
  },
  testnet: true,
});

export default arbitrumTestnet;

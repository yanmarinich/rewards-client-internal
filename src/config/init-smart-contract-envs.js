const requiredKeys = [
  'proxy',
  'impl',
  'erc20',
  'accessControl',
  'communityFactory',
  'communityAddress',
  'contributorsAddress',
];

const state = {
  envs: {},
  isInited: false,
};

const getEnvs = (protocol, network = 'testnet') => {
  if (state.isInited)
    return state.envs;

  protocol = protocol.toUpperCase();
  network = network.toUpperCase();
  const prefix = `VITE_API_${protocol}_${network}`;

  const envs = {
    proxy: {
      address: import.meta.env[`${prefix}_PROXY_ADDRESS`],
    },
    impl: {
      address: import.meta.env[`${prefix}_IMPL_ADDRESS`],
    },
    erc20: {
      address: import.meta.env[`${prefix}_ERC20_ADDRESS`],
    },
    accessControl: {
      address: import.meta.env[`${prefix}_ACCESS_CONTROL_ADDRESS`],
    },
    communityFactory: {
      address: import.meta.env[`${prefix}_COMMUNITY_FACTORY`],
    },
    communityAddress: {
      address: import.meta.env[`${prefix}_COMMUNITY_ADDRESS`],
    },
    contributorsAddress: {
      address: import.meta.env[`${prefix}_CONTRIBUTORS_ADDRESS`],
    },
    isInited: true,
  };

  envs.isInited = !!requiredKeys.find((key) => (
    !!envs[key]?.address
  ));

  state.envs = envs;
  state.isInited = envs.isInited;
  return state.envs;

}

export const initSmartContractEnvs = (protocol, network = 'testnet') => {
  const envs = getEnvs(protocol, network);
  return envs;
}



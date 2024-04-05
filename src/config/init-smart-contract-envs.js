const requiredKeys = [
  'proxy',
  'impl',
  'erc20',
  'accessControl',
  'communityFactory',
  'communityAddress',
];

export const initSmartContractEnvs = (protocol, network = 'testnet') => {

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
    isInited: false,
  };

  envs.isInited = !!requiredKeys.find((key) => (
    !!envs[key]?.address
  ));

  return envs;

}



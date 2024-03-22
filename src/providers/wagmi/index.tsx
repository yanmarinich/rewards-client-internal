import React from 'react';

import { WagmiProvider } from 'wagmi';

import wagmiConfig from "./config";

const MWagmiProvider = ({ children }: { children: React.ReactNode }) => {

  return (
    <WagmiProvider config={wagmiConfig}>
      {children}
    </WagmiProvider>
  );
};

export default MWagmiProvider; 
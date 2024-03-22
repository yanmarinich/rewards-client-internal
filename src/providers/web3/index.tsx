import React from 'react';

import MWagmiProvider from '../wagmi';
import MQueryClientProvider from '../query-client';

import { ConnectKitProvider, getDefaultConfig } from 'connectkit';

const MWeb3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MWagmiProvider>
      <MQueryClientProvider>
        <ConnectKitProvider debugMode>{children}</ConnectKitProvider>
      </MQueryClientProvider>
    </MWagmiProvider>
  );
};

export default MWeb3Provider;
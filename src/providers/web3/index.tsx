import React from 'react';

import MWagmiProvider from '../wagmi';
import MQueryClientProvider from '../query-client';

import { ConnectKitProvider, getDefaultConfig } from 'connectkit';
import { ConnectKitOptions } from 'connectkit/build/types';

const connection = {
  address: "",
  connectorId: "",
};

const options: ConnectKitOptions = {
  // language?: Languages;
  // hideBalance?: boolean;
  // hideTooltips?: boolean;
  // hideQuestionMarkCTA?: boolean;
  // hideNoWalletCTA?: boolean;
  // hideRecentBadge?: boolean;
  // walletConnectCTA?: 'link' | 'modal' | 'both';
  // avoidLayoutShift?: boolean;
  // embedGoogleFonts?: boolean;
  // truncateLongENSAddress?: boolean;
  walletConnectName: "Other Wallets",
  reducedMotion: true,
  disclaimer: (<i>This is disclaimer</i>),
  // bufferPolyfill?: boolean;
  // customAvatar?: React.FC<CustomAvatarProps>;
  // initialChainId?: number;
  // enforceSupportedChains: true,
  // ethereumOnboardingUrl?: string;
  // walletOnboardingUrl?: string;
  // disableSiweRedirect?: boolean;
  overlayBlur: 0.75,
}

const MWeb3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MWagmiProvider>
      <MQueryClientProvider>
        <ConnectKitProvider
          debugMode
          options={options}
          onConnect={({ address, connectorId }) => {
            console.log(`#ConnectKit: onConnect:`);
            connection.address = address as string;
            connection.connectorId = connectorId as string;
            console.json({ connected: { connection } });
          }}
          onDisconnect={() => {
            console.log(`#ConnectKit: onDisconnect:`);
            console.json({ disconnected: { connection } });
          }}
        >
          {children}
        </ConnectKitProvider>

      </MQueryClientProvider>
    </MWagmiProvider>
  );
};

export default MWeb3Provider;
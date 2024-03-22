import React from 'react';

import Provider from './web3';

const MProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      {children}
    </Provider>
  );
};

export default MProvider;
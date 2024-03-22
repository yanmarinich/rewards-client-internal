import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useChains, ChainIcon } from "connectkit";
import { useAccount, useSwitchChain } from "wagmi";

import "./index.scss";
import "@app/utils/prototype";
import { IAppProps } from "@app/interfaces/app.interfaces"

import ActionBar from "@app/components/Layout/ActionBar";
import ConnectButton from "@app/components/Layout/ConnectButton";
import ContinueButton from "@app/components/Layout/ContinueButton";
import AppRoot from "@app/components/Layout/AppRoot";
import AppRowTitle from "@app/components/Layout/AppRowTitle";
import AppRow from "@app/components/Layout/AppRow";

const LandingPage: FC<IAppProps> = (props: IAppProps) => {
  const navigate = useNavigate();

  const { address, isConnecting, isDisconnected } = useAccount();

  const chains = useChains();
  const { chains: _chains, switchChain } = useSwitchChain()
  const _connected = (isConnecting || !isDisconnected) && address;

  const onContinue = (): void => {
    navigate('/select-protocol');
  }

  return (
    <>

      <ActionBar disabled={true} onAction="/" />

      <AppRoot>

        <AppRowTitle>
          This dApp is supported on the following chains:
        </AppRowTitle>

        <AppRow withLine={true}>
          <div className="supported-chain-wrapper">
            {chains.map((chain) => {
              return (
                <div
                  key={chain.id}
                  className="supported-chain-item"
                >
                  <div className="chain-icon">
                    <ChainIcon id={chain.id} />
                  </div>
                  <div className="chain-item-name">
                    {chain.name}
                  </div>
                </div>
              )
            })}
          </div>
        </AppRow>

        {_connected && (
          <AppRow withLine={true}>
            <ContinueButton onContinue={onContinue} />
          </AppRow>
        )}

        {!_connected && (
          <AppRow withLine={true}>
            <ConnectButton />
          </AppRow>
        )}

        <AppRow withLine={true}>
          <h4>Connect more networks for more rewards</h4>
          {/* <h4>We will now be connecting to your {providerName} account. </h4> */}
          <h4>Verified identities are never exposed.</h4>
        </AppRow>

      </AppRoot>

    </>

  );

};

export default LandingPage;

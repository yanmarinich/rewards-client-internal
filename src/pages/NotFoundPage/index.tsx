import React, { useEffect, FC } from "react";
import { useNavigate } from "react-router-dom";

import "./index.scss";
import "@app/utils/prototype";
import * as Alert from "@app/utils/swal";

import { IAppProps } from "@app/interfaces/app.interfaces"


import TopBar from "@app/components/Layout/TopBar";
import ActionBar from "@app/components/Layout/ActionBar";
import AppRoot from "@app/components/Layout/AppRoot";
import AppRowTitle from "@app/components/Layout/AppRowTitle";
import AppRow from "@app/components/Layout/AppRow";
import ConnectButton from "@app/components/Layout/ConnectButton";
import ContinueButton from "@app/components/Layout/ContinueButton";

import FooterShowChainInfo from "@app/components/common/FooterShowChainInfo";

const NotFoundPage: FC<IAppProps> = (props: IAppProps) => {

  const navigate = useNavigate();

  const onContinue = () => {
    navigate('/');
  }

  return (
    <>

      {/* <TopBar /> */}

      <ActionBar disabled={false} onAction="/" />

      <AppRoot>

        <AppRowTitle>
          404 - Page not found
        </AppRowTitle>

        <AppRow withLine={true}>
          It appears that the page you sought is not found.
        </AppRow>

        <AppRow withLine={true}>

          <ContinueButton
            onContinue={onContinue}
            text="Back to Home"
          />

        </AppRow>

      </AppRoot>
    </>
  )

};

export default NotFoundPage;
import React, { FC } from "react";
import { Outlet } from "react-router-dom";

import "./index.scss";
import "@app/utils/prototype";

import TopBar from "@app/components/Layout/TopBar";
import { IAppProps } from "@app/interfaces/app.interfaces";

const LayoutMain: FC<IAppProps> = ({ children }: IAppProps) => {

  return (
    <>
      <TopBar />
      <div>
        <Outlet />
      </div>
    </>
  );
};

export default LayoutMain;
